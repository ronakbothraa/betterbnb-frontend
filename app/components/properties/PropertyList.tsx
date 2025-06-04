"use client";

import { useEffect, useState, useCallback } from "react";
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";

export type PropertyType = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price_per_night: number;
};

// Add interface for API response
interface PropertiesResponse {
  data: PropertyType[];
}

interface PropertyListProps {
  host_id?: string | null;
  disableGrid?: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({
  host_id,
  disableGrid = false,
}) => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Use useCallback to memoize the function and fix dependency issue
  const getProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let url = "api/properties/";

      if (host_id) {
        url += `?host_id=${host_id}`;
      }

      // Fix: Use proper typing for the response
      const allproperties: PropertiesResponse =
        await apiService.get<PropertiesResponse>(url);

      // Validate response structure
      if (allproperties && Array.isArray(allproperties.data)) {
        setProperties(allproperties.data);
      } else {
        console.warn("Invalid properties response structure:", allproperties);
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to load properties. Please try again.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [host_id]); // Add host_id as dependency

  // Fix: Add dependency array to prevent infinite re-renders
  useEffect(() => {
    getProperties();
  }, [getProperties]);
  // Handle loading state
  if (loading) {
    return (
      <div
        className={
          disableGrid
            ? "contents"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
        {/* Loading skeleton */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="col-span-full text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={getProperties}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (properties.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <div className="text-gray-500">
          <p className="text-lg mb-2">
            {host_id
              ? "This host has no properties listed."
              : "No properties found."}
          </p>
          <p className="text-sm">
            {!host_id &&
              "Try adjusting your search criteria or check back later."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={
        disableGrid
          ? "contents"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }
    >
      {properties.map((property) => (
        <PropertyListItem key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;
