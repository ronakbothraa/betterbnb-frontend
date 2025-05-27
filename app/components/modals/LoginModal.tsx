"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/actions";

const LoginModal = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string[]>([]);

  const loginModal = useLoginModal();

  const submitLogin = async () => {
    const data = {
      email: email,
      password: password,
    };

    const response = await apiService.post("api/auth/login/", data);

    if (response.access) {
      handleLogin(response.user.pk, response.access, response.refresh);
      loginModal.closeModal();
      router.push("/");
    } else {
      const tmpErrors: string[] = Object.values(response).map((erorr: any) => {
        return erorr;
      });
      setError(tmpErrors);
    }
  };

  const content = (
    <form action={submitLogin} className="space-y-4">
      <input
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        type="email"
        className="mb-2 w-full h-[54px] px-4 border border-gray-300 rounded-xl "
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••••"
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
      label="Sign In"
      isOpen={loginModal.isOpen}
      close={loginModal.closeModal}
    />
  );
};

export default LoginModal;
