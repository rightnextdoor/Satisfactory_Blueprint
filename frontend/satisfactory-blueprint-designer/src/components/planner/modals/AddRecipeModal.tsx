/* src/components/planner/modals/AddRecipeModal.tsx */
import React from 'react';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="planner-modal-overlay">
      <div className="planner-modal-content">
        <h3 className="text-lg font-semibold mb-4">Add Recipe</h3>
        {/* TODO: add form fields here */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddRecipeModal;
