import PropertyList from "@/app/components/properties/PropertyList";
import Image from "next/image";

const HostDetailPage = () => {
  return (
    <main className="max-w-[1500px] max-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <aside className="col-span-1 mb-4">
          <div className="flex flex-col items-center rounded-xl p-6 border border-gray-300 shadow-xl">
            <Image
              src="/user.avif"
              alt="Host Avatar"
              width={200}
              height={200}
              className="rounded-full mb-4"
            />

            <h1 className="mt-6 text-2xl">Host Name</h1>

            <div className="cursor-pointer mt-6 py-3 px-6 bg-airbnb text-white rounded-xl hover:bg-airbnb-dark transition ">
              contact
            </div>
          </div>
        </aside>

        <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <PropertyList />
          </div>
        </div>
      </div>
    </main>
  );
};

export default HostDetailPage;
