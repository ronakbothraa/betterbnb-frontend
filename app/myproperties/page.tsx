import PropertyList from "../components/properties/PropertyList";
import { getAuthCookies } from "../lib/actions";

const MyProperties = async () => {
  const user = await getAuthCookies();

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6">
      <h1 className="my-6 text-2xl">My Properties</h1>{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <PropertyList host_id={user} disableGrid={true} />
      </div>
    </main>
  );
};

export default MyProperties;
