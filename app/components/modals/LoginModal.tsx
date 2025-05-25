"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./modal";

const LoginModal = () => {
  const loginModal = useLoginModal();

  const content = (
    <div>
        <input placeholder="name@example.com" type="email" className="mb-2 w-full h-[54px] px-4 border border-gray-300 rounded-xl "/>
        <input placeholder="••••••••••" type="password" className="mb-4 w-full h-[54px] px-4 border border-gray-300 rounded-xl "/>
        <button className="w-full p-3 bg-airbnb cursor-pointer text-white rounded-lg">
            Submit
        </button>
    </div>
  );

  return (
    <Modal
      content={content}
      label="Sign In"
      isOpen={loginModal.isOpen}
      close={loginModal.closeModal}
    />
  );
};

export default LoginModal;
