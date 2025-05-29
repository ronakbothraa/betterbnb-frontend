"use client";

import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import useLoginModal from "@/app/hooks/useLoginModal";

interface AddPropertyButtonProps {
  user?: string | null;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ user }) => {
  const loginModal = useLoginModal();
  const addPropertyModal = useAddPropertyModal();

  const addProperty = () => {
    if (!user) {
      loginModal.openModal();
    } else {
      addPropertyModal.openModal();
    }
  };

  return (
    <div
      onClick={addProperty}
      className="cursor-pointer p-2 text-sm font-semibold rounded-full hover:bg-gray-200"
    >
      Add Property
    </div>
  );
};

export default AddPropertyButton;
