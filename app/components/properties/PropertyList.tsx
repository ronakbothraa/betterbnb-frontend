"use client";

import { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";

export type PropertyType = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price_per_night: number;
};

interface PropertyListProps {
  host_id?: string | null;
}
 
const PropertyList: React.FC<PropertyListProps> = ({ host_id }) => {
  const [properties, setProperties] = useState<PropertyType[]>([]);

  const getProperties = async () => {

    let url = "api/properties/";

    if (host_id) {
      url += `?host_id=${host_id}`;
    }

    const allproperties = await apiService.get(url);
    setProperties(allproperties.data);
  };

  useEffect(() => {
    getProperties();
  }, []);

  return (
    <>
      {properties.map((property) => (
        <PropertyListItem key={property.id} property={property} />
      ))}
    </>
  );
};

export default PropertyList;
