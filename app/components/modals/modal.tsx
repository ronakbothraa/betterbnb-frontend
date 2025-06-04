"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ModelProps {
  label: string;
  content?: React.ReactElement;
  isOpen?: boolean;
  close: () => void;
}

const Modal: React.FC<ModelProps> = ({ label, content, isOpen, close }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);

    setTimeout(() => {
      close();
    }, 300);
  }, [close]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex items-center justify-center fixed inset-0 z-50 bg-black bg-opacity-60">
      <div className="relative w-[90%] md:w-[80%] lg:w-[700px] my-6 h-auto mx-auto">
        <div
          className={`translate duration-500 h-full ${
            showModal
              ? "translate-y-100 opacity-100"
              : "translate-y-0 opacity-10"
          }`}
        >
          <div className="w-full h-auto rounded-xl relative flex flex-col bg-white">
            <header className="flex items-center p-5 rounded-t justify-center relative border-b">
              <div onClick={handleClose} className="p-3 absolute left-3 transition hover:bg-gray-300 rounded-full cursor-pointer">
                <X />
              </div>

              <h2 className="text-lg font-bold">{label}</h2>
            </header>

            <section className="p-6 ">{content}</section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
