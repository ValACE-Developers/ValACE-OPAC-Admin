import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import { NotificationContainer, useNotification } from '../hooks/useNotification.jsx';
import { useUpdateResource } from '../hooks/resources/useUpdateResource.js';
import { useMutation } from '@tanstack/react-query';
import {
    BasicInformationSection,
    MediaSection,
    ApiConfigurationSection,
    EndpointsSection,
} from '../components/page_components/create_api_resource_page/index.js';
import {
    ChevronLeft,
    Database,
} from 'lucide-react';

const emptyKv = () => ({ key: '', value: '' });
const normalizeKvArray = (input) => {
    if (Array.isArray(input)) {
        return input.map((p) => ({ key: p?.key ?? '', value: p?.value ?? '' }));
    }
    if (input && typeof input === 'object') {
        try {
            return Object.entries(input).map(([k, v]) => ({ key: k ?? '', value: String(v ?? '') }));
        } catch {
            return [emptyKv()];
        }
    }
    return [emptyKv()];
};

// Special function to normalize field_map data to ensure we have the required fields
const normalizeFieldMap = (input) => {
    const requiredFields = ['title', 'authors', 'subject', 'isbn', 'issn', 'thumbnail'];
    let fieldMap = [];
    
    if (Array.isArray(input)) {
        fieldMap = input.map((p) => ({ key: p?.key ?? '', value: p?.value ?? '' }));
    } else if (input && typeof input === 'object') {
        try {
            fieldMap = Object.entries(input).map(([k, v]) => ({ key: k ?? '', value: String(v ?? '') }));
        } catch {
            fieldMap = [];
        }
    }
    
    // Ensure all required fields are present
    const result = [];
    requiredFields.forEach(field => {
        const existing = fieldMap.find(fm => fm.key === field);
        if (existing) {
            result.push(existing);
        } else {
            // Check for common field name variations
            const variations = {
                'authors': ['author', 'creators', 'writer'],
                'subject': ['subjects', 'categories', 'genre', 'description'],
                'thumbnail': ['image', 'cover', 'book_image', 'cover_image']
            };
            
            const fieldVariations = variations[field] || [];
            const variantMatch = fieldMap.find(fm => fieldVariations.includes(fm.key));
            
            if (variantMatch) {
                result.push({ key: field, value: variantMatch.value });
            } else {
                result.push({ key: field, value: '' });
            }
        }
    });
    
    return result;
};

const EndpointSchema = z.object({
    label: z.string()
        .min(1, 'Label is required')
        .max(100, 'Label must be less than 100 characters')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Label can only contain letters, numbers, spaces, hyphens, and underscores'),
    endpoint_path: z.string()
        .min(1, 'Endpoint path is required')
        .max(500, 'Endpoint path must be less than 500 characters')
        .regex(/^\/[a-zA-Z0-9\-\/_{}]*$/, 'Endpoint path must start with / and contain only valid URL characters')
        .refine((path) => {
            // Additional validation for path structure
            if (path === '/') return false; // Root path not allowed
            if (path.endsWith('/')) return false; // Cannot end with /
            if (path.includes('//')) return false; // Cannot have double slashes
            return true;
        }, {
            message: 'Endpoint path must be a valid API path (e.g., /v1/books, /api/search)'
        }),
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    collection_name: z.string()
        .min(1, 'Collection name is required')
        .max(100, 'Collection name must be less than 100 characters')
        .regex(/^[a-zA-Z0-9._\[\]]+$/, 'Collection name must use dot notation (e.g., items, data.results, books[0])'),
    query_params: z.array(z.object({ 
        key: z.string()
            .max(100, 'Query param key must be less than 100 characters')
            .regex(/^[a-zA-Z0-9\-_]+$/, 'Query param key can only contain letters, numbers, hyphens, and underscores'),
        value: z.string().max(500, 'Query param value must be less than 500 characters')
    })).optional()
    .refine((params) => {
        if (!params) return true;
        // Check for duplicate keys
        const keys = params.map(p => p.key.toLowerCase()).filter(k => k.trim() !== '');
        const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
        return duplicateKeys.length === 0;
    }, {
        message: 'Query parameters cannot have duplicate keys'
    }),
    field_map: z.array(z.object({ 
        key: z.string().min(1, 'Field key is required').max(50, 'Field key must be less than 50 characters'),
        value: z.string()
            .max(200, 'Field value must be less than 200 characters')
            .refine((val) => {
                // Allow empty strings or valid dot notation
                if (val === '') return true;
                return /^[a-zA-Z0-9._\[\]]+$/.test(val);
            }, 'Field value must use dot notation (e.g., title, volumeInfo.title, items[0].name) or be empty')
    })).min(6, 'All 6 required field mappings must be provided').max(6, 'Exactly 6 field mappings are required'),
    description: z
    .union([
      z.string()
        .min(0, 'Description must be at least 0 characters')
        .max(500, 'Description must be less than 500 characters'),
      z.undefined(),
    ]),
  
   // optional: allow empty string too
  
    page_configuration: z.object({
        type: z.enum(['OFFSET', 'PAGE', 'CURSOR']).optional(),
        page_key: z.string().max(50, 'Page key must be less than 50 characters').optional(),
        per_page_key: z.string().max(50, 'Per page key must be less than 50 characters').optional(),
        default_per_page: z.coerce.number().int('Default per page must be an integer').min(1, 'Default per page must be at least 1').max(1000, 'Default per page must be at most 1000').optional(),
        max_per_page: z.coerce.number().int('Max per page must be an integer').min(1, 'Max per page must be at least 1').max(1000, 'Max per page must be at most 1000').optional(),
    }).optional().refine((config) => {
        if (!config || !config.type) return true; // Optional field
        // If type is provided, page_key and per_page_key should be provided
        if (config.type && (!config.page_key || !config.per_page_key)) {
            return false;
        }
        return true;
    }, {
        message: 'Page key and per page key are required when pagination type is selected'
    }),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
    sync_status: z.enum(['IDLE', 'FAILED', 'COMPLETED']).default('IDLE'),
}).superRefine((data, ctx) => {
    // Validate that all required field mappings are present
    const requiredFields = ['title', 'authors', 'subject', 'isbn', 'issn', 'thumbnail'];
    const fieldKeys = data.field_map.map(fm => fm.key);
    
    requiredFields.forEach(field => {
        if (!fieldKeys.includes(field)) {
            ctx.addIssue({ 
                code: 'custom', 
                path: ['field_map'], 
                message: `Required field mapping for '${field}' is missing` 
            });
        }
    });
    
    // Validate that title field has a value (required field)
    const titleMapping = data.field_map.find(fm => fm.key === 'title');
    if (titleMapping && (!titleMapping.value || titleMapping.value.trim().length === 0)) {
        ctx.addIssue({ 
            code: 'custom', 
            path: ['field_map'], 
            message: 'Title field mapping is required and must have a source field value' 
        });
    }
});

