"use client";

import { ConversationType } from "@/app/inbox/page";
import { useRouter } from "next/navigation";

interface ConversationProps {
  conversation: ConversationType;
  user: string;
}

const Conversation: React.FC<ConversationProps> = ({ conversation, user }) => {
  const router = useRouter();
  const otherUser = conversation.user.find((u) => u.id !== user);

  return (
    <div className="px-6 py-4 border cursor-pointer border-gray-300 rounded-xl">
      <p className="mb-6 text-xl">{otherUser?.name}</p>

      <p
        onClick={() => router.push(`/inbox/${conversation.id}`)}
        className="text-airbnb-dark "
      >
        Go to conversation
      </p>
    </div>
  );
};

export default Conversation;
