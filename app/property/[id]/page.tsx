import ReservationSideBar from "@/app/components/properties/ReservationSideBar";
import { getAuthCookies } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";
import Image from "next/image";
import Link from "next/link";

const PropertyDetailPage = async ({ params }: { params: { id: string } }) => {
  const property = await apiService.get("api/properties/" + params.id);

  console.log("Property Detail Page ", property);

  const user = await getAuthCookies();

  return (
    <main className="pb-6 max-w-[1500px] mx-auto px-6">
      <div className="mb-4 w-full h-[64vh] overflow-hidden rounded-xl relative">
        <Image
          fill
          src={property.data.image_url}
          alt="Property Image"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="py-6 pr-6 col-span-3">
          <h1 className="mb-4 text-4xl">{property.data.title}</h1>
          <span className="mb-6 block text-sm text-gray-600">
            {property.data.guests} guests • {property.data.bedrooms} bedrooms •{" "}
            {property.data.bathrooms} bathrooms
          </span>

          <hr />

          <Link href={`/host/${property.data.host.id}`} className="py-6 flex items-center space-x-4">
            <Image
              src={property.data.host.avatar_url || "/user.avif"}
              alt="User Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />

            <p>
              <strong>{property.data.host.name}</strong> is your host
            </p>
          </Link>

          <hr />

          <p className="mt-6 text-lg ">
            {property.data.description ||
              "No description available for this property."}
          </p>
        </div>

        <ReservationSideBar user={user} property={property.data} />
      </div>
    </main>
  );
};

export default PropertyDetailPage;
