import { CircleCheck, CircleX, Info } from 'lucide-react';

const BasicInformationSection = ({ formData, formErrors, handleTopLevelChange, handleFileChange, handleDragOver, handleDrop }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Basic Information
                        <Info className="w-5 h-5 text-blue-600" />
                    </h3>
                    <p className="text-sm text-gray-500">Provide basic details about the API resource</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleTopLevelChange}
                        placeholder="e.g., EBSCOhost Academic Search Complete"
                        className={`mt-1 block w-full rounded-md border ${formErrors['name'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                    />
                    {formErrors['name'] && <p className="mt-1 text-sm text-red-600">{formErrors['name']}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleTopLevelChange}
                        rows={3}
                        placeholder="Comprehensive academic database with full-text articles..."
                        className={`mt-1 block w-full rounded-md border ${formErrors['description'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                    />
                    {formErrors['description'] && <p className="mt-1 text-sm text-red-600">{formErrors['description']}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status <span className="text-gray-500">(Default: ACTIVE)</span>
                        </label>
                        <div className={`mt-1 block w-full rounded-md border ${formErrors['status'] ? 'border-red-300' : 'border-gray-300'} shadow-sm px-3 py-2 bg-white focus-within:outline-2 focus-within:outline-[var(--main-color)] relative flex items-center justify-between pl-10`}>
                            {formData.status === 'ACTIVE' && (
                                <CircleCheck className="w-6 h-6 text-green-500 absolute left-3" />
                            )}
                            {formData.status === 'INACTIVE' && (
                                <CircleX className="w-6 h-6 text-red-500 absolute left-3" />
                            )}
                            <select name="status" value={formData.status} onChange={handleTopLevelChange} className="w-full bg-transparent focus:outline-none" disabled>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                        {formErrors['status'] && <p className="mt-1 text-sm text-red-600">{formErrors['status']}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInformationSection;
