import HostContact from "@/app/components/HostContact";
import PropertyList from "@/app/components/properties/PropertyList";
import { getAuthCookies } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";
import Image from "next/image";
import { notFound } from "next/navigation";

// Add type interfaces with more robust typing
interface Host {
  id: string;
  email: string;
  avatar_url?: string;
  name?: string;
  created_at?: string;
}

// Fix: Update PageParams to match Next.js 15 structure
interface PageParams {
  params: Promise<{ id: string }>;
}

const HostDetailPage = async ({ params }: PageParams) => {
  const { id } = await params;

  // Validate params.id early
  if (!id || typeof id !== "string" || id.trim() === "") {
    console.error("Invalid host ID provided:", id);
    notFound();
  }

  try {
    // Use the generic type parameter for better type safety
    const host: Host = await apiService.get<Host>(`api/auth/${id}`);

    // More robust host validation
    if (!host || !host.id || !host.email) {
      console.warn("Host not found or invalid host data:", host);
      notFound();
    }

    console.log("Host Detail Page", host);
    const user = await getAuthCookies();

    return (
      <main className="max-w-[1500px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <aside className="col-span-1 mb-4">
            <div className="flex flex-col items-center rounded-xl p-6 border border-gray-300 shadow-xl">
              {/* Add error handling for image loading */}
              <div className="relative w-[200px] h-[200px] mb-4">
                {" "}
                <Image
                  src={host.avatar_url || "/user.avif"}
                  alt={`${host.name || host.email} avatar`}
                  fill
                  className="rounded-full object-cover"
                  priority
                  sizes="200px"
                />
              </div>

              {/* Display name if available, fallback to email */}
              <h1 className="mt-6 text-2xl text-center break-words max-w-full">
                {host.name || host.email}
              </h1>

              {/* Show email separately if name exists */}
              {host.name && (
                <p className="text-gray-600 text-sm mt-2 break-words max-w-full">
                  {host.email}
                </p>
              )}

              {/* More robust user comparison with proper type checking */}
              {user && typeof user === "string" && user !== id && (
                <HostContact
                  host_id={host.id} 
                />
              )}
            </div>
          </aside>

          <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">
                Properties by {host.name || host.email}
              </h2>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PropertyList host_id={id} disableGrid={true} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    // More detailed error logging for production debugging
    console.error("Error fetching host details:", {
      hostId: id,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle different types of errors
    if (error instanceof Error) {
      // Network or API errors
      if (
        error.message.includes("404") ||
        error.message.includes("Not Found")
      ) {
        notFound();
      }
      // Log other errors but still show not found to user
      console.error("API Error:", error.message);
    }

    notFound();
  }
};

export default HostDetailPage;
