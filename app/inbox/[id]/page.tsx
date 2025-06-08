import ConversationDetail from "@/app/components/inbox/ConversationDetail";
import { getAccessToken, getAuthCookies } from "@/app/lib/actions";
import { ConversationType, UserType } from "../page";
import apiService from "@/app/services/apiService";

export type MessageType = {
  id: string;
  name: string;
  conversationId: string;
  sender: UserType;
  receiver: UserType;
  body: string;
};

interface PageParams {
  params: Promise<{ id: string }>;
}

const ConversationPage = async ({ params }: PageParams) => {
  const { id } = await params;

  const user = await getAuthCookies();
  const token = await getAccessToken();

  if (!user || !token) {
    return (
      <main className="max-w-[1500px] mx-auto px-6 pb-6">
        <div className="text-center mt-20">
          <h1 className="text-2xl">
            Please{" "}
            <strong className="cursor-pointer text-airbnb hover:text-airbnb-dark">
              log in
            </strong>{" "}
            to view your conversations
          </h1>
        </div>
      </main>
    );
  }

  const conversation : {conversation: ConversationType, messages: MessageType[]} = await apiService.get(
    `api/chat/${id}`
  );

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6">
      <ConversationDetail
        token={token}
        user={user}
        conversation={conversation.conversation}
        messages={conversation.messages}
      />
    </main>
  );
};

export default ConversationPage;
