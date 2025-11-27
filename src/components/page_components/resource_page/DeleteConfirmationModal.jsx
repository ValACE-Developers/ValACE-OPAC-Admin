/**
 * Author: Jerry Castrudes
 * Date: September 19, 2025
 * Description: Delete confirmation modal component for resource page
 * Version: 1.0.0
 * Last Updated: September 19, 2025
 */

import React from "react";

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    resourceName,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Delete Resource</h3>
                </div>
                <div className="px-6 py-5">
                    <p className="text-sm text-gray-700">
                        Are you sure you want to permanently delete
                        {" "}
                        <span className="font-medium">{resourceName}</span>?
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                        This action cannot be undone.
                    </p>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
