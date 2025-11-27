const AuthConfiguration = ({ formData, formErrors, handleApiConfigChange }) => {
    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Auth Type Selection */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Auth Type
                        </label>
                        <div className="relative">
                            <select 
                                name="auth_type" 
                                value={formData.api_resource.auth_type} 
                                onChange={handleApiConfigChange}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
                            >
                                <option value="NONE">No Auth</option>
                                <option value="API_KEY">API Key</option>
                                <option value="BEARER">Bearer Token</option>
                                <option value="BASIC">Basic Auth</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {formErrors['api_resource.auth_type'] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.auth_type']}</p>
                        )}
                    </div>

                    {/* Auth Description */}
                    <div className="text-sm text-gray-600">
                        {formData.api_resource.auth_type === 'NONE' && (
                            <div className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900">No Auth</p>
                                    <p>This request does not use any authorization.</p>
                                </div>
                            </div>
                        )}
                        {formData.api_resource.auth_type === 'API_KEY' && (
                            <div className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900">API Key</p>
                                    <p>The authorization header will be automatically generated when you send the request. Learn more about <span className="text-blue-600 underline cursor-pointer">API Key authorization</span>.</p>
                                </div>
                            </div>
                        )}
                        {formData.api_resource.auth_type === 'BEARER' && (
                            <div className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Bearer Token</p>
                                    <p>The authorization header will be automatically generated when you send the request. Learn more about <span className="text-blue-600 underline cursor-pointer">Bearer Token authorization</span>.</p>
                                </div>
                            </div>
                        )}
                        {formData.api_resource.auth_type === 'BASIC' && (
                            <div className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Basic Auth</p>
                                    <p>The authorization header will be automatically generated when you send the request. Learn more about <span className="text-blue-600 underline cursor-pointer">Basic Auth authorization</span>.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Auth Configuration */}
                {formData.api_resource.auth_type !== 'NONE' && (
                    <div className="space-y-4">
                        {formData.api_resource.auth_type === 'API_KEY' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-red-600 mb-2">
                                        Key
                                    </label>
                                    <input
                                        type="text"
                                        name="auth_key_name"
                                        value={formData.api_resource.auth_key_name}
                                        onChange={handleApiConfigChange}
                                        placeholder="Key"
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {formErrors['api_resource.auth_key_name'] && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.auth_key_name']}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-red-600 mb-2">
                                        Value
                                    </label>
                                    <input
                                        type="text"
                                        name="auth_key_value"
                                        value={formData.api_resource.auth_key_value}
                                        onChange={handleApiConfigChange}
                                        placeholder="Value"
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {formErrors['api_resource.auth_key_value'] && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.auth_key_value']}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-red-600 mb-2">
                                        Add to
                                    </label>
                                    <div className="relative">
                                        <select 
                                            name="auth_location" 
                                            value={formData.api_resource.auth_location} 
                                            onChange={handleApiConfigChange}
                                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
                                        >
                                            <option value="HEADER">Header</option>
                                            <option value="PARAM_QUERY">Query Params</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {formErrors['api_resource.auth_location'] && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.auth_location']}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {formData.api_resource.auth_type === 'BEARER' && (
                            <div>
                                <label className="block text-sm font-medium text-red-600 mb-2">
                                    Token
                                </label>
                                <input
                                    type="text"
                                    name="auth_key_value"
                                    value={formData.api_resource.auth_key_value}
                                    onChange={handleApiConfigChange}
                                    placeholder="Token"
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formErrors['api_resource.auth_key_value'] && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.auth_key_value']}</p>
                                )}
                            </div>
                        )}

                        {formData.api_resource.auth_type === 'BASIC' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-red-600 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="auth_key_name"
                                        value={formData.api_resource.auth_key_name}
                                        onChange={handleApiConfigChange}
                                        placeholder="Username"
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {formErrors['api_resource.auth_key_name'] && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.auth_key_name']}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-red-600 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="auth_key_value"
                                        value={formData.api_resource.auth_key_value}
                                        onChange={handleApiConfigChange}
                                        placeholder="Password"
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {formErrors['api_resource.auth_key_value'] && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors['api_resource.auth_key_value']}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthConfiguration;
