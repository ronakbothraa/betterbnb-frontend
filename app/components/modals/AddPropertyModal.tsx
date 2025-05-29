"use client";

import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import Modal from "./modal";
import { useState } from "react";
import AddPropertyCategories from "../addproperty/AddPropertyCategories";
import Maps from "../maps/Maps";
import Image from "next/image";
import { X } from "lucide-react";
import apiService from "@/app/services/apiService";

const AddPropertyModal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [category, setCategory] = useState("");

  const [dataTitle, setDataTitle] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [dataPrice, setDataPrice] = useState("");
  const [dataBedrooms, setDataBedrooms] = useState("");
  const [dataBathrooms, setDataBathrooms] = useState("");
  const [dataGuests, setDataGuests] = useState("");
  const [dataLocation, setDataLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [dataImage, setDataImage] = useState<File | null>(null);

  const setImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDataImage(e.target.files[0]);
    } else {
      setDataImage(null);
    }
  };

  const submitForm = async () => {
    if (
      category &&
      dataTitle &&
      dataDescription &&
      dataPrice &&
      dataLocation &&
      dataImage
    ) {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("title", dataTitle);
      formData.append("description", dataDescription);
      formData.append("price_per_night", dataPrice);
      formData.append("bedrooms", dataBedrooms);
      formData.append("bathrooms", dataBathrooms);
      formData.append("guests", dataGuests);
      formData.append("country", dataLocation.address);
      formData.append("latitude", dataLocation.lat.toFixed(2));
      formData.append("longitude", dataLocation.lng.toFixed(2));
      formData.append("country_code", "IN");
      formData.append("image", dataImage);

      const response = await apiService.post(
        "api/properties/create/",
        formData
      );
    }
  };

  const addPropertyModal = useAddPropertyModal();

  const content = (
    <>
      {currentStep === 1 ? (
        <>
          <h2 className="mb-4 text-2xl">Choose Category</h2>
          <AddPropertyCategories
            category={category}
            setCategory={setCategory}
          />
        </>
      ) : currentStep === 2 ? (
        <>
          <h2 className="mb-4 text-2xl">Add Details</h2>

          <div className="pt-3 pb-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="">Title</label>
              <input
                type="text"
                value={dataTitle}
                onChange={(e) => setDataTitle(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-xl"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="">Description</label>
              <textarea
                value={dataDescription}
                onChange={(e) => setDataDescription(e.target.value)}
                className="w-full h-[200px] p-4 border border-gray-600 rounded-xl"
              ></textarea>
            </div>
          </div>
        </>
      ) : currentStep == 3 ? (
        <div>
          <h2 className="mb-4 text-2xl">Add Details</h2>
          <div className="pt-3 pb-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="">Price Per Night</label>
              <input
                type="number"
                value={dataPrice}
                onChange={(e) => setDataPrice(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-xl"
              />
            </div>{" "}
            <div className="flex flex-col space-y-2">
              <label htmlFor="">Bedrooms</label>
              <input
                type="number"
                value={dataBedrooms}
                onChange={(e) => setDataBedrooms(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-xl"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="">Bathrooms</label>
              <input
                type="number"
                value={dataBathrooms}
                onChange={(e) => setDataBathrooms(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-xl"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="">Guests</label>
              <input
                type="number"
                value={dataGuests}
                onChange={(e) => setDataGuests(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-xl"
              />
            </div>
          </div>
        </div>
      ) : currentStep == 4 ? (
        <>
          <h2 className="mb-4 text-2xl">Select Location</h2>
          <div className="pt-3 pb-6">
            <Maps
              onLocationSelect={setDataLocation}
              height="200px"
              defaultLocation={dataLocation}
            />
            {dataLocation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Selected Location:
                </h3>
                <p className="text-blue-800">
                  <strong>Address:</strong> {dataLocation.address}
                </p>
                <p className="text-blue-700 text-sm">
                  <strong>Coordinates:</strong> {dataLocation.lat.toFixed(6)},{" "}
                  {dataLocation.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-2xl">Choose Photos</h2>
          <div className="pt-3 pb-6 space--y-4">
            <div className="mb-2 py-4 px-6 bg-gray-600 text-white rounded-xl">
              <input type="file" accept="image/*" onChange={setImage} />
            </div>

            {dataImage && (
              <div className="w-[200px] h-[150px] relative">
                <Image
                  src={URL.createObjectURL(dataImage)}
                  alt="Property Image"
                  fill
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </>
      )}
      {currentStep > 1 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="inline-block px-10 mr-2 p-3 bg-gray-800 cursor-pointer text-white rounded-lg"
        >
          Prev
        </button>
      )}
      {currentStep < 5 ? (
        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          className="inline-block px-10 p-3 bg-airbnb cursor-pointer text-white rounded-lg"
        >
          Next
        </button>
      ) : (
        <button
          onClick={submitForm}
          className="inline-block px-10 p-3 bg-airbnb cursor-pointer text-white rounded-lg"
          disabled={!category} // Disable if no category selected
        >
          Submit
        </button>
      )}
    </>
  );

  return (
    <>
      <Modal
        content={content}
        label="Add Property"
        isOpen={addPropertyModal.isOpen}
        close={addPropertyModal.closeModal}
      />
    </>
  );
};

export default AddPropertyModal;
