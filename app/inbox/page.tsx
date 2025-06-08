import Conversation from "../components/inbox/conversation";
import { getAuthCookies } from "../lib/actions";
import apiService from "../services/apiService";
import { MessageType } from "./[id]/page";

export type UserType = {
  id: string;
  name: string;
  avatar_url: string;
};

export type ConversationType = {
  id: string;
  user: UserType[];
  messages: MessageType[];
};

const InboxPage = async () => {

  const user = await getAuthCookies();

  if (!user) {
    return (
      <main className="max-w-[1500px] mx-auto px-6 pb-6">
        <div className="text-center mt-20">
          <h1 className="text-2xl">
            Please{" "}
            <strong className="cursor-pointer text-airbnb hover:text-airbnb-dark">
              log in
            </strong>{" "}
            to view your inbox.
          </h1>
        </div>
      </main>
    );
  }

  const conversations: ConversationType[] = await apiService.get("api/chat/");

  console.log("Conversations: ", conversations);

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6 space-y-2">
      <h1 className="my-6 text-2xl">Inbox</h1>
      {conversations.map((conversation: ConversationType) => (
        <Conversation
          key={conversation.user[0].id}
          user={user}
          conversation={conversation}
        />
      ))}
    </main>
  );
};

export default InboxPage;
