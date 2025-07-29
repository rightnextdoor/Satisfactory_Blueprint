/* src/components/planner/modals/RemoveRecipeModal.tsx */
import React from 'react';

interface RemoveRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RemoveRecipeModal: React.FC<RemoveRecipeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  return (
    <div className="planner-modal-overlay">
      <div className="planner-modal-content">
        <h3 className="text-lg font-semibold mb-4">Remove Recipe</h3>
        {/* TODO: add selection controls here */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RemoveRecipeModal;
