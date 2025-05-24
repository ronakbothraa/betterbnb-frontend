import Image from "next/image";

const Categories = () => {
  return (
    <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-12">
      <div className="pb-1 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100">
        <Image src="/categories/categories.webp" alt="beach" width={35} height={30} />
        <span className="text-sm">Beach</span>
      </div>
      <div className="pb-1 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100">
        <Image src="/categories/categories(2).webp" alt="beach" width={35} height={30} />
        <span className="text-sm">Village</span>
      </div>
      <div className="pb-1 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100">
        <Image src="/categories/categories(3).webp" alt="beach" width={35} height={30} />
        <span className="text-sm">Mountain</span>
      </div>
      <div className="pb-1 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100">
        <Image src="/categories/categories(4).webp" alt="beach" width={35} height={30} />
        <span className="text-sm">Rural</span>
      </div>
      <div className="pb-1 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100">
        <Image src="/categories/categories(5).webp" alt="beach" width={35} height={30} />
        <span className="text-sm">Urban</span>
      </div>
    </div>
  );
};

export default Categories;
