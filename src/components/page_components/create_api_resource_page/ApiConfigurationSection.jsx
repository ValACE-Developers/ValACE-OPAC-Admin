import { Settings } from 'lucide-react';
import AuthConfiguration from './AuthConfiguration';
import HeadersTable from './HeadersTable';

const ApiConfigurationSection = ({ 
    formData, 
    formErrors, 
    handleApiConfigChange, 
    handleRateLimitChange, 
    handleHeadersChange, 
    addHeaderRow, 
    removeHeaderRow 
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        API Configuration
                        <Settings className="w-5 h-5 text-green-600" />
                    </h3>
                    <p className="text-sm text-gray-500">Configure the API connection settings</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Base URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            name="base_url"
                            value={formData.api_resource.base_url}
                            onChange={handleApiConfigChange}
                            placeholder="https://api.example.com"
                            className={`mt-1 block w-full rounded-md border ${formErrors['api_resource.base_url'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                        />
                        {formErrors['api_resource.base_url'] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.base_url']}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Default Endpoint
                        </label>
                        <input
                            type="text"
                            name="endpoint"
                            value={formData.api_resource.endpoint}
                            onChange={handleApiConfigChange}
                            placeholder="/v1/books"
                            className={`mt-1 block w-full rounded-md border ${formErrors['api_resource.endpoint'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                        />
                        {formErrors['api_resource.endpoint'] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.endpoint']}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sync Status
                        </label>
                        <select
                            name="sync_status"
                            value={formData.api_resource.sync_status}
                            onChange={handleApiConfigChange}
                            className={`mt-1 block w-full rounded-md border ${formErrors['api_resource.sync_status'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                        >
                            <option value="IDLE">IDLE</option>
                            <option value="SYNCING">SYNCING</option>
                        </select>
                        {formErrors['api_resource.sync_status'] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.sync_status']}</p>
                        )}
                    </div>
                </div>

                {/* Auth Configuration */}
                <AuthConfiguration 
                    formData={formData}
                    formErrors={formErrors}
                    handleApiConfigChange={handleApiConfigChange}
                />

                {/* Timeout Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Timeout (seconds)
                        </label>
                        <input
                            type="number"
                            name="timeout"
                            min={1}
                            max={300}
                            value={formData.api_resource.timeout}
                            onChange={handleApiConfigChange}
                            className={`mt-1 block w-full rounded-md border ${formErrors['api_resource.timeout'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                        />
                        {formErrors['api_resource.timeout'] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.timeout']}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Retry Attempts
                        </label>
                        <input
                            type="number"
                            name="retry_attempts"
                            min={0}
                            max={10}
                            value={formData.api_resource.retry_attempts}
                            onChange={handleApiConfigChange}
                            className={`mt-1 block w-full rounded-md border ${formErrors['api_resource.retry_attempts'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                        />
                        {formErrors['api_resource.retry_attempts'] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.retry_attempts']}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Rate Limit
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="number"
                                    name="requests_per_minute"
                                    min={0}
                                    value={formData.api_resource.rate_limit.requests_per_minute}
                                    onChange={handleRateLimitChange}
                                    placeholder="RPM"
                                    className={`mt-1 block w-full rounded-md border ${formErrors['api_resource.rate_limit.requests_per_minute'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="burst_limit"
                                    min={0}
                                    value={formData.api_resource.rate_limit.burst_limit}
                                    onChange={handleRateLimitChange}
                                    placeholder="Burst"
                                    className={`mt-1 block w-full rounded-md border ${formErrors['api_resource.rate_limit.burst_limit'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                                />
                            </div>
                        </div>
                        {(formErrors['api_resource.rate_limit.requests_per_minute'] || formErrors['api_resource.rate_limit.burst_limit']) && (
                            <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.rate_limit.requests_per_minute'] || formErrors['api_resource.rate_limit.burst_limit']}</p>
                        )}
                    </div>
                </div>

                {/* Headers Section */}
                <HeadersTable 
                    formData={formData}
                    formErrors={formErrors}
                    handleHeadersChange={handleHeadersChange}
                    addHeaderRow={addHeaderRow}
                    removeHeaderRow={removeHeaderRow}
                />
            </div>
        </div>
    );
};

export default ApiConfigurationSection;
