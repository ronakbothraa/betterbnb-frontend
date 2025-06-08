import Image from "next/image";
import apiService from "../services/apiService";
import { differenceInDays } from "date-fns";
import Link from "next/link";

// Add interfaces for type safety
interface Property {
  id: string;
  title: string;
  image_url: string;
}

interface Reservation {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  property: Property;
}

const ReservationPage = async () => {

  const reservations: Reservation[] = await apiService.get("api/auth/reservations");
  console.log(reservations);
  
  return (
    <div className="max-w-[1500px] mx-auto px-6 pb-6"> {/* Fixed: max-auto -> mx-auto */}
      <div className="my-6">
        <h1 className="text-2xl">My Reservations</h1> {/* Fixed: reservation -> Reservations */}
      </div>
      
      {reservations && reservations.length > 0 ? (
        reservations.map((reservation: Reservation) => (
          <div key={reservation.id} className="mb-4">
            <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md rounded-xl border border-gray-300">
              <div className="col-span-1">
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <Image
                    fill
                    alt={`${reservation.property.title} property image`}
                    src={reservation.property.image_url}
                    className="hover:scale-110 object-cover transition h-full w-full"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <div className="space-y-2">
                  <h2 className="mb-4 text-xl">{reservation.property.title}</h2>
                  <p>
                    <strong>Check-in date: </strong>
                    {new Date(reservation.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Check-out date: </strong>
                    {new Date(reservation.end_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Number of nights: </strong>
                    {differenceInDays(
                      new Date(reservation.end_date),
                      new Date(reservation.start_date)
                    )}{" "}
                    nights
                  </p>
                  <hr />
                  <p>
                    <strong>Total Price: </strong>
                    ₹{reservation.total_price.toLocaleString()}
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
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No reservations found.</p>
          <Link 
            href="/" 
            className="mt-4 inline-block py-2 px-4 bg-airbnb hover:bg-airbnb-dark transition rounded-lg text-white"
          >
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;