import { Database, Plus } from 'lucide-react';
import EndpointCard from './EndpointCard';

const EndpointsSection = ({ 
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
    addEndpoint, 
    removeEndpoint,
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
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        API Endpoints
                        <Database className="w-5 h-5 text-orange-600" />
                    </h3>
                    <p className="text-sm text-gray-500">Configure the API endpoints and data mapping</p>
                </div>
                <button 
                    type="button" 
                    onClick={addEndpoint} 
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Endpoint
                </button>
            </div>

            <div className="space-y-8">
                {formData.api_resource.endpoints.map((ep, idx) => (
                    <EndpointCard
                        key={`ep-${idx}`}
                        endpoint={ep}
                        endpointIndex={idx}
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
                ))}
            </div>
        </div>
    );
};

export default EndpointsSection;
