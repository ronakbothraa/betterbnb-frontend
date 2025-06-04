import Conversation from "../components/inbox/conversation";
import { getAuthCookies } from "../lib/actions";
import apiService from "../services/apiService";
import useLoginModal from "../hooks/useLoginModal";

export type UserType = {
  id: string;
  name: string;
  avatar_url: string;
};

export type ConversationType = {
  id: string;
  user: UserType[];
}

const InboxPage = async () => {
  const user = await getAuthCookies();

  if (!user) {
    return (
      <main className="max-w-[1500px] mx-auto px-6 pb-6 space-y-2">
        <h1 className="my-6 text-2xl">Inbox</h1>
        <p>
          Please <strong className="text-airbnb">log in</strong> to view your
          inbox.
        </p>
      </main>
    );
  }

  const conversations: ConversationType[] = await apiService.get("api/chat/");

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6 space-y-2">
      <h1 className="my-6 text-2xl">Inbox</h1>
      {
        conversations.map((conversation: ConversationType) => (
          <Conversation key={conversation.user[0].id} user={user} conversation={conversation}/>
        ))
      }
    </main>
  );
};

export default InboxPage;
