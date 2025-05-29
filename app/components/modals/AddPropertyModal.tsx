"use client";

import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import Modal from "./modal";
import { useState } from "react";
import AddPropertyCategories from "../addproperty/AddPropertyCategories";
import Maps from "../maps/Maps";

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

  const addPropertyModal = useAddPropertyModal();

  const content = (
    <>
      {currentStep === 1 ? (
        <>
          <h2 className="mb-6 text-2xl">Choose Category</h2>
          <AddPropertyCategories
            category={category}
            setCategory={setCategory}
          />
        </>
      ) : currentStep === 2 ? (
        <>
          <h2 className="mb-6 text-2xl">Add Details</h2>

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
          <h2 className="mb-6 text-2xl">Add Details</h2>
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
          <h2 className="mb-6 text-2xl">Select Location</h2>
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
        <div></div>
      )}
      {currentStep > 1 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="inline-block px-10 mr-2 p-3 bg-gray-800 cursor-pointer text-white rounded-lg"
          disabled={!category} // Disable if no category selected
        >
          Prev
        </button>
      )}
      <button
        onClick={() => setCurrentStep(currentStep + 1)}
        className="inline-block px-10 p-3 bg-airbnb cursor-pointer text-white rounded-lg"
        disabled={!category} // Disable if no category selected
      >
        Next
      </button>
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
