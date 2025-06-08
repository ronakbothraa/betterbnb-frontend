"use client";

import React from "react";
import apiService from "../services/apiService";
import { useRouter } from "next/navigation";

const HostContact = ({ host_id }: { host_id: string }) => {
  const router = useRouter();
  const startConversation = async () => {
    try {
      const conversation: { conversation_id: string } = await apiService.get(
        `api/chat/start/${host_id}`
      );
      console.log("Conversation started: ", conversation.conversation_id);
      router.push(`/inbox/${conversation.conversation_id}`);
    } catch (error) {
      console.error("Error starting conversation: ", error);
    }
  };

  return (
    <button
      onClick={startConversation}
      className="cursor-pointer mt-6 py-3 px-6 bg-airbnb text-white rounded-xl hover:bg-airbnb-dark transition focus:outline-none focus:ring-2 focus:ring-airbnb focus:ring-offset-2"
      aria-label={`Contact`}
    >
      Contact
    </button>
  );
};

export default HostContact;
