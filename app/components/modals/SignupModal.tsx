"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./modal";
import useSignupModal from "@/app/hooks/useSignupModal";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/actions";

const SignupModal = () => {
  const router = useRouter();
  const signupModal = useSignupModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string[]>([]);

  const submitSignup = async () => {

    const response = await apiService.post("api/auth/register/", {
      email: email,
      password1: password,
      password2: confirmPassword,
    });

    if (response.access) {
      handleLogin(response.user.pk, response.access, response.refresh);
      signupModal.closeModal();
    } else {
      const tmpErrors: string[] = Object.values(response).map((erorr: any) => {
        return erorr;
      });
      setError(tmpErrors);
    }
  };

  const content = (
    <form action={submitSignup} className="space-y-4">
      <input
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        type="email"
        className="mb-2 w-full h-[54px] px-4 border border-gray-300 rounded-xl "
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Pas•••rd"
        type="password"
        className="mb-2 w-full h-[54px] px-4 border border-gray-300 rounded-xl "
      />
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Co••f•rm Pas•••rd"
        type="password"
        className="mb-4 w-full h-[54px] px-4 border border-gray-300 rounded-xl "
      />

      {error.map((err, index) => (
        <div
          key={index}
          className="p-5 bg-airbnb text-white rounded-xl opacity-80"
        >
          {err}
        </div>
      ))}
      <button className="w-full p-3 bg-airbnb cursor-pointer text-white rounded-lg">
        Submit
      </button>
    </form>
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
