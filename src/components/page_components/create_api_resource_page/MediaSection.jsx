import { UploadCloud, Trash2, Image } from 'lucide-react';

const MediaSection = ({ formData, formErrors, handleFileChange, handleDragOver, handleDrop, setFormData }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Media & Branding
                        <Image className="w-5 h-5 text-purple-600" />
                    </h3>
                    <p className="text-sm text-gray-500">Upload an image cover for the resource</p>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Image Cover <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="image_cover"
                            className="flex flex-col items-center justify-center w-full h-auto border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {formData.image_cover ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-[200px] h-[250px] rounded bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                                            <img
                                                src={URL.createObjectURL(formData.image_cover)}
                                                alt="Preview"
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {formData.image_cover.name}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="w-8 h-8 mb-4 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 5MB
                                        </p>
                                    </>
                                )}
                            </div>
                            <input
                                id="image_cover"
                                name="image_cover"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                    {formData.image_cover && (
                        <div className="mt-2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, image_cover: null }))}
                                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
                            >
                                Remove Image
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
                {formErrors.image_cover && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.image_cover}</p>
                )}
            </div>
        </div>
    );
};

export default MediaSection;
