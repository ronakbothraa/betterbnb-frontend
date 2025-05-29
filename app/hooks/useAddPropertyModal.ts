import { create } from "zustand";

interface AddPropertyState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useAddPropertyModal = create<AddPropertyState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useAddPropertyModal;