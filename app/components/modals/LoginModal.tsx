"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/actions";

// Fix: Replace 'any' with proper types
interface LoginResponse {
  access?: string;
  refresh?: string;
  user?: {
    pk: string;
  };
  non_field_errors?: string[];
  email?: string | string[];
  password?: string | string[];
  detail?: string;
  message?: string;
}

const LoginModal = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loginModal = useLoginModal();

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError([]);

    try {
      const data = {
        email: email.trim(),
        password: password,
      };

      const response: LoginResponse = await apiService.post("api/auth/login/", data);

      if (response.access && response.refresh && response.user?.pk) {
        await handleLogin(response.user.pk, response.access, response.refresh);
        loginModal.closeModal();
        
        setEmail("");
        setPassword("");
        
        router.push("/");
      } else {
        const tmpErrors: string[] = [];
        
        if (response.non_field_errors) {
          tmpErrors.push(...response.non_field_errors);
        }
        if (response.email) {
          tmpErrors.push(...(Array.isArray(response.email) ? response.email : [response.email]));
        }
        if (response.password) {
          tmpErrors.push(...(Array.isArray(response.password) ? response.password : [response.password]));
        }
        if (response.detail) {
          tmpErrors.push(response.detail);
        }
        if (response.message) {
          tmpErrors.push(response.message);
        }
        
        if (tmpErrors.length === 0) {
          tmpErrors.push("Login failed. Please check your credentials.");
        }
        
        setError(tmpErrors);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(["An error occurred. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <form onSubmit={submitLogin} className="space-y-4">
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="name@example.com"
        type="email"
        required
        disabled={isLoading}
        className="mb-2 w-full h-[54px] px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent disabled:bg-gray-100"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="••••••••••"
        type="password"
        required
        disabled={isLoading}
        className="mb-4 w-full h-[54px] px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent disabled:bg-gray-100"
      />

      {error.length > 0 && (
        <div className="space-y-2">
          {error.map((err, index) => (
            <div
              key={index}
              className="p-3 bg-red-500 text-white rounded-xl text-sm"
            >
              {err}
            </div>
          ))}
        </div>
      )}

      <button 
        type="submit"
        disabled={isLoading || !email.trim() || !password}
        className="w-full p-3 bg-airbnb text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-airbnb-dark transition-colors"
      >
        {isLoading ? "Signing In..." : "Submit"}
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