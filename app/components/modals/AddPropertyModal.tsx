"use client";

import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import Modal from "./modal";
import { useState } from "react";
import AddPropertyCategories from "../addproperty/AddPropertyCategories";
import Maps from "../maps/Maps";
import Image from "next/image";
import apiService from "@/app/services/apiService";
import { useRouter } from "next/navigation";

// Add interface for API response
interface CreatePropertyResponse {
  success?: boolean;
  data?: {
    id?: string;
    message?: string;
  };
  error?: string;
  message?: string;
}

const AddPropertyModal = () => {
  const router = useRouter();
  const addPropertyModal = useAddPropertyModal();

  const [currentStep, setCurrentStep] = useState(1);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

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
      const file = e.target.files[0];
      
      // Validate file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image file size should be less than 10MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      
      setDataImage(file);
      setError(""); // Clear any previous errors
    } else {
      setDataImage(null);
    }
  };

  // Validation function
  const validateForm = (): string | null => {
    if (!category) return "Please select a category";
    if (!dataTitle.trim()) return "Please enter a title";
    if (!dataDescription.trim()) return "Please enter a description";
    if (!dataPrice || parseFloat(dataPrice) <= 0) return "Please enter a valid price";
    if (!dataBedrooms || parseInt(dataBedrooms) <= 0) return "Please enter number of bedrooms";
    if (!dataBathrooms || parseInt(dataBathrooms) <= 0) return "Please enter number of bathrooms";
    if (!dataGuests || parseInt(dataGuests) <= 0) return "Please enter number of guests";
    if (!dataLocation) return "Please select a location";
    if (!dataImage) return "Please select an image";
    
    return null;
  };

  const resetForm = () => {
    setCategory("");
    setDataTitle("");
    setDataDescription("");
    setDataPrice("");
    setDataBedrooms("");
    setDataBathrooms("");
    setDataGuests("");
    setDataLocation(null);
    setDataImage(null);
    setCurrentStep(1);
    setError("");
    setIsLoading(false);
  };

  const submitForm = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("title", dataTitle.trim());
      formData.append("description", dataDescription.trim());
      formData.append("price_per_night", dataPrice);
      formData.append("bedrooms", dataBedrooms);
      formData.append("bathrooms", dataBathrooms);
      formData.append("guests", dataGuests);
      formData.append("country", dataLocation!.address);
      formData.append("latitude", dataLocation!.lat.toFixed(6)); // More precision
      formData.append("longitude", dataLocation!.lng.toFixed(6)); // More precision
      formData.append("country_code", "IN");
      formData.append("image", dataImage!);

      const response: CreatePropertyResponse = await apiService.post<CreatePropertyResponse>(
        "api/properties/create/",
        formData
      );

      if (response.success) {
        resetForm();
        addPropertyModal.closeModal();
        router.refresh();
      } else {
        console.error("Failed to create property:", response.data);
        setError(response.error || response.message || "Failed to create property. Please try again.");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      setError("An error occurred while creating the property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validation for next button
  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 1: return !!category;
      case 2: return !!dataTitle.trim() && !!dataDescription.trim();
      case 3: return !!dataPrice && !!dataBedrooms && !!dataBathrooms && !!dataGuests;
      case 4: return !!dataLocation;
      case 5: return !!dataImage;
      default: return false;
    }
  };

  const content = (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

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
          <h2 className="mb-4 text-2xl">Add Basic Details</h2>
          <div className="pt-3 pb-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="font-medium">Title *</label>
              <input
                id="title"
                type="text"
                value={dataTitle}
                onChange={(e) => setDataTitle(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent"
                placeholder="Enter property title"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="description" className="font-medium">Description *</label>
              <textarea
                id="description"
                value={dataDescription}
                onChange={(e) => setDataDescription(e.target.value)}
                className="w-full h-[200px] p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent resize-none"
                placeholder="Describe your property"
                required
              />
            </div>
          </div>
        </>
      ) : currentStep === 3 ? (
        <>
          <h2 className="mb-4 text-2xl">Property Details</h2>
          <div className="pt-3 pb-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="price" className="font-medium">Price Per Night (₹) *</label>
              <input
                id="price"
                type="number"
                min="1"
                value={dataPrice}
                onChange={(e) => setDataPrice(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent"
                placeholder="Enter price per night"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="bedrooms" className="font-medium">Bedrooms *</label>
              <input
                id="bedrooms"
                type="number"
                min="1"
                value={dataBedrooms}
                onChange={(e) => setDataBedrooms(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent"
                placeholder="Number of bedrooms"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="bathrooms" className="font-medium">Bathrooms *</label>
              <input
                id="bathrooms"
                type="number"
                min="1"
                value={dataBathrooms}
                onChange={(e) => setDataBathrooms(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent"
                placeholder="Number of bathrooms"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="guests" className="font-medium">Maximum Guests *</label>
              <input
                id="guests"
                type="number"
                min="1"
                value={dataGuests}
                onChange={(e) => setDataGuests(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent"
                placeholder="Maximum number of guests"
                required
              />
            </div>
          </div>
        </>
      ) : currentStep === 4 ? (
        <>
          <h2 className="mb-4 text-2xl">Select Location</h2>
          <div className="pt-3 pb-6">
            <Maps
              onLocationSelect={setDataLocation}
              height="300px"
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
          <h2 className="mb-4 text-2xl">Upload Photo</h2>
          <div className="pt-3 pb-6 space-y-4">
            <div className="mb-2 py-4 px-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl text-center hover:bg-gray-50 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                onChange={setImage}
                className="w-full"
              />
              <p className="text-gray-600 text-sm mt-2">
                Max file size: 10MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            {dataImage && (
              <div className="w-[200px] h-[150px] relative mx-auto">
                <Image
                  src={URL.createObjectURL(dataImage)}
                  alt="Property preview"
                  fill
                  className="w-full h-full object-cover rounded-xl"
                  sizes="200px"
                />
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
          >
            Previous
          </button>
        )}
        
        <div className="ml-auto">
          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext() || isLoading}
              className="px-6 py-3 bg-airbnb text-white rounded-lg hover:bg-airbnb-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitForm}
              disabled={!canProceedToNext() || isLoading}
              className="px-6 py-3 bg-airbnb text-white rounded-lg hover:bg-airbnb-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Property"}
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <Modal
      content={content}
      label="Add Property"
      isOpen={addPropertyModal.isOpen}
      close={addPropertyModal.closeModal}
    />
  );
};

export default AddPropertyModal;