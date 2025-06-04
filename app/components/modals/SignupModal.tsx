"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./modal";
import useSignupModal from "@/app/hooks/useSignupModal";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/actions";

// Add interface for API response
interface SignupResponse {
  access?: string;
  refresh?: string;
  user?: {
    pk: string;
  };
  non_field_errors?: string[];
  email?: string | string[];
  password1?: string | string[];
  password2?: string | string[];
  detail?: string;
  message?: string;
}

const SignupModal = () => {
  const router = useRouter();
  const signupModal = useSignupModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    if (isLoading) return; // Prevent multiple submissions
    
    // Client-side validation
    if (!email.trim() || !password || !confirmPassword) {
      setError(["All fields are required."]);
      return;
    }

    if (password !== confirmPassword) {
      setError(["Passwords do not match."]);
      return;
    }

    if (password.length < 8) {
      setError(["Password must be at least 8 characters long."]);
      return;
    }

    setIsLoading(true);
    setError([]); // Clear previous errors

    try {
      const response: SignupResponse = await apiService.post("api/auth/register/", {
        email: email.trim(),
        password1: password,
        password2: confirmPassword,
      });

      if (response.access && response.refresh && response.user?.pk) {
        await handleLogin(response.user.pk, response.access, response.refresh);
        signupModal.closeModal();
        
        // Reset form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        router.push("/");
      } else {
        // Handle API errors more robustly
        const tmpErrors: string[] = [];
        
        if (response.non_field_errors) {
          tmpErrors.push(...response.non_field_errors);
        }
        if (response.email) {
          tmpErrors.push(...(Array.isArray(response.email) ? response.email : [response.email]));
        }
        if (response.password1) {
          tmpErrors.push(...(Array.isArray(response.password1) ? response.password1 : [response.password1]));
        }
        if (response.password2) {
          tmpErrors.push(...(Array.isArray(response.password2) ? response.password2 : [response.password2]));
        }
        if (response.detail) {
          tmpErrors.push(response.detail);
        }
        if (response.message) {
          tmpErrors.push(response.message);
        }
        
        // Fallback error message
        if (tmpErrors.length === 0) {
          tmpErrors.push("Registration failed. Please try again.");
        }
        
        setError(tmpErrors);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(["An error occurred during registration. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <form onSubmit={submitSignup} className="space-y-4">
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
        placeholder="Password"
        type="password"
        required
        minLength={8}
        disabled={isLoading}
        className="mb-2 w-full h-[54px] px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent disabled:bg-gray-100"
      />
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        placeholder="Confirm Password"
        type="password"
        required
        minLength={8}
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
        disabled={isLoading || !email.trim() || !password || !confirmPassword}
        className="w-full p-3 bg-airbnb text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-airbnb-dark transition-colors"
      >
        {isLoading ? "Creating Account..." : "Submit"}
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