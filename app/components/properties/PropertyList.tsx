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

const PropertyList = () => {
  const [properties, setProperties] = useState<PropertyType[]>([]);

  const getProperties = async () => {
    const url = "api/properties/";
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