const schema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z0-9\s\-_&().,]+$/, 'Name can only contain letters, numbers, spaces, and common punctuation'),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be less than 500 characters')
        .regex(/^[a-zA-Z0-9\s\-_&().,!'"]+$/, 'Description contains invalid characters'),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    image_cover: z.any()
        .optional()
        .refine((file) => {
            if (!file) return true; // Optional field
            if (file instanceof File) {
                // Check file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    return false;
                }
                // Check file size (5MB limit)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    return false;
                }
            }
            return true;
        }, {
            message: 'Image must be a valid image file (JPEG, PNG, GIF, WebP) and less than 5MB'
        }),
    api_resource: z
        .object({
            base_url: z.string()
                .url('Enter a valid base URL')
                .max(500, 'Base URL must be less than 500 characters')
                .regex(/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/, 'Base URL must be a valid HTTP/HTTPS URL'),
            endpoint: z.string()
                .max(500, 'Endpoint must be less than 500 characters')
                .regex(/^\/[a-zA-Z0-9\-\/_{}]*$/, 'Endpoint must start with / and contain only valid URL characters')
                .optional(),
            configuration: z.record(z.any()).optional(),
            sync_status: z.enum(['IDLE', 'SYNCING']).default('IDLE'),
            auth_location: z.enum(['HEADER', 'PARAM_QUERY', 'BODY', 'NONE']),
            auth_type: z.enum(['NONE', 'API_KEY', 'BEARER', 'BASIC']),
            auth_key_name: z.string()
                .max(100, 'Auth key name must be less than 100 characters')
                .regex(/^[a-zA-Z0-9\-_]+$/, 'Auth key name can only contain letters, numbers, hyphens, and underscores')
                .optional()
                .default(''),
            auth_key_value: z.string()
                .max(500, 'Auth key value must be less than 500 characters')
                .optional()
                .default(''),
            timeout: z.coerce.number()
                .int('Timeout must be an integer')
                .min(1, 'Timeout must be at least 1 second')
                .max(300, 'Timeout must be at most 300 seconds'),
            retry_attempts: z.coerce.number()
                .int('Retry attempts must be an integer')
                .min(0, 'Retry attempts cannot be negative')
                .max(10, 'Retry attempts must be at most 10'),
        rate_limit: z.object({
                requests_per_minute: z.coerce.number()
                    .int('RPM must be an integer')
                    .min(0, 'RPM cannot be negative')
                    .max(10000, 'RPM cannot exceed 10,000'),
                burst_limit: z.coerce.number()
                    .int('Burst limit must be an integer')
                    .min(0, 'Burst limit cannot be negative')
                    .max(10000, 'Burst limit cannot exceed 10,000'),
            }),
            headers: z.array(z.object({ 
                key: z.string()
                    .max(100, 'Header key must be less than 100 characters')
                    .regex(/^[a-zA-Z0-9\-_]+$/, 'Header key can only contain letters, numbers, hyphens, and underscores'),
                value: z.string().max(1000, 'Header value must be less than 1000 characters')
            })).optional(),
            endpoints: z.array(EndpointSchema).min(1, 'At least one endpoint is required').max(10, 'Maximum 10 endpoints allowed'),
        })
        .superRefine((data, ctx) => {
            // Auth validation
            if (data.auth_type !== 'NONE') {
                if (!data.auth_key_name || data.auth_key_name.trim().length === 0) {
                    ctx.addIssue({ code: 'custom', path: ['auth_key_name'], message: 'Auth key name is required for selected auth type' });
                }
                if (!data.auth_key_value || data.auth_key_value.trim().length === 0) {
                    ctx.addIssue({ code: 'custom', path: ['auth_key_value'], message: 'Auth key value is required for selected auth type' });
                }
            }
            
            // Rate limit validation
            if (data.rate_limit.burst_limit > data.rate_limit.requests_per_minute) {
                ctx.addIssue({ 
                    code: 'custom', 
                    path: ['rate_limit', 'burst_limit'], 
                    message: 'Burst limit cannot be greater than requests per minute' 
                });
            }
            
            // Headers validation
            if (data.headers) {
                const headerKeys = data.headers.map(h => h.key.toLowerCase()).filter(k => k.trim() !== '');
                const duplicateKeys = headerKeys.filter((key, index) => headerKeys.indexOf(key) !== index);
                if (duplicateKeys.length > 0) {
                    ctx.addIssue({ 
                        code: 'custom', 
                        path: ['headers'], 
                        message: `Duplicate header keys found: ${duplicateKeys.join(', ')}` 
                    });
                }
            }
            
            // Endpoints validation
            const endpointPaths = data.endpoints.map(ep => ep.endpoint_path);
            const duplicatePaths = endpointPaths.filter((path, index) => endpointPaths.indexOf(path) !== index);
            if (duplicatePaths.length > 0) {
                ctx.addIssue({ 
                    code: 'custom', 
                    path: ['endpoints'], 
                    message: `Duplicate endpoint paths found: ${duplicatePaths.join(', ')}` 
                });
            }
        }),
});

