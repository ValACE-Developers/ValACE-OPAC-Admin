import { Settings, Info } from 'lucide-react';

const PageConfiguration = ({ 
    endpoint, 
    endpointIndex, 
    formErrors, 
    handleEndpointField 
}) => {
    const pageConfig = endpoint.page_configuration || {};
    
    const handlePageConfigChange = (field, value) => {
        const updatedConfig = { ...pageConfig, [field]: value };
        handleEndpointField(endpointIndex, 'page_configuration', updatedConfig);
    };

    const handleNumberChange = (field, value) => {
        const numValue = value === '' ? '' : parseInt(value, 10);
        handlePageConfigChange(field, numValue);
    };

    return (
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-purple-600" />
                <label className="block text-sm font-medium text-gray-700">
                    Page Configuration
                    <span className="text-gray-500 text-xs ml-2">(Optional)</span>
                </label>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pagination Type
                    </label>
                    <select
                        value={pageConfig.type || ''}
                        onChange={(e) => handlePageConfigChange('type', e.target.value)}
                        className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                    >
                        <option value="">No Pagination</option>
                        <option value="OFFSET">Offset-based (startIndex, maxResults)</option>
                        <option value="PAGE">Page-based (page, per_page)</option>
                        <option value="CURSOR">Cursor-based (cursor, limit)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Choose the pagination method used by this API endpoint
                    </p>
                </div>

                {pageConfig.type && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Page Parameter Name
                            </label>
                            <input
                                type="text"
                                value={pageConfig.page_key || ''}
                                onChange={(e) => handlePageConfigChange('page_key', e.target.value)}
                                placeholder={pageConfig.type === 'OFFSET' ? 'startIndex' : pageConfig.type === 'PAGE' ? 'page' : 'cursor'}
                                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Query parameter name for page/offset/cursor
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Per Page Parameter Name
                            </label>
                            <input
                                type="text"
                                value={pageConfig.per_page_key || ''}
                                onChange={(e) => handlePageConfigChange('per_page_key', e.target.value)}
                                placeholder={pageConfig.type === 'OFFSET' ? 'maxResults' : pageConfig.type === 'PAGE' ? 'per_page' : 'limit'}
                                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Query parameter name for items per page
                            </p>
                        </div>
                    </div>
                )}

                {pageConfig.type && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Items Per Page
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={pageConfig.default_per_page || ''}
                                onChange={(e) => handleNumberChange('default_per_page', e.target.value)}
                                placeholder="25"
                                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Default number of items to fetch per page
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Items Per Page
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={pageConfig.max_per_page || ''}
                                onChange={(e) => handleNumberChange('max_per_page', e.target.value)}
                                placeholder="100"
                                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Maximum number of items allowed per page
                            </p>
                        </div>
                    </div>
                )}

                {pageConfig.type && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-blue-800">
                                <p className="font-medium mb-1">Pagination Configuration Preview:</p>
                                <p className="text-blue-700">
                                    {pageConfig.type === 'OFFSET' && (
                                        <>Query: <code className="bg-blue-100 px-1 rounded">{pageConfig.page_key || 'startIndex'}=0&{pageConfig.per_page_key || 'maxResults'}={pageConfig.default_per_page || 25}</code></>
                                    )}
                                    {pageConfig.type === 'PAGE' && (
                                        <>Query: <code className="bg-blue-100 px-1 rounded">{pageConfig.page_key || 'page'}=1&{pageConfig.per_page_key || 'per_page'}={pageConfig.default_per_page || 25}</code></>
                                    )}
                                    {pageConfig.type === 'CURSOR' && (
                                        <>Query: <code className="bg-blue-100 px-1 rounded">{pageConfig.page_key || 'cursor'}=abc123&{pageConfig.per_page_key || 'limit'}={pageConfig.default_per_page || 25}</code></>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageConfiguration;
