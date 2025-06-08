"use client";

import { MessageType } from "@/app/inbox/[id]/page";
import { ConversationType } from "@/app/inbox/page";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";

type ConversationDetailProps = {
  token: string;
  user: string;
  conversation: ConversationType;
  messages: MessageType[];
};

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversation,
  user,
  token,
  messages,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesDiv = useRef<HTMLDivElement>(null);
  const [realtimeMessages, setRealtimeMessages] = useState<MessageType[]>([])

  const me = conversation.user.filter((u) => u.id === user)[0];
  const otherUser = conversation.user.filter((u) => u.id !== user)[0];

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://localhost:8000/ws/chat/${conversation.id}/?token=${token}`,
    {
      share: false,
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    console.log("WebSocket connection state: ", readyState);
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage && typeof lastJsonMessage === 'object' && 'name' in lastJsonMessage && 'body' in lastJsonMessage) {
      const message: MessageType ={
        id: '',
        name: lastJsonMessage.name as string,
        body: lastJsonMessage.body as string,
        sender: me,
        receiver: otherUser,
        conversationId: conversation.id
      }
      setRealtimeMessages((realtimeMessages) => [...realtimeMessages, message])
    } 
    scrollToBottom();

  }, [lastJsonMessage])

  const sendMessage = async () => {
    sendJsonMessage({
      event: "chat_message",
      data: {
        body: newMessage,
        name: me.name,
        receiver: otherUser.id,
        conversation_id: conversation.id,
      },
    });
    setNewMessage("");

    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  const scrollToBottom = () => {
    if (messagesDiv.current) {
      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
    }
  };

  return (
    <div
      ref={messagesDiv}
      className="py-2 max-h-[80vh] overflow-auto flex flex-col space-y-4"
    >
      {messages?.map((message,index) => (
      <div key={index}>
      
      <div className={`w-[80%] py-4 px-6 rounded-xl ${message.sender.id == otherUser.id ? "bg-gray-200" : "ml-[20%] bg-blue-100" }`}>
        <p className="font-bold text-gray-500">{message.name}</p>

        <p>{message.body}</p>
      </div>

      </div>
      ))}
      {realtimeMessages.map((message,index) => (
      <div key={index}>
      
      <div className={`w-[80%] py-4 px-6 rounded-xl ${message.sender.id == otherUser.id ? "bg-gray-200" : "ml-[20%] bg-blue-100" }`}>
        <p>{message.body}</p>
      </div>

      </div>
      ))}

      <div className="fixed bg-white/30 backdrop-blur-sm bottom-4 left-4 right-4 py-4 px-6 flex border border-gray-300 space-x-4 rounded-xl">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-3 bg-gray-200 rounded-xl"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-airbnb cursor-pointer text-white rounded-lg"
        >
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
};

export default ConversationDetail;
