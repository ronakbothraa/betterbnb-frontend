import Image from "next/image";
import apiService from "../services/apiService";
import { difference } from "next/dist/build/utils";
import { differenceInDays } from "date-fns";
import Link from "next/link";

const ReservationPage = async () => {
  const reservations = await apiService.get("/api/auth/reservations");
  console.log(reservations);
  return (
    <div className="max-w-[1500px] max-auto px-6 pb-6">
      <div className="my-6">
        <h1 className="text-2xl">My reservation</h1>
      </div>
      {reservations.map((reservation: any) => (
        <div key={reservation.id}>
          <div className="space-y-4">
            <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md rounded-xl border border-gray-300">
              <div className="col-span-1 ">
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <Image
                    fill
                    alt="Property Image"
                    src={`${reservation.property.image_url}`}
                    className="hover:scale-110 object-cover transition h-full w-full"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <div className="space-y-2">
                  <h2 className="mb-4 text-xl">{reservation.property.title}</h2>
                  <p>
                    <strong>Check-in date: </strong>
                    {reservation.start_date}
                  </p>
                  <p>
                    <strong>Check-out date: </strong>
                    {reservation.end_date}
                  </p>

                  <p>
                    <strong>number of nights: </strong>
                    {differenceInDays(
                      reservation.start_date,
                      reservation.end_date
                    )}{" "}
                    nights
                  </p>
                  <hr />
                  <p>
                    <strong>Total Price: </strong>
                    {reservation.total_price}
                  </p>
                </div>

                <Link
                  href={`/property/${reservation.property.id}`}
                  className="mt-6 inline-block cursor-pointer py-3 px-5 bg-airbnb hover:bg-airbnb-dark transition rounded-xl text-white"
                >
                  Go to Property
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationPage;
