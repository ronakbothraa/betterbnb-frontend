import Image from "next/image";

const ReservationPage = () => {
  return (
    <div className="max-w-[1500px] max-auto px-6 pb-6">
      <div className="my-6">
        <h1 className="text-2xl">My reservation</h1>
      </div>

      <div className="space-y-4">
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md rounded-xl border border-gray-300">
          <div className="col-span-1 ">
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <Image
                fill
                alt="Property Image"
                src={"/properties/image (1).png"}
                className="hover:scale-110 object-cover transition h-full w-full"
              />
            </div>
          </div>
          <div className="col-span-3">
            <div className="space-y-2">
              <h2 className="mb-4 text-xl">Property Name</h2>
              <p>
                <strong>Check-in date: </strong>25/05/2025
              </p>
              <p>
                <strong>Check-out date: </strong>29/05/2025
              </p>

              <p>
                <strong>number of nights: </strong>4
              </p>
              <hr />
              <p>
                <strong>Total Price: </strong>$200
              </p>
            </div>

            <div className="mt-6 inline-block cursor-pointer py-3 px-5 bg-airbnb hover:bg-airbnb-dark transition rounded-xl text-white">
              Go to Property
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md rounded-xl border border-gray-400">
          <div className="col-span-1 ">
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <Image
                fill
                alt="Property Image"
                src={"/properties/image (1).png"}
                className="hover:scale-110 object-cover transition h-full w-full"
              />
            </div>
          </div>
          <div className="col-span-3">
            <div className="space-y-2">
              <h2 className="mb-4 text-xl">Property Name</h2>
              <p>
                <strong>Check-in date:</strong> 25/05/2025
              </p>
              <p>
                <strong>Check-out date:</strong> 29/05/2025
              </p>

              <p>
                <strong>number of nights:</strong> 4
              </p>
              <hr />
              <p>
                <strong>Total Price:</strong> $200
              </p>
            </div>

            <div className="mt-6 inline-block cursor-pointer py-3 px-5 bg-airbnb hover:bg-airbnb-dark transition rounded-xl text-white">
              Go to Property
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
