import Image from "next/image";
import { propertyCategories } from "./PropertyCategories";

const HomeCategories = () => {
  return (
    <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-12">
      {propertyCategories.map((category) => (
        <div 
          key={category.id}
          className="pb-1 flex flex-col items-center space-y-2 border-b-2 border-white opacity-60 hover:border-gray-200 hover:opacity-100"
        >
          <Image 
            src={category.image} 
            alt={category.alt} 
            width={35} 
            height={30} 
          />
          <span className="text-sm">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default HomeCategories;
