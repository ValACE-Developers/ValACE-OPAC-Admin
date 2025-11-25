import { Plus } from 'lucide-react';

const HeadersTable = ({ formData, formErrors, handleHeadersChange, addHeaderRow, removeHeaderRow }) => {
    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Headers</h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                        {formData.api_resource.headers.filter(h => h.key.trim()).length}
                    </span>
                </div>
                <button 
                    type="button" 
                    onClick={addHeaderRow}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                    Add Header
                </button>
            </div>

            {/* Headers Table */}
            <div className="space-y-1">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 py-2 px-3 bg-gray-50 rounded-t-md text-sm font-medium text-gray-600 border border-gray-200">
                    <div className="col-span-1 flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    </div>
                    <div className="col-span-4">Key</div>
                    <div className="col-span-6">Value</div>
                    <div className="col-span-1">Description</div>
                </div>

                {/* Headers Rows */}
                {formData.api_resource.headers.map((h, idx) => (
                    <div key={`hdr-${idx}`} className="grid grid-cols-12 gap-4 py-2 px-3 bg-white hover:bg-gray-50 border border-gray-200 border-t-0 last:rounded-b-md">
                        <div className="col-span-1 flex items-center">
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                defaultChecked={h.key.trim() !== ''}
                            />
                        </div>
                        <div className="col-span-4">
                            <input
                                type="text"
                                value={h.key}
                                onChange={(e) => handleHeadersChange(idx, 'key', e.target.value)}
                                placeholder="Key"
                                className="w-full bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                            />
                        </div>
                        <div className="col-span-6 flex items-center gap-2">
                            <input
                                type="text"
                                value={h.value}
                                onChange={(e) => handleHeadersChange(idx, 'value', e.target.value)}
                                placeholder="Value"
                                className="flex-1 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                            />
                            {h.value && (
                                <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                            <button 
                                type="button" 
                                onClick={() => removeHeaderRow(idx)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bulk Edit and Presets */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                    <button 
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Bulk Edit
                    </button>
                    <div className="relative">
                        <button 
                            type="button"
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                        >
                            Presets
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <button 
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Hide auto-generated headers
                </button>
            </div>
        </div>
    );
};

export default HeadersTable;
