import ReservationSideBar from "@/app/components/properties/ReservationSideBar";
import Image from "next/image";

const PropertyDetailPage = () => {
  return (
    <main className="pb-6 max-w-[1500px] mx-auto px-6">
      <div className="mb-4 w-full h-[64vh] overflow-hidden rounded-xl relative">
        <Image
          fill
          src={"/properties/image (1).png"}
          alt="Property Image"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="py-6 pr-6 col-span-3">
          <h1 className="mb-4 text-4xl">Property Name</h1>
          <span className="mb-6 block text-sm text-gray-600">
            4 guests • 2 bedrooms • 2 beds • 1 bath
          </span>

          <hr />

          <div className="py-6 flex items-center space-x-4">
            <Image
              src="/user.avif"
              alt="User Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />

            <p>
              <strong>Daddy</strong> is your host
            </p>
          </div>

          <hr />

          <p className="mt-6 text-lg ">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas,
            atque nam voluptatum 
          </p>

        </div>

        <ReservationSideBar />
      </div>
    </main>
  );
};

export default PropertyDetailPage;
