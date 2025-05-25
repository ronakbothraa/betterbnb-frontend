"use client";

import { CircleUserRound, Menu } from "lucide-react";
import { useState } from "react";
import MenuLink from "./MenuLink";

const UserNav = () => {
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
            label="Register"
            onClick={() => console.log("menu link clicked")}
          />
          <MenuLink
            label="Login"
            onClick={() => console.log("menu link clicked")}
          />
        </div>
      )}
    </div>
  );
};

export default UserNav;
