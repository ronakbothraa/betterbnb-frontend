"use client";

import { CircleUserRound, Menu } from "lucide-react";
import { useState } from "react";
import MenuLink from "./MenuLink";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";

const UserNav = () => {
  const loginModal = useLoginModal();
  const signupModal = useSignupModal()
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block border rounded-full">
      <div
        className={`${
          isOpen && "bg-airbnb"
        } p-2 rounded-full hover:bg-airbnb transition`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          <Menu color={isOpen ? "white" : "black"} />
          <CircleUserRound color={isOpen ? "white" : "black"} />
        </button>
      </div>

      {isOpen && (
        <div className="cursor-pointer flex flex-col w-[220px] absolute top-[50px] right-0 bg-white border border-gray-300 rounded-xl shadow-md">
          <MenuLink
            label="Sign In"
            onClick={() => {
              setIsOpen(false);
              loginModal.openModal();
            }}
          />
          <MenuLink
            label="Sign Up"
            onClick={() => {
              setIsOpen(false);
              signupModal.openModal();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UserNav;