export const EditApiResourcePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { success, error, notifications, removeNotification } = useNotification();
    const { mutateAsync: updateResource, isPending: savingMeta } = useUpdateResource();

    // Test endpoint mutation
    const testEndpointMutation = useMutation({
        mutationFn: async ({ endpointIndex, endpoint, apiResource }) => {
            const fullUrl = `${apiResource.base_url}${endpoint.endpoint_path}`;
            
            // Build headers
            const headers = {};
            apiResource.headers.forEach(h => {
                if (h.key && h.key.trim()) {
                    headers[h.key] = h.value || '';
                }
            });

            // Add auth headers
            if (apiResource.auth_type !== 'NONE') {
                if (apiResource.auth_type === 'API_KEY' && apiResource.auth_location === 'HEADER') {
                    headers[apiResource.auth_key_name] = apiResource.auth_key_value;
                } else if (apiResource.auth_type === 'BEARER') {
                    headers['Authorization'] = `Bearer ${apiResource.auth_key_value}`;
                } else if (apiResource.auth_type === 'BASIC') {
                    const credentials = btoa(`${apiResource.auth_key_name}:${apiResource.auth_key_value}`);
                    headers['Authorization'] = `Basic ${credentials}`;
                }
            }

            // Build query params
            const queryParams = new URLSearchParams();
            endpoint.query_params.forEach(p => {
                if (p.key && p.key.trim()) {
                    queryParams.append(p.key, p.value || '');
                }
            });

            // Add auth to query params if needed
            if (apiResource.auth_type === 'API_KEY' && apiResource.auth_location === 'PARAM_QUERY') {
                queryParams.append(apiResource.auth_key_name, apiResource.auth_key_value);
            }

            const urlWithParams = queryParams.toString() ? `${fullUrl}?${queryParams.toString()}` : fullUrl;

            const response = await fetch(urlWithParams, {
                method: endpoint.method,
                headers,
                signal: AbortSignal.timeout(apiResource.timeout * 1000),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                status: response.status,
                statusText: response.statusText,
                data,
                headers: Object.fromEntries(response.headers.entries()),
            };
        },
        onSuccess: (data, variables) => {
            setTestResults(prev => ({
                ...prev,
                [variables.endpointIndex]: {
                    status: 'success',
                    data,
                    timestamp: new Date().toISOString(),
                }
            }));
            success(`Endpoint test successful! Status: ${data.status}`);
        },
        onError: (error, variables) => {
            setTestResults(prev => ({
                ...prev,
                [variables.endpointIndex]: {
                    status: 'error',
                    error: error.message,
                    timestamp: new Date().toISOString(),
                }
            }));
            error(`Endpoint test failed: ${error.message}`);
        },
    });

    // Collection discovery mutation
    const discoverCollectionsMutation = useMutation({
        mutationFn: async ({ endpointIndex, endpoint, apiResource }) => {
            const fullUrl = `${apiResource.base_url}${endpoint.endpoint_path}`;
            
            // Build headers
            const headers = {};
            apiResource.headers.forEach(h => {
                if (h.key && h.key.trim()) {
                    headers[h.key] = h.value || '';
                }
            });

            // Add auth headers
            if (apiResource.auth_type !== 'NONE') {
                if (apiResource.auth_type === 'API_KEY' && apiResource.auth_location === 'HEADER') {
                    headers[apiResource.auth_key_name] = apiResource.auth_key_value;
                } else if (apiResource.auth_type === 'BEARER') {
                    headers['Authorization'] = `Bearer ${apiResource.auth_key_value}`;
                } else if (apiResource.auth_type === 'BASIC') {
                    const credentials = btoa(`${apiResource.auth_key_name}:${apiResource.auth_key_value}`);
                    headers['Authorization'] = `Basic ${credentials}`;
                }
            }

            // Build query params
            const queryParams = new URLSearchParams();
            endpoint.query_params.forEach(p => {
                if (p.key && p.key.trim()) {
                    queryParams.append(p.key, p.value || '');
                }
            });

            // Add auth to query params if needed
            if (apiResource.auth_type === 'API_KEY' && apiResource.auth_location === 'PARAM_QUERY') {
                queryParams.append(apiResource.auth_key_name, apiResource.auth_key_value);
            }

            const urlWithParams = queryParams.toString() ? `${fullUrl}?${queryParams.toString()}` : fullUrl;

            const response = await fetch(urlWithParams, {
                method: endpoint.method,
                headers,
                signal: AbortSignal.timeout(apiResource.timeout * 1000),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                status: response.status,
                statusText: response.statusText,
                data,
                headers: Object.fromEntries(response.headers.entries()),
            };
        },
        onSuccess: (data, variables) => {
            // Extract possible collection names from the response
            const collections = extractCollectionsFromResponse(data.data);
            
            setCollectionDiscovery(prev => ({
                ...prev,
                [variables.endpointIndex]: {
                    status: 'success',
                    collections,
                    rawResponse: data.data,
                    timestamp: new Date().toISOString(),
                }
            }));
            
            // Show the collection selector
            setShowCollectionSelector(prev => ({
                ...prev,
                [variables.endpointIndex]: true
            }));
            
            success(`Found ${collections.length} possible collections`);
        },
        onError: (error, variables) => {
            setCollectionDiscovery(prev => ({
                ...prev,
                [variables.endpointIndex]: {
                    status: 'error',
                    error: error.message,
                    timestamp: new Date().toISOString(),
                }
            }));
            error(`Collection discovery failed: ${error.message}`);
        },
    });

    // Field discovery mutation
    const discoverFieldsMutation = useMutation({
        mutationFn: async ({ endpointIndex, fieldKey, endpoint, apiResource }) => {
            const fullUrl = `${apiResource.base_url}${endpoint.endpoint_path}`;
            
            // Build headers
            const headers = {};
            apiResource.headers.forEach(h => {
                if (h.key && h.key.trim()) {
                    headers[h.key] = h.value || '';
                }
            });

            // Add auth headers
            if (apiResource.auth_type !== 'NONE') {
                if (apiResource.auth_type === 'API_KEY' && apiResource.auth_location === 'HEADER') {
                    headers[apiResource.auth_key_name] = apiResource.auth_key_value;
                } else if (apiResource.auth_type === 'BEARER') {
                    headers['Authorization'] = `Bearer ${apiResource.auth_key_value}`;
                } else if (apiResource.auth_type === 'BASIC') {
                    const credentials = btoa(`${apiResource.auth_key_name}:${apiResource.auth_key_value}`);
                    headers['Authorization'] = `Basic ${credentials}`;
                }
            }

            // Build query params
            const queryParams = new URLSearchParams();
            endpoint.query_params.forEach(p => {
                if (p.key && p.key.trim()) {
                    queryParams.append(p.key, p.value || '');
                }
            });

            // Add auth to query params if needed
            if (apiResource.auth_type === 'API_KEY' && apiResource.auth_location === 'PARAM_QUERY') {
                queryParams.append(apiResource.auth_key_name, apiResource.auth_key_value);
            }

            const urlWithParams = queryParams.toString() ? `${fullUrl}?${queryParams.toString()}` : fullUrl;

            const response = await fetch(urlWithParams, {
                method: endpoint.method,
                headers,
                signal: AbortSignal.timeout(apiResource.timeout * 1000),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                status: response.status,
                statusText: response.statusText,
                data,
                headers: Object.fromEntries(response.headers.entries()),
            };
        },
        onSuccess: (data, variables) => {
            // Extract fields from the collection data
            const fields = extractFieldsFromCollection(data.data, variables.endpoint.collection_name, variables.fieldKey);
            
            setFieldDiscovery(prev => ({
                ...prev,
                [variables.endpointIndex]: {
                    ...prev[variables.endpointIndex],
                    [variables.fieldKey]: {
                        status: 'success',
                        fields,
                        timestamp: new Date().toISOString(),
                    }
                }
            }));
            
            // Show the field selector
            setShowFieldSelector(prev => ({
                ...prev,
                [`${variables.endpointIndex}-${variables.fieldKey}`]: true
            }));
            
            success(`Found ${fields.length} possible fields for ${variables.fieldKey}`);
        },
        onError: (error, variables) => {
            setFieldDiscovery(prev => ({
                ...prev,
                [variables.endpointIndex]: {
                    ...prev[variables.endpointIndex],
                    [variables.fieldKey]: {
                        status: 'error',
                        error: error.message,
                        timestamp: new Date().toISOString(),
                    }
                }
            }));
            error(`Field discovery failed for ${variables.fieldKey}: ${error.message}`);
        },
    });

    // Prefer navigation state; fall back to React Query cache if needed
    const resourceFromState = location.state?.resource || null;
    let resource = resourceFromState;
    let api = resource?.api_resources?.[0] || null;

    const [formErrors, setFormErrors] = useState({});
    const [testResults, setTestResults] = useState({});
    const [collectionDiscovery, setCollectionDiscovery] = useState({});
    const [showCollectionSelector, setShowCollectionSelector] = useState({});
    const [fieldDiscovery, setFieldDiscovery] = useState({});
    const [showFieldSelector, setShowFieldSelector] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ACTIVE',
        image_cover: null,
        api_resource: {
            base_url: '',
            endpoint: '', // Single endpoint path for API resource
            configuration: {}, // JSON configuration for API resource
            sync_status: 'IDLE', // Sync status
            auth_location: 'HEADER',
            auth_type: 'API_KEY',
            auth_key_name: 'X-API-Key',
            auth_key_value: '',
            timeout: 30,
            retry_attempts: 3,
            rate_limit: { requests_per_minute: 60, burst_limit: 60 },
            headers: [
                { key: 'Cache-Control', value: 'no-cache' },
                { key: 'User-Agent', value: 'ValACE-OPAC/1.0' },
                { key: 'Accept', value: '*/*' },
                { key: 'Accept-Encoding', value: 'gzip, deflate, br' },
                { key: 'Connection', value: 'keep-alive' },
                { key: '', value: '' }
            ],
            endpoints: [
                {
                    label: '',
                    endpoint_path: '',
                    method: 'GET',
                    collection_name: '',
                    query_params: [emptyKv()],
                    field_map: [
                        { key: 'title', value: '' },
                        { key: 'authors', value: '' },
                        { key: 'subject', value: '' },
                        { key: 'isbn', value: '' },
                        { key: 'issn', value: '' },
                        { key: 'thumbnail', value: '' },
                    ],
                    description: '',
                    page_configuration: {}, // Page configuration settings
                    status: 'ACTIVE', // Endpoint status
                    sync_status: 'IDLE', // Endpoint sync status
                },
            ],
        },
    });

    useEffect(() => {
        if (resource) {
            const currentApi = api || {};
            setFormData({
                name: resource.name || '',
                description: resource.description || '',
                status: resource.status || 'ACTIVE',
                image_cover: null, // Will be handled separately for existing images
                api_resource: {
                    base_url: currentApi.base_url || '',
                    endpoint: currentApi.endpoint || '',
                    configuration: currentApi.configuration || {},
                    sync_status: currentApi.sync_status || 'IDLE',
                    auth_location: currentApi.auth_type === 'NONE' ? 'NONE' : (currentApi.auth_location || 'HEADER'),
                    auth_type: currentApi.auth_type || 'NONE',
                    auth_key_name: currentApi.auth_username || currentApi.auth_key_name || 'X-API-Key',
                    auth_key_value: currentApi.auth_password || currentApi.auth_token || currentApi.auth_key_value || '',
                    timeout: currentApi.timeout ?? 30,
                    retry_attempts: currentApi.retry_attempts ?? 3,
                    rate_limit: typeof currentApi.rate_limit === 'object'
                        ? {
                            requests_per_minute: currentApi.rate_limit.requests_per_minute ?? 60,
                            burst_limit: currentApi.rate_limit.burst_limit ?? 60,
                        }
                        : { requests_per_minute: Number(currentApi.rate_limit) || 60, burst_limit: 60 },
                    headers: (currentApi.headers && Array.isArray(currentApi.headers) && currentApi.headers.length > 0)
                        ? currentApi.headers.map(h => ({ key: h.key ?? '', value: h.value ?? '' }))
                        : [
                            { key: 'Cache-Control', value: 'no-cache' },
                            { key: 'User-Agent', value: 'ValACE-OPAC/1.0' },
                            { key: 'Accept', value: '*/*' },
                            { key: 'Accept-Encoding', value: 'gzip, deflate, br' },
                            { key: 'Connection', value: 'keep-alive' },
                            { key: '', value: '' }
                        ],
                    endpoints: (Array.isArray(currentApi.endpoints) ? currentApi.endpoints : []).map(ep => ({
                        label: ep.label || '',
                        endpoint_path: ep.endpoint_path || '',
                        method: ep.method || 'GET',
                        collection_name: ep.collection_name || '',
                        query_params: normalizeKvArray(ep.query_params),
                        field_map: ep.field_map 
                            ? normalizeFieldMap(ep.field_map)
                            : [
                                { key: 'title', value: '' },
                                { key: 'authors', value: '' },
                                { key: 'subject', value: '' },
                                { key: 'isbn', value: '' },
                                { key: 'issn', value: '' },
                                { key: 'thumbnail', value: '' },
                            ],
                        description: ep.description || '',
                        page_configuration: ep.page_configuration || {},
                        status: ep.status || 'ACTIVE',
                        sync_status: ep.sync_status || 'IDLE',
                    }))
                },
            });
        }
    }, [resource]);

    const testEndpoint = (endpointIndex) => {
        const endpoint = formData.api_resource.endpoints[endpointIndex];
        const apiResource = formData.api_resource;

        // Validate required fields
        if (!apiResource.base_url.trim()) {
            error('Base URL is required to test endpoint');
            return;
        }
        if (!endpoint.endpoint_path.trim()) {
            error('Endpoint path is required to test endpoint');
            return;
        }

        testEndpointMutation.mutate({ endpointIndex, endpoint, apiResource });
    };

    // Helper function to extract collections from API response
    const extractCollectionsFromResponse = (data) => {
        const collections = [];
        
        if (!data || typeof data !== 'object') {
            return collections;
        }

        // Common patterns for collections in API responses
        const commonCollectionKeys = [
            'items', 'data', 'results', 'records', 'list', 'collection',
            'articles', 'books', 'documents', 'entries', 'objects',
            'content', 'resources', 'assets', 'entities'
        ];

        // Check for direct array properties
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                collections.push({
                    key,
                    type: 'array',
                    count: data[key].length,
                    sample: data[key].slice(0, 2), // First 2 items as sample
                    path: key
                });
            }
        });

        // Check for nested objects that might contain arrays
        Object.keys(data).forEach(key => {
            if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
                Object.keys(data[key]).forEach(nestedKey => {
                    if (Array.isArray(data[key][nestedKey])) {
                        collections.push({
                            key: `${key}.${nestedKey}`,
                            type: 'nested_array',
                            count: data[key][nestedKey].length,
                            sample: data[key][nestedKey].slice(0, 2),
                            path: `${key}.${nestedKey}`
                        });
                    }
                });
            }
        });

        // Sort by relevance (common keys first, then by count)
        return collections.sort((a, b) => {
            const aIsCommon = commonCollectionKeys.includes(a.key.split('.').pop());
            const bIsCommon = commonCollectionKeys.includes(b.key.split('.').pop());
            
            if (aIsCommon && !bIsCommon) return -1;
            if (!aIsCommon && bIsCommon) return 1;
            
            return b.count - a.count;
        });
    };

    const discoverCollections = (endpointIndex) => {
        const endpoint = formData.api_resource.endpoints[endpointIndex];
        const apiResource = formData.api_resource;

        // Validate required fields
        if (!apiResource.base_url.trim()) {
            error('Base URL is required to discover collections');
            return;
        }
        if (!endpoint.endpoint_path.trim()) {
            error('Endpoint path is required to discover collections');
            return;
        }

        // Check if we have a successful test result to use
        if (testResults[endpointIndex] && testResults[endpointIndex].status === 'success') {
            // Use existing test data instead of making a new API call
            const collections = extractCollectionsFromResponse(testResults[endpointIndex].data.data);
            
            setCollectionDiscovery(prev => ({
                ...prev,
                [endpointIndex]: {
                    status: 'success',
                    collections,
                    rawResponse: testResults[endpointIndex].data.data,
                    timestamp: new Date().toISOString(),
                }
            }));
            
            // Show the collection selector
            setShowCollectionSelector(prev => ({
                ...prev,
                [endpointIndex]: true
            }));
            
            success(`Found ${collections.length} possible collections from test data`);
        } else {
            // Fallback to making a new API call if no test data available
            discoverCollectionsMutation.mutate({ endpointIndex, endpoint, apiResource });
        }
    };

    const selectCollection = (endpointIndex, collectionPath) => {
        setFormData(prev => {
            const endpoints = [...prev.api_resource.endpoints];
            endpoints[endpointIndex] = { ...endpoints[endpointIndex], collection_name: collectionPath };
            return { ...prev, api_resource: { ...prev.api_resource, endpoints } };
        });
        
        setShowCollectionSelector(prev => ({
            ...prev,
            [endpointIndex]: false
        }));
        
        success(`Collection name set to: ${collectionPath}`);
    };

    // Helper function to extract fields from collection data
    const extractFieldsFromCollection = (data, collectionPath, targetField) => {
        const fields = [];
        
        if (!data || typeof data !== 'object') {
            return fields;
        }

        // Navigate to the collection using dot notation
        const collectionData = getNestedValue(data, collectionPath);
        
        if (!Array.isArray(collectionData) || collectionData.length === 0) {
            return fields;
        }

        // Get the first item to analyze structure
        const sampleItem = collectionData[0];
        
        if (!sampleItem || typeof sampleItem !== 'object') {
            return fields;
        }

        // Extract all possible field paths
        const extractFieldPaths = (obj, prefix = '') => {
            const paths = [];
            
            Object.keys(obj).forEach(key => {
                const currentPath = prefix ? `${prefix}.${key}` : key;
                const value = obj[key];
                
                // Check if this field might be relevant for the target field
                if (isRelevantField(key, targetField, value)) {
                    // Determine field type and sample data
                    let fieldType = typeof value;
                    let sampleData = value;
                    
                    if (Array.isArray(value)) {
                        fieldType = 'array';
                        sampleData = value.slice(0, 3); // Show up to 3 items
                    } else if (value && typeof value === 'object') {
                        fieldType = 'object';
                        sampleData = Object.keys(value).slice(0, 5); // Show first 5 keys
                    } else if (typeof value === 'string' && value.length > 100) {
                        sampleData = value.substring(0, 100) + '...'; // Truncate long strings
                    }
                    
                    paths.push({
                        key,
                        path: currentPath,
                        type: fieldType,
                        sample: sampleData,
                        hasValue: value !== null && value !== undefined && value !== '',
                    });
                }
                
                // Recursively check nested objects (but not arrays to avoid too much nesting)
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    paths.push(...extractFieldPaths(value, currentPath));
                }
            });
            
            return paths;
        };

        const allFields = extractFieldPaths(sampleItem);
        
        // Sort by relevance
        return allFields.sort((a, b) => {
            const aRelevance = getFieldRelevance(a.key, targetField);
            const bRelevance = getFieldRelevance(b.key, targetField);
            return bRelevance - aRelevance;
        });
    };

    // Helper function to check if a field is relevant for the target field
    const isRelevantField = (key, targetField, value) => {
        // Show all fields, not just relevant ones
        return true;
    };

    // Helper function to get field relevance score
    const getFieldRelevance = (key, targetField) => {
        const keyLower = key.toLowerCase();
        const targetLower = targetField.toLowerCase();
        
        // Direct match gets highest priority
        if (keyLower === targetLower) return 100;
        if (keyLower.includes(targetLower)) return 90;
        if (targetLower.includes(keyLower)) return 80;
        
        // Pattern matching for common field types
        const patterns = {
            title: ['title', 'name', 'headline', 'subject', 'label'],
            authors: ['author', 'authors', 'writer', 'writers', 'creator', 'creators', 'contributor'],
            subject: ['subject', 'category', 'genre', 'topic', 'tags', 'classification'],
            isbn: ['isbn', 'identifier', 'book_id', 'id'],
            issn: ['issn', 'serial_id', 'serial'],
            thumbnail: ['thumbnail', 'image', 'cover', 'photo', 'picture', 'url', 'link', 'src']
        };
        
        const targetPatterns = patterns[targetField] || [];
        const matchCount = targetPatterns.filter(pattern => keyLower.includes(pattern)).length;
        
        if (matchCount > 0) return 70 + (matchCount * 5);
        
        // All other fields get a base score
        return 50;
    };

    // Helper function to get nested value using dot notation
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    };

    const discoverFields = (endpointIndex, fieldKey) => {
        const endpoint = formData.api_resource.endpoints[endpointIndex];
        const apiResource = formData.api_resource;

        // Validate required fields
        if (!apiResource.base_url.trim()) {
            error('Base URL is required to discover fields');
            return;
        }
        if (!endpoint.endpoint_path.trim()) {
            error('Endpoint path is required to discover fields');
            return;
        }
        if (!endpoint.collection_name.trim()) {
            error('Collection name is required to discover fields');
            return;
        }

        discoverFieldsMutation.mutate({ endpointIndex, fieldKey, endpoint, apiResource });
    };

    const selectField = (endpointIndex, fieldKey, fieldPath) => {
        setFormData(prev => {
            const endpoints = [...prev.api_resource.endpoints];
            const fieldMap = [...endpoints[endpointIndex].field_map];
            
            // Find existing mapping or create new one
            const existingIndex = fieldMap.findIndex(fm => fm.key === fieldKey);
            if (existingIndex >= 0) {
                fieldMap[existingIndex] = { ...fieldMap[existingIndex], value: fieldPath };
            } else {
                fieldMap.push({ key: fieldKey, value: fieldPath });
            }
            
            endpoints[endpointIndex] = { ...endpoints[endpointIndex], field_map: fieldMap };
            return { ...prev, api_resource: { ...prev.api_resource, endpoints } };
        });
        
        setShowFieldSelector(prev => ({
            ...prev,
            [`${endpointIndex}-${fieldKey}`]: false
        }));
        
        success(`Field mapping set: ${fieldKey} -> ${fieldPath}`);
    };

    const handleTopLevelChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            error('Please select an image file');
            return;
        }
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            error('Image file size must be less than 5MB');
            return;
        }
        setFormData((prev) => ({ ...prev, image_cover: file }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            validateAndSetFile(file);
        }
    };

    const handleApiConfigChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, api_resource: { ...prev.api_resource, [name]: value } }));
    };

    const handleRateLimitChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            api_resource: { ...prev.api_resource, rate_limit: { ...prev.api_resource.rate_limit, [name]: value } },
        }));
    };

    const handleHeadersChange = (idx, field, value) => {
        setFormData((prev) => {
            const updated = [...prev.api_resource.headers];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, api_resource: { ...prev.api_resource, headers: updated } };
        });
    };

    const addHeaderRow = () => {
        setFormData((prev) => ({ ...prev, api_resource: { ...prev.api_resource, headers: [...prev.api_resource.headers, emptyKv()] } }));
    };

    const removeHeaderRow = (idx) => {
        setFormData((prev) => {
            const updated = prev.api_resource.headers.filter((_, i) => i !== idx);
            return { ...prev, api_resource: { ...prev.api_resource, headers: updated.length ? updated : [emptyKv()] } };
        });
    };

    const handleEndpointField = (idx, field, value) => {
        setFormData((prev) => {
            const updated = [...prev.api_resource.endpoints];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, api_resource: { ...prev.api_resource, endpoints: updated } };
        });
    };

    const handleEndpointKvChange = (idx, kvName, kvIdx, field, value) => {
        setFormData((prev) => {
            const endpoints = [...prev.api_resource.endpoints];
            const kvList = [...endpoints[idx][kvName]];
            kvList[kvIdx] = { ...kvList[kvIdx], [field]: value };
            endpoints[idx] = { ...endpoints[idx], [kvName]: kvList };
            return { ...prev, api_resource: { ...prev.api_resource, endpoints } };
        });
    };

    const addEndpointKv = (idx, kvName) => {
        setFormData((prev) => {
            const endpoints = [...prev.api_resource.endpoints];
            endpoints[idx] = { ...endpoints[idx], [kvName]: [...endpoints[idx][kvName], emptyKv()] };
            return { ...prev, api_resource: { ...prev.api_resource, endpoints } };
        });
    };

    const removeEndpointKv = (idx, kvName, kvIdx) => {
        setFormData((prev) => {
            const endpoints = [...prev.api_resource.endpoints];
            const filtered = endpoints[idx][kvName].filter((_, i) => i !== kvIdx);
            endpoints[idx] = { ...endpoints[idx], [kvName]: filtered.length ? filtered : [emptyKv()] };
            return { ...prev, api_resource: { ...prev.api_resource, endpoints } };
        });
    };

    const addEndpoint = () => {
        setFormData((prev) => ({
            ...prev,
            api_resource: {
                ...prev.api_resource,
                endpoints: [
                    ...prev.api_resource.endpoints,
                    { 
                        label: '', 
                        endpoint_path: '', 
                        method: 'GET', 
                        collection_name: '', 
                        query_params: [emptyKv()], 
                        field_map: [
                            { key: 'title', value: '' },
                            { key: 'authors', value: '' },
                            { key: 'subject', value: '' },
                            { key: 'isbn', value: '' },
                            { key: 'issn', value: '' },
                            { key: 'thumbnail', value: '' },
                        ], 
                        description: '',
                        page_configuration: {},
                        status: 'ACTIVE',
                        sync_status: 'IDLE',
                    },
                ],
            },
        }));
    };

    const removeEndpoint = (idx) => {
        setFormData((prev) => {
            const updated = prev.api_resource.endpoints.filter((_, i) => i !== idx);
            return { ...prev, api_resource: { ...prev.api_resource, endpoints: updated.length ? updated : prev.api_resource.endpoints } };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        try {
            console.log('Form data before validation:', formData);
            
            // Skip Zod validation for now and do basic validation
            const validatedFormData = formData;
            
            // Basic validation
            if (!formData.name || formData.name.trim().length < 2) {
                setFormErrors({ name: 'Name must be at least 2 characters' });
                error('Please correct the highlighted fields');
                return;
            }
            
            if (!formData.description || formData.description.trim().length < 10 || formData.description.length === 0) {
                setFormErrors({ description: 'Description must be at least 10 characters' });
                error('Please correct the highlighted fields');
                return;
            }
            
            if (!formData.api_resource.base_url || !formData.api_resource.base_url.trim()) {
                setFormErrors({ 'api_resource.base_url': 'Base URL is required' });
                error('Please correct the highlighted fields');
                return;
            }
            
            // Transform headers - keep all headers including empty ones for backend processing
            const processedHeaders = formData.api_resource.headers.filter(h => h.key.trim() !== '' || h.value.trim() !== '');
            
            // Transform endpoints - keep query_params as array format for backend
            const transformedEndpoints = formData.api_resource.endpoints.map((ep) => ({
                ...ep,
                query_params: ep.query_params.filter(p => p.key.trim() !== '' || p.value.trim() !== ''),
                field_map: ep.field_map.filter(p => p.key.trim() !== '' || p.value.trim() !== ''),
            }));

            // Create FormData for submission (like CreateApiResourcePage)
            const formDataToSend = new FormData();
            formDataToSend.append('_method', 'PUT'); // Laravel method spoofing for FormData
            formDataToSend.append('name', validatedFormData.name);
            formDataToSend.append('description', validatedFormData.description);
            formDataToSend.append('type', 'API'); // Required for backend to process API resource
            formDataToSend.append('status', validatedFormData.status);
            
            if (validatedFormData.image_cover) {
                formDataToSend.append('image_cover', validatedFormData.image_cover);
            }

            // Append API resource configuration using bracket notation (like CreateApiResourcePage)
            formDataToSend.append('api_resource[base_url]', formData.api_resource.base_url);
            formDataToSend.append('api_resource[endpoint]', formData.api_resource.endpoint || '');
            formDataToSend.append('api_resource[configuration]', JSON.stringify(formData.api_resource.configuration || {}));
            formDataToSend.append('api_resource[sync_status]', formData.api_resource.sync_status || 'IDLE');
            formDataToSend.append('api_resource[auth_location]', formData.api_resource.auth_location || 'HEADER');
            formDataToSend.append('api_resource[auth_type]', formData.api_resource.auth_type || 'NONE');
            formDataToSend.append('api_resource[timeout]', String(formData.api_resource.timeout || 30));
            formDataToSend.append('api_resource[retry_attempts]', String(formData.api_resource.retry_attempts || 3));
            formDataToSend.append('api_resource[status]', 'ACTIVE'); // API resource status

            // Rate limit nested fields
            formDataToSend.append('api_resource[rate_limit][requests_per_minute]', String(formData.api_resource.rate_limit.requests_per_minute));
            formDataToSend.append('api_resource[rate_limit][burst_limit]', String(formData.api_resource.rate_limit.burst_limit));

            // Map auth fields based on auth type
            if (formData.api_resource.auth_type === 'BASIC') {
                formDataToSend.append('api_resource[auth_username]', formData.api_resource.auth_key_name || '');
                formDataToSend.append('api_resource[auth_password]', formData.api_resource.auth_key_value || '');
            } else if (formData.api_resource.auth_type === 'API_KEY') {
                formDataToSend.append('api_resource[auth_key_name]', formData.api_resource.auth_key_name || '');
                formDataToSend.append('api_resource[auth_key_value]', formData.api_resource.auth_key_value || '');
            } else if (formData.api_resource.auth_type === 'BEARER') {
                formDataToSend.append('api_resource[auth_token]', formData.api_resource.auth_key_value || '');
            }

            // Headers array
            processedHeaders.forEach((h, i) => {
                formDataToSend.append(`api_resource[headers][${i}][key]`, h.key);
                formDataToSend.append(`api_resource[headers][${i}][value]`, h.value ?? '');
            });

            // Endpoints array with nested arrays
            transformedEndpoints.forEach((ep, i) => {
                formDataToSend.append(`api_resource[endpoints][${i}][label]`, ep.label || '');
                formDataToSend.append(`api_resource[endpoints][${i}][endpoint_path]`, ep.endpoint_path || '');
                formDataToSend.append(`api_resource[endpoints][${i}][method]`, ep.method || 'GET');
                formDataToSend.append(`api_resource[endpoints][${i}][collection_name]`, ep.collection_name || '');
                formDataToSend.append(`api_resource[endpoints][${i}][description]`, ep.description || '');
                formDataToSend.append(`api_resource[endpoints][${i}][page_configuration]`, JSON.stringify(ep.page_configuration || {}));
                formDataToSend.append(`api_resource[endpoints][${i}][status]`, ep.status || 'ACTIVE');
                formDataToSend.append(`api_resource[endpoints][${i}][sync_status]`, ep.sync_status || 'IDLE');

                // query_params
                ep.query_params.forEach((p, j) => {
                    formDataToSend.append(`api_resource[endpoints][${i}][query_params][${j}][key]`, p.key);
                    formDataToSend.append(`api_resource[endpoints][${i}][query_params][${j}][value]`, p.value ?? '');
                });

                // field_map
                ep.field_map.forEach((p, j) => {
                    formDataToSend.append(`api_resource[endpoints][${i}][field_map][${j}][key]`, p.key);
                    formDataToSend.append(`api_resource[endpoints][${i}][field_map][${j}][value]`, p.value ?? '');
                });
            });

            console.log("Submitting FormData with bracket notation for update");
            
            // Debug: Log FormData contents
            console.log('FormData contents:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }
            
            // Use single updateResource call with FormData
            const result = await updateResource({ id, payload: formDataToSend });
            console.log('Update result:', result);

            success('Resource updated successfully');
            setTimeout(() => navigate('/admin/resources'), 700);
        } catch (err) {
            console.error('Submit error:', err);
            console.error('Error stack:', err.stack);
                error(err?.message || 'Failed to update resource');
        }
    };

    const breadcrumbs = useMemo(() => ([
        { label: 'Resource', onClick: () => navigate('/admin/resources') },
        { label: 'Edit API Resource' }
    ]), [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
            <div className="w-full">
                <Breadcrumb items={breadcrumbs} />

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="bg-[#00104A] px-6 py-4 rounded-t-lg">
                        <div className="flex flex-col">
                            <div className="mb-5">
                                <button
                                    onClick={() => navigate('/admin/resources')}
                                    className="text-white rounded-md font-medium hover:text-white/80 transition-colors flex items-center gap-1 w-fit"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>Back to Resources</span>
                                </button>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    Edit API Resource
                                    <Database className="w-8 h-8 text-white" />
                                </h1>
                                <p className="text-blue-100 mt-1">
                                    Update API details, configuration and endpoints
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {!resource ? (
                        <div className="p-6 text-sm text-gray-600">
                            Resource data not found. Please return to Resources and open edit from there.
                            <div className="mt-3">
                                <button onClick={() => navigate('/admin/resources')} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Back to Resources</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            <BasicInformationSection 
                                formData={formData}
                                formErrors={formErrors}
                                handleTopLevelChange={handleTopLevelChange}
                                handleFileChange={handleFileChange}
                                handleDragOver={handleDragOver}
                                handleDrop={handleDrop}
                            />

                            <MediaSection 
                                formData={formData}
                                formErrors={formErrors}
                                handleFileChange={handleFileChange}
                                handleDragOver={handleDragOver}
                                handleDrop={handleDrop}
                                setFormData={setFormData}
                            />

                            <ApiConfigurationSection 
                                formData={formData}
                                formErrors={formErrors}
                                handleApiConfigChange={handleApiConfigChange}
                                handleRateLimitChange={handleRateLimitChange}
                                handleHeadersChange={handleHeadersChange}
                                addHeaderRow={addHeaderRow}
                                removeHeaderRow={removeHeaderRow}
                            />

                            <EndpointsSection 
                                formData={formData}
                                formErrors={formErrors}
                                testResults={testResults}
                                collectionDiscovery={collectionDiscovery}
                                showCollectionSelector={showCollectionSelector}
                                fieldDiscovery={fieldDiscovery}
                                showFieldSelector={showFieldSelector}
                                handleEndpointField={handleEndpointField}
                                handleEndpointKvChange={handleEndpointKvChange}
                                addEndpointKv={addEndpointKv}
                                removeEndpointKv={removeEndpointKv}
                                addEndpoint={addEndpoint}
                                removeEndpoint={removeEndpoint}
                                testEndpoint={testEndpoint}
                                discoverCollections={discoverCollections}
                                testEndpointMutation={testEndpointMutation}
                                discoverCollectionsMutation={discoverCollectionsMutation}
                                setShowCollectionSelector={setShowCollectionSelector}
                                selectCollection={selectCollection}
                                discoverFields={discoverFields}
                                discoverFieldsMutation={discoverFieldsMutation}
                                setShowFieldSelector={setShowFieldSelector}
                                selectField={selectField}
                            />

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button type="button" onClick={() => navigate('/admin/resources')} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50" disabled={savingMeta}>Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded-md bg-[#00104A] text-white hover:opacity-90 disabled:opacity-60" disabled={savingMeta}>
                                    {savingMeta ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


