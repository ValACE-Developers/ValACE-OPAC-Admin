import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { z } from "zod";
import Breadcrumb from "../components/ui/Breadcrumb.jsx";
import { useUpdateResource } from "../hooks/resources/useUpdateResource.js";
import {
    NotificationContainer,
    useNotification,
} from "../hooks/useNotification.jsx";
import {
    ChevronLeft,
    CircleCheck,
    Share2,
    Trash2,
    UploadCloud,
    CircleX,
} from "lucide-react";

export const EditRedirectResourcePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { success, error, notifications, removeNotification } =
        useNotification();
    const { mutateAsync, isPending } = useUpdateResource();

    const resourceFromState = location.state?.resource || null;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "ACTIVE",
        redirect_url: "",
        opens_in_new_tab: 1,
        image_cover: null,
    });

    const [formErrors, setFormErrors] = useState({});

    // Initialize form data from resource state
    useEffect(() => {
        if (resourceFromState) {
            const redirectLink = resourceFromState.redirect_links?.[0];
            setFormData({
                name: resourceFromState.name || "",
                description: resourceFromState.description || "",
                status: resourceFromState.status || "ACTIVE",
                redirect_url: redirectLink?.redirect_url || "",
                opens_in_new_tab: redirectLink?.opens_in_new_tab ? 1 : 0,
                image_cover: null,
            });
        }
    }, [resourceFromState]);

    const schema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        description: z.string().optional(),
        status: z.enum(["ACTIVE", "INACTIVE"]),
        redirect_url: z
            .string()
            .url("Please enter a valid URL (include http/https)")
            .optional(),
        opens_in_new_tab: z.number(),
        image_cover: z.any().optional(),
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            error("Please select an image file");
            return;
        }
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            error("Image file size must be less than 5MB");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        try {
            const validated = schema.parse(formData);
            const formDataToSend = new FormData();
            formDataToSend.append("name", validated.name);
            formDataToSend.append("description", validated.description);
            formDataToSend.append("status", validated.status);
            formDataToSend.append("redirect_url", validated.redirect_url);
            formDataToSend.append(
                "opens_in_new_tab",
                validated.opens_in_new_tab.toString()
            );
            formDataToSend.append("type", "REDIRECT");
            if (validated.image_cover) {
                formDataToSend.append("image_cover", validated.image_cover);
            }

            await mutateAsync({ id, payload: formDataToSend });
            success("Redirect resource updated successfully");
            setTimeout(() => navigate("/admin/resources"), 800);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors = err.flatten().fieldErrors;
                const friendly = Object.fromEntries(
                    Object.entries(fieldErrors).map(([k, v]) => [
                        k,
                        v?.[0] || "Invalid value",
                    ])
                );
                setFormErrors(friendly);
                error("Please correct the highlighted fields");
            } else {
                error(err?.message || "Failed to update resource");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <NotificationContainer
                notifications={notifications}
                removeNotification={removeNotification}
            />
            <div className="w-full">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            label: "Resource",
                            onClick: () => navigate("/admin/resources"),
                        },
                        { label: "Edit Redirect Resource" },
                    ]}
                />

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="bg-[#00104A] px-6 py-4 rounded-t-lg">
                        <div className="flex flex-col">
                            <div className="mb-5">
                                <button
                                    onClick={() =>
                                        navigate("/admin/resources")
                                    }
                                    className=" text-white rounded-md font-medium hover:text-white/80 transition-colors flex items-center gap-1 w-fit"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>Back to Resources</span>
                                </button>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    Edit Redirect Resource
                                    <Share2 className="w-8 h-8 text-white" />
                                </h1>
                                <p className="text-blue-100 mt-1">
                                    Update redirect resource configuration
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {!resourceFromState ? (
                        <div className="p-6 text-sm text-gray-600">
                            Resource data not found. Please return to Resources and open edit from there.
                            <div className="mt-3">
                                <button onClick={() => navigate('/admin/resources')} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Back to Resources</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g., Library Catalog"
                                        className={`mt-1 block w-full rounded-md border ${
                                            formErrors.name
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        } shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description{" "}
                                        <span className="text-gray-500">
                                            (Optional)
                                        </span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Direct link to the main library catalog system"
                                        className={`mt-1 block w-full rounded-md border ${
                                            formErrors.description
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        } shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                                    />
                                    {formErrors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <div
                                            className={`mt-1 block w-full rounded-md border ${
                                                formErrors.status
                                                    ? "border-red-300"
                                                    : "border-gray-300"
                                            } shadow-sm px-3 py-2 bg-white focus-within:outline-2 focus-within:outline-[var(--main-color)] relative flex items-center justify-between pl-10`}
                                        >
                                            {formData.status === "ACTIVE" && (
                                                <CircleCheck className="w-6 h-6 text-green-500 absolute left-3" />
                                            )}
                                            {formData.status === "INACTIVE" && (
                                                <CircleX className="w-6 h-6 text-red-500 absolute left-3" />
                                            )}
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="w-full bg-transparent focus:outline-none"
                                            >
                                                <option value="ACTIVE">
                                                    ACTIVE
                                                </option>
                                                <option value="INACTIVE">
                                                    INACTIVE
                                                </option>
                                            </select>
                                        </div>
                                        {formErrors.status && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.status}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Open In New Tab{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2 flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        opens_in_new_tab:
                                                            prev.opens_in_new_tab ===
                                                            1
                                                                ? 0
                                                                : 1,
                                                    }))
                                                }
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2 ${
                                                    formData.opens_in_new_tab === 1
                                                        ? "bg-[var(--main-color)]"
                                                        : "bg-gray-200"
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        formData.opens_in_new_tab ===
                                                        1
                                                            ? "translate-x-6"
                                                            : "translate-x-1"
                                                    }`}
                                                />
                                            </button>
                                            <label className="text-sm text-gray-700">
                                                Open link in a new browser tab?{" "}
                                                <br />
                                                <span className="text-sm text-gray-500">
                                                    {formData.opens_in_new_tab === 1
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                            </label>
                                        </div>
                                        {formErrors.opens_in_new_tab && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formErrors.opens_in_new_tab}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Redirect URL{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="redirect_url"
                                        value={formData.redirect_url}
                                        onChange={handleChange}
                                        placeholder="e.g., https://catalog.library.edu"
                                        className={`mt-1 block w-full rounded-md border ${
                                            formErrors.redirect_url
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        } shadow-sm px-3 py-2 bg-white focus:outline-2 focus:outline-[var(--main-color)]`}
                                    />
                                    {formErrors.redirect_url && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.redirect_url}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Image Cover{" "}
                                        <span className="text-gray-500">
                                            (Optional - upload new to replace)
                                        </span>
                                    </label>
                                    <div className="mt-1">
                                        {resourceFromState.image_cover_url && !formData.image_cover && (
                                            <div className="mb-3">
                                                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                                                <div className="w-[200px] h-[250px] rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={resourceFromState.image_cover_url}
                                                        alt="Current cover"
                                                        className="w-full h-auto object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
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
                                                                    src={URL.createObjectURL(
                                                                        formData.image_cover
                                                                    )}
                                                                    alt="Preview"
                                                                    className="w-full h-auto object-cover"
                                                                />
                                                            </div>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    formData
                                                                        .image_cover
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <UploadCloud className="w-8 h-8 mb-4 text-gray-400" />
                                                            <p className="mb-2 text-sm text-gray-500">
                                                                <span className="font-semibold">
                                                                    Click to upload
                                                                </span>{" "}
                                                                or drag and drop
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                PNG, JPG, GIF up to
                                                                5MB
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
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            image_cover: null,
                                                        }))
                                                    }
                                                    className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
                                                >
                                                    Remove New Image
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {formErrors.image_cover && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.image_cover}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/resources")
                                    }
                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    disabled={isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-[#00104A] text-white hover:opacity-90 disabled:opacity-60"
                                    disabled={isPending}
                                >
                                    {isPending
                                        ? "Updating..."
                                        : "Update Redirect Resource"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
