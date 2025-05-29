import { propertyCategories } from "../PropertyCategories";
import Image from "next/image";

interface CategoriesProps {
  category: string | null;
  setCategory: (category: string) => void;
}

const AddPropertyCategories: React.FC<CategoriesProps> = ({
  category,
  setCategory,
}) => {
  return (
    <>
      <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-12">
        {propertyCategories.map((PropertyCategory) => (
          <div
          onClick={() => setCategory(PropertyCategory.name)}
            key={PropertyCategory.id}
            className={`${category == PropertyCategory.name ? "opacity-100 border-gray-400 transition" : "opacity-60 border-white hover:border-gray-200"} pb-1 flex flex-col items-center space-y-2 border-b-2 hover:opacity-100`}
          >
            <Image
              src={PropertyCategory.image}
              alt={PropertyCategory.alt}
              width={35}
              height={30}
            />
            <span className="text-sm">{PropertyCategory.name}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default AddPropertyCategories;
