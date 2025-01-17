import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import toast from "react-hot-toast";
import { FaMagnifyingGlass } from "react-icons/fa6";

mapboxgl.accessToken =import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY;

const MapInput = ({ onCoordinatesChange, initialCoordinates }) => {
  const mapContainerRef = useRef(null); 
  const markerRef = useRef(null); 
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 

  const isNightTimeInIndia = () => {
    const now = new Date();
    const hours = (now.getUTCHours() + 5.5) % 24; 
    return hours >= 19 || hours < 4;
  };


  useEffect(() => {
    const initializedMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: isNightTimeInIndia()
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/streets-v12",
      center: initialCoordinates ? initialCoordinates :[81.62254190962483, 21.239501981012054],
      zoom: 9,
      attributionControl: false, 
    });

    initializedMap.on("load", () => setMap(initializedMap)); 

    initializedMap.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      onCoordinatesChange([lng, lat]);

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(initializedMap);
    });

    return () => {
      initializedMap.remove();
    };
  }, [onCoordinatesChange, initialCoordinates]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}`
      );

      if (response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].center;

        map.flyTo({ center: [lng, lat], zoom: 11 });

        if (markerRef.current) {
          markerRef.current.remove();
        }
        markerRef.current = new mapboxgl.Marker({ offset: [0, -15] })
          .setLngLat([lng, lat])
          .addTo(map);

        onCoordinatesChange([lng, lat]);
      } else {
        console.error("No results found for the search query.");
        toast.error("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Error during geocoding search:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4 flex items-center border rounded">
        <input
          type="text"
          className="w-full outline-none rounded p-2"
          placeholder="Search location (e.g., New Delhi)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          type="button"
          className="bg-gray-100 px-4 py-3 rounded"
        >
          <FaMagnifyingGlass/>
        </button>
      </div>
      <div
        className="map-container rounded-lg flex-1 p-4 min-h-[250px]"
        ref={mapContainerRef}
      ></div>
    </div>
  );
};

export default MapInput;
