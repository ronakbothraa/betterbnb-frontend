"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapsProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  defaultLocation: { lat: number; lng: number; address: string } | null;
  height?: string;
  width?: string;
}

const Maps: React.FC<MapsProps> = ({
  onLocationSelect,
  defaultLocation,
  height = "300px",
  width = "100%",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      // Check if API key exists
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      const loader = new Loader({
        apiKey: apiKey ? apiKey : "",
        version: "weekly",
        libraries: ["places"], // We're using: Maps JavaScript API, Places API, Geocoding API
      });

      try {
        // Load Google Maps core library first
        const google = await loader.load();

        if (mapRef.current) {
          // Initialize map using google.maps.Map
          const map = new google.maps.Map(mapRef.current, {
            center: {
              lat: defaultLocation?.lat || 28.704059,
              lng: defaultLocation?.lng || 77.10249,
            },
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            scaleControl: true,
          });

          mapInstanceRef.current = map;
          console.log("Map instance created");

          // Initialize marker using google.maps.Marker
          const marker = new google.maps.Marker({
            position: defaultLocation,
            map: map,
            draggable: true,
            title: "Selected Location",
          });

          markerRef.current = marker;
          console.log("Marker created");

          // Add click listener to map
          map.addListener("click", (event: google.maps.MapMouseEvent) => {
            const lat = event.latLng?.lat();
            const lng = event.latLng?.lng();

            if (lat && lng) {
              marker.setPosition({ lat, lng });
              console.log("Map clicked at:", lat, lng);

              // Reverse geocoding using Geocoding API
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode(
                { location: { lat, lng } },
                (
                  results: google.maps.GeocoderResult[] | null,
                  status: google.maps.GeocoderStatus
                ) => {
                  if (
                    status === google.maps.GeocoderStatus.OK &&
                    results &&
                    results[0]
                  ) {
                    const address = results[0].formatted_address;
                    setSearchValue(address);
                    onLocationSelect({ lat, lng, address });
                    console.log("Geocoded address:", address);
                  } else {
                    console.error("Geocoding failed:", status);
                  }
                }
              );
            }
          });

          // Add drag listener to marker
          marker.addListener("dragend", () => {
            const position = marker.getPosition();
            if (position) {
              const lat = position.lat();
              const lng = position.lng();
              console.log("Marker dragged to:", lat, lng);

              // Reverse geocoding using Geocoding API
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode(
                { location: { lat, lng } },
                (
                  results: google.maps.GeocoderResult[] | null,
                  status: google.maps.GeocoderStatus
                ) => {
                  if (
                    status === google.maps.GeocoderStatus.OK &&
                    results &&
                    results[0]
                  ) {
                    const address = results[0].formatted_address;
                    setSearchValue(address);
                    onLocationSelect({ lat, lng, address });
                    console.log("Geocoded address from drag:", address);
                  } else {
                    console.error("Geocoding failed on drag:", status);
                  }
                }
              );
            }
          });

          setIsLoaded(true);
          console.log("Map initialization complete");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setError(`Failed to load Google Maps: ${error}`);
      }
    };

    initializeMap();
  }, [defaultLocation, onLocationSelect]);

  useEffect(() => {
    if (isLoaded && mapInstanceRef.current && window.google) {
      // Initialize autocomplete using Places API
      const searchInput = document.getElementById(
        "maps-search-input"
      ) as HTMLInputElement;

      if (searchInput && !autocompleteRef.current) {
        console.log("Setting up Places Autocomplete");

        const autocomplete = new window.google.maps.places.Autocomplete(
          searchInput,
          {
            types: ["geocode"], // Restrict to geographical locations
            fields: ["geometry", "formatted_address", "name"], // Specify which data to return
          }
        );

        autocompleteRef.current = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          console.log("Place selected from autocomplete:", place);

          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || place.name || "";

            // Update map and marker
            mapInstanceRef.current?.setCenter({ lat, lng });
            mapInstanceRef.current?.setZoom(15);
            markerRef.current?.setPosition({ lat, lng });

            setSearchValue(address);
            onLocationSelect({ lat, lng, address });
            console.log("Updated location from autocomplete:", {
              lat,
              lng,
              address,
            });
          } else {
            console.warn("No geometry found for selected place");
          }
        });
      }
    }
  }, [isLoaded, onLocationSelect]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mb-4">
        <input
          id="maps-search-input"
          type="text"
          placeholder="Search for a location..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ height, width }}
        className={`${
          !isLoaded && "hidden"
        } rounded-lg border border-gray-300 shadow-sm`}
      />

      {/* Loading State */}
      {!isLoaded && !error && (
        <div
          style={{ height, width }}
          className="rounded-lg border border-gray-300 shadow-sm flex items-center justify-center bg-gray-50"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-gray-500">Loading Maps...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maps;
