const ConfirmDelete = ({ onConfirm, onCancel }) => {
    return (
        <div className="bg-white p-6 rounded-md">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Confirm Deletion
            </h4>
            <p className="text-gray-600 mb-6">
                Are you sure you want to delete this field? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
                <button
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ConfirmDelete;
