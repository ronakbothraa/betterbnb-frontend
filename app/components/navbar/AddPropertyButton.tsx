"use client";

import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { CirclePlus } from "lucide-react";

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
      className="flex flex-row items-center space-x-2 cursor-pointer p-3 text-sm font-semibold rounded-full hover:bg-gray-200"
    >
      <CirclePlus />
      <div>Property</div>
    </div>
  );
};

export default AddPropertyButton;
