"use client";

import Modal from "./modal";
import useSignupModal from "@/app/hooks/useSignupModal";

const SignupModal = () => {
  const signupModal = useSignupModal();

  const content = (
    <div>
        <input placeholder="name@example.com" type="email" className="mb-2 w-full h-[54px] px-4 border border-gray-300 rounded-xl "/>
        <input placeholder="Pas•••rd" type="password" className="mb-2 w-full h-[54px] px-4 border border-gray-300 rounded-xl "/>
        <input placeholder="Co••f•rm Pas•••rd" type="password" className="mb-4 w-full h-[54px] px-4 border border-gray-300 rounded-xl "/>
        <button className="w-full p-3 bg-airbnb cursor-pointer text-white rounded-lg">
            Submit
        </button>
    </div>
  );

  return (
    <Modal
      content={content}
      label="Sign Up"
      isOpen={signupModal.isOpen}
      close={signupModal.closeModal}
    />
  );
};

export default SignupModal;
