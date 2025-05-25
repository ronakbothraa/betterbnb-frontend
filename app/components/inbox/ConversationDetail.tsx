import { SendHorizontal } from "lucide-react";

const ConversationDetail = () => {
  return (
    <div className="max-h-[400px] overflow-auto flex flex-col space-y-4">
      <div className="w-[80%] py-4 px-6 rounded-xl bg-gray-200">
        <p className="font-bold text-gray-500">John Doe</p>

        <p>something that is not important, just some shit.</p>
      </div>

      <div className="w-[80%] ml-[20%] py-4 px-6 rounded-xl bg-gray-200">
        <p className="font-bold text-gray-500">You</p>

        <p>something that is also not important at all.</p>
      </div>

      <div className="mt-4 py-4 px-6 flex border border-gray-300 space-x-4 rounded-xl">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-3 bg-gray-200 rounded-xl"
        />
        <button className="p-3 bg-airbnb cursor-pointer text-white rounded-lg">
            <SendHorizontal />
        </button>
      </div>
    </div>
  );
};

export default ConversationDetail;
