import ReservationSideBar from "@/app/components/properties/ReservationSideBar";
import { getAuthCookies } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Add type interfaces
interface Host {
  id: string;
  name: string;
  avatar_url?: string;
}

interface PropertyData {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  price_per_night: number;
  host: Host;
}

interface PropertyResponse {
  data: PropertyData;
}

// Fix: Update params type for Next.js 15
interface PageParams {
  params: Promise<{ id: string }>;
}

const PropertyDetailPage = async ({ params }: PageParams) => {
  // Fix: Await params since it's now a Promise in Next.js 15
  const { id } = await params;

  // Validate property ID
  if (!id || typeof id !== "string" || id.trim() === "") {
    console.error("Invalid property ID provided:", id);
    notFound();
  }

  try {
    const property: PropertyResponse = await apiService.get<PropertyResponse>(
      `api/properties/${id}`
    );

    // Validate property data
    if (!property?.data || !property.data.id) {
      console.warn("Property not found or invalid property data:", property);
      notFound();
    }

    console.log("Property Detail Page ", property);

    const user = await getAuthCookies();

    return (
      <main className="pb-6 max-w-[1500px] mx-auto px-6">
        <div className="mb-4 w-full h-[64vh] overflow-hidden rounded-xl relative">
          {" "}
          <Image
            fill
            src={property.data.image_url}
            alt={`${property.data.title} - Property Image`}
            className="object-cover w-full h-full"
            priority
            sizes="(max-width: 768px) 100vw, 1500px"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="py-6 pr-6 col-span-3">
            <h1 className="mb-4 text-4xl break-words">{property.data.title}</h1>
            <span className="mb-6 block text-sm text-gray-600">
              {property.data.guests} guests • {property.data.bedrooms} bedrooms
              • {property.data.bathrooms} bathrooms
            </span>

            <hr className="my-4" />

            {/* Add error handling for host data */}
            {property.data.host ? (
              <Link
                href={`/host/${property.data.host.id}`}
                className="py-6 flex items-center space-x-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="relative w-[50px] h-[50px]">
                  {" "}
                  <Image
                    src={property.data.host.avatar_url || "/user.avif"}
                    alt={`${property.data.host.name} Avatar`}
                    fill
                    className="rounded-full object-cover"
                    sizes="50px"
                  />
                </div>

                <p>
                  <strong>{property.data.host.name || "Host"}</strong> is your
                  host
                </p>
              </Link>
            ) : (
              <div className="py-6">
                <p className="text-gray-500">Host information not available</p>
              </div>
            )}

            <hr className="my-4" />

            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">About this place</h2>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {property.data.description ||
                  "No description available for this property."}
              </p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <ReservationSideBar user={user} property={property.data} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    // Handle API errors gracefully
    console.error("Error fetching property details:", {
      propertyId: id,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle different types of errors
    if (error instanceof Error) {
      if (
        error.message.includes("404") ||
        error.message.includes("Not Found")
      ) {
        notFound();
      }
      console.error("API Error:", error.message);
    }

    notFound();
  }
};

export default PropertyDetailPage;
