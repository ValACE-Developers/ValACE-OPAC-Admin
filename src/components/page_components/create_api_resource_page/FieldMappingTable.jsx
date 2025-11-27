import { Search, Loader2, CheckCircle, XCircle, ChevronDown, List, Info } from 'lucide-react';

const FieldMappingTable = ({ 
    endpoint, 
    endpointIndex, 
    formData,
    formErrors, 
    testResults,
    fieldDiscovery,
    showFieldSelector,
    handleEndpointKvChange, 
    discoverFields,
    discoverFieldsMutation,
    setShowFieldSelector,
    selectField
}) => {
    const staticFields = [
        { key: 'title', label: 'Book title', required: true },
        { key: 'authors', label: 'Authors', required: false },
        { key: 'subject', label: 'Subject', required: false },
        { key: 'isbn', label: 'ISBN', required: false },
        { key: 'issn', label: 'ISSN', required: false },
        { key: 'thumbnail', label: 'Thumbnail URL', required: false },
    ];

    return (
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
                Field Mapping <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">Map API response fields to your data structure</span>
            </label>
            <div className="mt-2 space-y-4">
                {staticFields.map((field, fieldIdx) => {
                    const currentMapping = endpoint.field_map.find(fm => fm.key === field.key) || { key: field.key, value: '' };
                    const fieldIndex = endpoint.field_map.findIndex(fm => fm.key === field.key);
                    
                    return (
                        <div key={`fm-${endpointIndex}-${field.key}`} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <div className="sm:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                                    {field.key}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Source Field
                                </label>
                                <div className="mt-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={currentMapping.value}
                                        onChange={(e) => {
                                            if (fieldIndex >= 0) {
                                                handleEndpointKvChange(endpointIndex, 'field_map', fieldIndex, 'value', e.target.value);
                                            } else {
                                                // This shouldn't happen since we ensure all required fields exist
                                                console.warn(`Field ${field.key} not found in field_map, this should not happen`);
                                            }
                                        }}
                                        placeholder="e.g., title or volumeInfo.title"
                                        className="flex-1 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => discoverFields(endpointIndex, field.key)}
                                        disabled={
                                            discoverFieldsMutation.isPending || 
                                            !formData.api_resource.base_url.trim() || 
                                            !endpoint.endpoint_path.trim() ||
                                            !testResults[endpointIndex] ||
                                            testResults[endpointIndex].status !== 'success' ||
                                            !endpoint.collection_name.trim()
                                        }
                                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                        title={
                                            !testResults[endpointIndex] || testResults[endpointIndex].status !== 'success' 
                                                ? "Please test the endpoint first" 
                                                : !endpoint.collection_name.trim()
                                                ? "Please set collection name first"
                                                : "Discover fields from API response"
                                        }
                                    >
                                        {discoverFieldsMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Search className="w-4 h-4" />
                                        )}
                                        Discover
                                    </button>
                                </div>
                                
                                {/* Help text for discover button */}
                                {(!testResults[endpointIndex] || testResults[endpointIndex].status !== 'success' || !endpoint.collection_name.trim()) && (
                                    <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        {!endpoint.collection_name.trim() 
                                            ? "Set collection name first to enable field discovery"
                                            : "Test the endpoint first to enable field discovery"
                                        }
                                    </p>
                                )}
                                
                                {/* Field Discovery Results */}
                                {fieldDiscovery[endpointIndex] && fieldDiscovery[endpointIndex][field.key] && (
                                    <div className="mt-2">
                                        {fieldDiscovery[endpointIndex][field.key].status === 'success' ? (
                                            <div className="border rounded-md bg-green-50 border-green-200">
                                                <div className="p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                            <span className="text-sm font-medium text-green-800">
                                                                Found {fieldDiscovery[endpointIndex][field.key].fields.length} possible fields
                                                            </span>
                                                            <span className="text-xs text-green-600">
                                                                ({fieldDiscovery[endpointIndex][field.key].fields.filter(f => f.hasValue).length} with values)
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowFieldSelector(prev => ({ 
                                                                ...prev, 
                                                                [`${endpointIndex}-${field.key}`]: !prev[`${endpointIndex}-${field.key}`] 
                                                            }))}
                                                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                                                        >
                                                            <ChevronDown className={`w-4 h-4 transition-transform ${showFieldSelector[`${endpointIndex}-${field.key}`] ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>
                                                    
                                                    {showFieldSelector[`${endpointIndex}-${field.key}`] && (
                                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                                            {fieldDiscovery[endpointIndex][field.key].fields.map((fieldOption, optIdx) => (
                                                                <div
                                                                    key={optIdx}
                                                                    className={`p-3 bg-white rounded border hover:border-green-300 cursor-pointer transition-colors ${
                                                                        fieldOption.hasValue 
                                                                            ? 'border-green-200' 
                                                                            : 'border-gray-200 opacity-60'
                                                                    }`}
                                                                    onClick={() => selectField(endpointIndex, field.key, fieldOption.path)}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <List className="w-3 h-3 text-green-600" />
                                                                                <span className="font-medium text-gray-900 text-sm">{fieldOption.key}</span>
                                                                                <span className={`text-xs px-2 py-1 rounded ${
                                                                                    fieldOption.type === 'string' ? 'bg-blue-100 text-blue-700' :
                                                                                    fieldOption.type === 'number' ? 'bg-purple-100 text-purple-700' :
                                                                                    fieldOption.type === 'boolean' ? 'bg-yellow-100 text-yellow-700' :
                                                                                    fieldOption.type === 'array' ? 'bg-orange-100 text-orange-700' :
                                                                                    fieldOption.type === 'object' ? 'bg-gray-100 text-gray-700' :
                                                                                    'bg-gray-100 text-gray-700'
                                                                                }`}>
                                                                                    {fieldOption.type}
                                                                                </span>
                                                                                {!fieldOption.hasValue && (
                                                                                    <span className="text-xs text-gray-400 italic">(empty)</span>
                                                                                )}
                                                                            </div>
                                                                            <div className="text-xs text-gray-600 mt-1">
                                                                                Path: <code className="bg-gray-100 px-1 rounded">{fieldOption.path}</code>
                                                                            </div>
                                                                            {fieldOption.sample && fieldOption.hasValue && (
                                                                                <div className="text-xs text-gray-500 mt-1">
                                                                                    <span className="font-medium">Sample:</span>
                                                                                    <div className="mt-1">
                                                                                        <code className="bg-gray-50 px-2 py-1 rounded text-xs block max-w-full overflow-hidden">
                                                                                            {fieldOption.type === 'array' 
                                                                                                ? `[${fieldOption.sample.length} items] ${JSON.stringify(fieldOption.sample).substring(0, 80)}...`
                                                                                                : fieldOption.type === 'object'
                                                                                                ? `{${fieldOption.sample.join(', ')}}`
                                                                                                : JSON.stringify(fieldOption.sample).substring(0, 80) + (JSON.stringify(fieldOption.sample).length > 80 ? '...' : '')
                                                                                            }
                                                                                        </code>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                selectField(endpointIndex, field.key, fieldOption.path);
                                                                            }}
                                                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex-shrink-0"
                                                                        >
                                                                            Select
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border rounded-md bg-red-50 border-red-200 p-3">
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                    <span className="text-sm font-medium text-red-800">Discovery Failed</span>
                                                </div>
                                                <p className="text-xs text-red-600 mt-1">{fieldDiscovery[endpointIndex][field.key].error}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <div className="text-xs text-gray-500 mt-6">
                                    {field.required ? 'Required' : 'Optional'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {formErrors[`api_resource.endpoints.${endpointIndex}.field_map`] && (
                <p className="mt-1 text-sm text-red-600">{formErrors[`api_resource.endpoints.${endpointIndex}.field_map`]}</p>
            )}
        </div>
    );
};

export default FieldMappingTable;
