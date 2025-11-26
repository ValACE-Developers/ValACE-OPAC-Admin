import { 
    Database, 
    Minus, 
    Plus, 
    Play, 
    Loader2, 
    CheckCircle, 
    XCircle, 
    Search, 
    ChevronDown, 
    List, 
    Info 
} from 'lucide-react';
import FieldMappingTable from './FieldMappingTable';
import PageConfiguration from './PageConfiguration';

const EndpointCard = ({ 
    endpoint, 
    endpointIndex, 
    formData, 
    formErrors, 
    testResults, 
    collectionDiscovery, 
    showCollectionSelector,
    fieldDiscovery,
    showFieldSelector,
    handleEndpointField, 
    handleEndpointKvChange, 
    addEndpointKv, 
    removeEndpointKv, 
    testEndpoint, 
    discoverCollections, 
    testEndpointMutation, 
    discoverCollectionsMutation, 
    setShowCollectionSelector, 
    selectCollection,
    discoverFields,
    discoverFieldsMutation,
    setShowFieldSelector,
    selectField
}) => {
    return (
        <div className="rounded-lg border border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Database className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Endpoint {endpointIndex + 1}</h4>
                </div>
                {formData.api_resource.endpoints.length > 1 && (
                    <button 
                        type="button" 
                        onClick={() => removeEndpoint(endpointIndex)} 
                        className="px-3 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-2"
                    >
                        <Minus className="w-4 h-4" />
                        Remove
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Label <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={endpoint.label}
                        onChange={(e) => handleEndpointField(endpointIndex, 'label', e.target.value)}
                        placeholder="e.g., Search Articles"
                        className={`mt-1 block w-full rounded-md border ${formErrors[`api_resource.endpoints.${endpointIndex}.label`] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                    />
                    {formErrors[`api_resource.endpoints.${endpointIndex}.label`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`api_resource.endpoints.${endpointIndex}.label`]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Collection Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            type="text"
                            value={endpoint.collection_name}
                            onChange={(e) => handleEndpointField(endpointIndex, 'collection_name', e.target.value)}
                            placeholder="e.g., articles"
                            className={`flex-1 rounded-md border ${formErrors[`api_resource.endpoints.${endpointIndex}.collection_name`] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                        />
                        <button
                            type="button"
                            onClick={() => discoverCollections(endpointIndex)}
                            disabled={
                                discoverCollectionsMutation.isPending || 
                                !formData.api_resource.base_url.trim() || 
                                !endpoint.endpoint_path.trim() ||
                                !testResults[endpointIndex] ||
                                testResults[endpointIndex].status !== 'success'
                            }
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                            title={
                                !testResults[endpointIndex] || testResults[endpointIndex].status !== 'success' 
                                    ? "Please test the endpoint first" 
                                    : "Discover collections from API response"
                            }
                        >
                            {discoverCollectionsMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            Discover
                        </button>
                    </div>
                    {formErrors[`api_resource.endpoints.${endpointIndex}.collection_name`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`api_resource.endpoints.${endpointIndex}.collection_name`]}</p>
                    )}
                    
                    {/* Help text for discover button */}
                    {(!testResults[endpointIndex] || testResults[endpointIndex].status !== 'success') && (
                        <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Test the endpoint first to enable collection discovery
                        </p>
                    )}
                    
                    {/* Collection Discovery Results */}
                    {collectionDiscovery[endpointIndex] && (
                        <div className="mt-2">
                            {collectionDiscovery[endpointIndex].status === 'success' ? (
                                <div className="border rounded-md bg-green-50 border-green-200">
                                    <div className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm font-medium text-green-800">
                                                    Found {collectionDiscovery[endpointIndex].collections.length} collections
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowCollectionSelector(prev => ({ ...prev, [endpointIndex]: !prev[endpointIndex] }))}
                                                className="text-green-600 hover:text-green-800 flex items-center gap-1"
                                            >
                                                <ChevronDown className={`w-4 h-4 transition-transform ${showCollectionSelector[endpointIndex] ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                        
                                        {showCollectionSelector[endpointIndex] && (
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {collectionDiscovery[endpointIndex].collections.map((collection, colIdx) => (
                                                    <div
                                                        key={colIdx}
                                                        className="p-3 bg-white rounded border border-green-200 hover:border-green-300 cursor-pointer transition-colors"
                                                        onClick={() => selectCollection(endpointIndex, collection.path)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <List className="w-4 h-4 text-green-600" />
                                                                    <span className="font-medium text-gray-900">{collection.key}</span>
                                                                    <span className="text-xs text-gray-500">({collection.count} items)</span>
                                                                </div>
                                                                <div className="text-xs text-gray-600 mt-1">
                                                                    Path: <code className="bg-gray-100 px-1 rounded">{collection.path}</code>
                                                                </div>
                                                                {collection.sample && collection.sample.length > 0 && (
                                                                    <details className="mt-2">
                                                                        <summary className="text-xs text-green-600 cursor-pointer hover:text-green-800">
                                                                            Preview sample data
                                                                        </summary>
                                                                        <pre className="mt-1 text-xs bg-gray-50 p-2 rounded border overflow-auto max-h-20">
                                                                            {JSON.stringify(collection.sample, null, 2)}
                                                                        </pre>
                                                                    </details>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    selectCollection(endpointIndex, collection.path);
                                                                }}
                                                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
                                    <p className="text-xs text-red-600 mt-1">{collectionDiscovery[endpointIndex].error}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Endpoint Path <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            type="text"
                            value={endpoint.endpoint_path}
                            onChange={(e) => handleEndpointField(endpointIndex, 'endpoint_path', e.target.value)}
                            placeholder="/v1/search or /v1/articles/{id}"
                            className={`flex-1 rounded-md border ${formErrors[`api_resource.endpoints.${endpointIndex}.endpoint_path`] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                        />
                        <button
                            type="button"
                            onClick={() => testEndpoint(endpointIndex)}
                            disabled={testEndpointMutation.isPending || !formData.api_resource.base_url.trim() || !endpoint.endpoint_path.trim()}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                            {testEndpointMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            Test
                        </button>
                    </div>
                    {formErrors[`api_resource.endpoints.${endpointIndex}.endpoint_path`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`api_resource.endpoints.${endpointIndex}.endpoint_path`]}</p>
                    )}
                    
                    {/* Test Result Display */}
                    {testResults[endpointIndex] && (
                        <div className="mt-2 p-3 rounded-md border">
                            {testResults[endpointIndex].status === 'success' ? (
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-green-800">Test Successful</p>
                                        <p className="text-xs text-green-600">
                                            Status: {testResults[endpointIndex].data.status} {testResults[endpointIndex].data.statusText}
                                        </p>
                                        <details className="mt-1">
                                            <summary className="text-xs text-green-600 cursor-pointer hover:text-green-800">
                                                View Response Data
                                            </summary>
                                            <pre className="mt-2 text-xs bg-green-50 p-2 rounded border overflow-auto max-h-32">
                                                {JSON.stringify(testResults[endpointIndex].data.data, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2">
                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800">Test Failed</p>
                                        <p className="text-xs text-red-600">{testResults[endpointIndex].error}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Method
                    </label>
                    <div className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus-within:outline-2 focus-within:outline-[var(--main-color)]">
                        <select value={endpoint.method} onChange={(e) => handleEndpointField(endpointIndex, 'method', e.target.value)} className="w-full bg-transparent focus:outline-none">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={2}
                    value={endpoint.description}
                    onChange={(e) => handleEndpointField(endpointIndex, 'description', e.target.value)}
                    placeholder="Describe what this endpoint does..."
                    className={`mt-1 block w-full rounded-md border ${formErrors[`api_resource.endpoints.${endpointIndex}.description`] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                />
                {formErrors[`api_resource.endpoints.${endpointIndex}.description`] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors[`api_resource.endpoints.${endpointIndex}.description`]}</p>
                )}
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    Endpoint Configuration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            value={endpoint.status}
                            onChange={(e) => handleEndpointField(endpointIndex, 'status', e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sync Status
                        </label>
                        <select
                            value={endpoint.sync_status}
                            onChange={(e) => handleEndpointField(endpointIndex, 'sync_status', e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                        >
                            <option value="IDLE">IDLE</option>
                            <option value="FAILED">FAILED</option>
                            <option value="COMPLETED">COMPLETED</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    Query Parameters
                    <span className="text-gray-500 text-xs ml-2">(Optional)</span>
                </label>
                <div className="mt-2 space-y-2">
                    {endpoint.query_params.map((p, kvIdx) => (
                        <div key={`qp-${endpointIndex}-${kvIdx}`} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <input
                                type="text"
                                value={p.key}
                                onChange={(e) => handleEndpointKvChange(endpointIndex, 'query_params', kvIdx, 'key', e.target.value)}
                                placeholder="Param Name (e.g., q)"
                                className="sm:col-span-5 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                            />
                            <input
                                type="text"
                                value={p.value}
                                onChange={(e) => handleEndpointKvChange(endpointIndex, 'query_params', kvIdx, 'value', e.target.value)}
                                placeholder="Value/Placeholder (e.g., search_term)"
                                className="sm:col-span-5 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                            />
                            <div className="sm:col-span-2 flex gap-2">
                                <button type="button" onClick={() => addEndpointKv(endpointIndex, 'query_params')} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                                <button type="button" onClick={() => removeEndpointKv(endpointIndex, 'query_params', kvIdx)} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                                    <Minus className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <PageConfiguration 
                endpoint={endpoint}
                endpointIndex={endpointIndex}
                formErrors={formErrors}
                handleEndpointField={handleEndpointField}
            />

            <FieldMappingTable 
                endpoint={endpoint}
                endpointIndex={endpointIndex}
                formData={formData}
                formErrors={formErrors}
                testResults={testResults}
                fieldDiscovery={fieldDiscovery}
                showFieldSelector={showFieldSelector}
                handleEndpointKvChange={handleEndpointKvChange}
                discoverFields={discoverFields}
                discoverFieldsMutation={discoverFieldsMutation}
                setShowFieldSelector={setShowFieldSelector}
                selectField={selectField}
            />
        </div>
    );
};

export default EndpointCard;
