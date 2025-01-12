import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { TypeAnimation } from "react-type-animation";
import { FaRegMap } from "react-icons/fa";
import mapboxgl from "mapbox-gl";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AiOutlineStock } from "react-icons/ai";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GiStumpRegrowth } from "react-icons/gi";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css";
import { fetchFieldById } from "../slices/fieldSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './FieldAnalysis.css'

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY;
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FieldAnalysis() {
    const [loading, setLoading] = useState(false);
    const [generatedText, setGeneratedText] = useState("");
    const [triggerAnimation, setTriggerAnimation] = useState(false);
    const mapContainerRef = useReducer(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { field } = useSelector((state) => state.field);

    useEffect(() => {
        if (id) {
            dispatch(fetchFieldById(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (field?.location && mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: field.location,
                zoom: 14,
            });

            new mapboxgl.Marker().setLngLat(field.location).addTo(map);

            return () => map.remove();
        }
    }, [field?.location, mapContainerRef]);

    const fetchAIResponse = async () => {
        setLoading(true);
        setTriggerAnimation(false);
        try {
            const response = await axios.post("http://localhost:8080/api/v1/generate-analysis", {
                cost: "$1200",
                stock: "45%",
                growth: "7.2%",
                analytics: "positive market trends",
            });

            setGeneratedText(response.data.generatedText);
            setTriggerAnimation(true);
        } catch (error) {
            console.error("Error fetching AI-generated text:", error);
            setGeneratedText("Failed to fetch AI-generated data.");
            setTriggerAnimation(true);
        } finally {
            setLoading(false);
        }
    };

    const harvestData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Harvest Yield (tons)",
                data: [12, 19, 3, 5, 2, 3, 10, 15, 20, 8, 6, 10],
                backgroundColor: "#4caf50",
            },
        ],
    };

    const monitoringData = [
        { date: "2024-01-10", status: "Healthy", growth: "7.2%" },
        { date: "2024-01-11", status: "Moderate", growth: "5.8%" },
        { date: "2024-01-12", status: "Critical", growth: "3.4%" },
    ];

    return (
        <div className="text-md flex md:flex-row flex-col items-cente w-full relative">
            {/* Sidebar and Map */}
            <div className="flex-1 flex flex-col p-4">
                <div className="mt-4">
                    <h2 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
                        Field Report <span className="text-sm text-gray-500 uppercase">for</span> {field?.name}
                    </h2>
                    <p className="text-gray-600 mt-2">Crop Type: {field?.cropType || "N/A"}</p>
                    <p className="text-gray-600">Area Size: {field?.areaSize || "N/A"} acres</p>
                </div>

                <div className="flex gap-4">
                    {/* Summary Section */}
                    <div className="mt-8 border rounded-lg bg-white p-4 h-[fit-content]">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg p-4  gap-2 flex items-center text-sm">
                                <h4 className="text-lg font-medium rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center"> <RiMoneyRupeeCircleFill /></h4>
                                <p className="text-gray-700">$1200</p>
                            </div>
                            <div className="bg- p-4 gap-2  flex items-center text-sm">
                                <h4 className="text-lg font-medium rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center"> <AiOutlineStock /></h4>
                                <p className="text-gray-700">45%</p>
                            </div>
                            <div className="bg-y p-4 gap-2 flex items-center text-sm">
                                <h4 className="text-lg font-medium rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center"><GiStumpRegrowth /></h4>
                                <p className="text-gray-700">7.2%</p>
                            </div>
                            <div className="b p-4 gap-2 flex items-center text-sm">
                                <h4 className="text-lg font-medium rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center"><FaArrowTrendUp /></h4>
                                <p className="text-gray-700">Positive</p>
                            </div>
                        </div>
                    </div>

                    {/* Harvest Section */}
                    <div className="flex-1 mt-8 bg-white p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Harvest</h3>
                        <div className="w-full h-64">
                            <Bar data={harvestData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* Monitoring Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Monitoring</h3>
                    <DataTable
                        value={monitoringData}
                        paginator
                        rows={5}
                        className="custom-datatable"
                        stripedRows
                        responsiveLayout="scroll"
                    >
                        <Column field="date" header="Date" headerClassName="custom-header"></Column>
                        <Column field="status" header="Status" headerClassName="custom-header"></Column>
                        <Column field="growth" header="Growth" headerClassName="custom-header"></Column>
                    </DataTable>
                </div>

                {/* Generate Analysis Button */}
                <div className="mt-6">
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={fetchAIResponse}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Analysis"}
                    </button>

                    <div className="mt-6 text-sm text-gray-700 border border-2 border-gray-700 rounded-lg p-4 min-h-[300px]">
                        {triggerAnimation ? (
                            <TypeAnimation
                                sequence={[generatedText, 1000]}
                                wrapper="span"
                                cursor={false}
                                speed={50}
                                style={{ display: "inline-block" }}
                            />
                        ) : (
                            <p className="italic text-gray-500">Click the button to generate AI analysis.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="md:w-[25%] w-full h-[98vh] md:sticky md:top-0 border rounded-lg shadow-md">
                <div className="flex flex-col p-4 justify-center text-gray-100 absolute top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-60 rounded-lg">
                    <FaRegMap fontSize="1.3rem" />
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span className="h-[3px] w-8 bg-white"></span>
                        {field?.name}
                    </h2>
                    <section className="mt-2 ms-4">
                        <p>Position</p>
                        <span className="text-sm">{field?.location[0].toFixed(4) + " °N , " + field?.location[1].toFixed(4) + "°E"}</span>
                    </section>
                    <p className="mt-2 ms-4">
                        <p>Area Size</p>
                        <span className="text-sm">{field?.areaSize || "N/A"} acres</span>
                    </p>
                </div>
                <div className="overflow-hidden h-full w-full" ref={mapContainerRef}></div>
            </div>
        </div>
    );
}
















// import React, { useEffect, useReducer, useState } from "react";
// import axios from "axios";
// import { TypeAnimation } from "react-type-animation";
// import { HiArrowCircleLeft } from "react-icons/hi";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import mapboxgl from "mapbox-gl";
// import { fetchFieldById } from "../slices/fieldSlice";
// import { FaRegMap } from "react-icons/fa";

// mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY;

// export default function FieldAnalysis() {
//     const [loading, setLoading] = useState(false);
//     const [generatedText, setGeneratedText] = useState(""); // Store the AI response
//     const [triggerAnimation, setTriggerAnimation] = useState(false); // To control animation
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { id } = useParams();
//     const { field } = useSelector((state) => state.field);
//     const mapContainerRef = useReducer(null); // Reference for the map container

// useEffect(() => {
//     if (id) {
//         dispatch(fetchFieldById(id));
//     }
// }, [id, dispatch]);

//     useEffect(() => {
//         if (field?.location && mapContainerRef.current) {
//             const map = new mapboxgl.Map({
//                 container: mapContainerRef.current,
//                 style: "mapbox://styles/mapbox/streets-v11",
//                 center: field.location,
//                 zoom: 14,
//             });

//             new mapboxgl.Marker().setLngLat(field.location).addTo(map);

//             return () => map.remove(); // Cleanup map instance on component unmount
//         }
//     }, [field?.location]);

//     const fetchAIResponse = async () => {
//         setLoading(true);
//         setTriggerAnimation(false); // Reset the animation before new text is fetched
//         try {
//             const response = await axios.post("http://localhost:8080/api/v1/generate-analysis", {
//                 cost: "$1200",
//                 stock: "45%",
//                 growth: "7.2%",
//                 analytics: "positive market trends",
//             });

//             setGeneratedText(response.data.generatedText); // Update the text
//             setTriggerAnimation(true); // Start animating the new text
//         } catch (error) {
//             console.error("Error fetching AI-generated text:", error);
//             setGeneratedText("Failed to fetch AI-generated data.");
//             setTriggerAnimation(true);
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         <div className="text-md flex md:flex-row flex-col items-cente h-full w-full">
//             <div className="flex-1 flex flex-col">
//                 <div className="mt-4">
//                     <h2 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
//                     Field Report <span className="text-sm text-gray-500 uppercase">for</span> {field?.name}
//                     </h2>
//                     <p className="text-gray-600 mt-2">
//                         Crop Type: {field?.cropType || "N/A"}
//                     </p>
//                     <p className="text-gray-600">Area Size: {field?.areaSize || "N/A"} acres</p>
//                 </div>

//                 {/* Placeholder sections for analytics */}
//                 <div className="mt-8">
//                     <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                         Analytics Overview
//                     </h3>
//                     <p className="text-gray-500 italic">Analytics like growth, cost, stock of fertilizers, and crop health will be added here.</p>
//                 </div>

//                 <div className="mt-6">
//                     <button
//                         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         onClick={fetchAIResponse}
//                         disabled={loading}
//                     >
//                         {loading ? "Generating..." : "Generate Analysis"}
//                     </button>

//                     <div className="mt-6 text-sm text-gray-700">
//                         {triggerAnimation ? (
//                             <TypeAnimation
//                                 sequence={[generatedText + generatedText + generatedText, 1000]}
//                                 wrapper="span"
//                                 cursor={false}
//                                 speed={generatedText.length * 3 > 1000 ? 90 : generatedText.length * 3 > 600 ? 80 : 60} // Adjust typing speed
//                                 style={{ display: "inline-block" }}
//                             />
//                         ) : (
//                             <p className="italic text-gray-500">
//                                 Click the button to generate AI analysis.
//                             </p>
//                         )}
//                     </div>
//                 </div>

//             </div>
//             <div className="md:w-[25%] w-full h-full relative border rounded-lg shadow-md">
//                 <div className="flex flex-col p-4 justify-center text-gray-100 absolute top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-60 rounded-lg">
//                     <FaRegMap fontSize="1.3rem" />
//                     <h2 className="text-2xl font-semibold flex items-center gap-2">
//                         <span className="h-[3px] w-8 bg-white"></span>
//                         {field?.name}
//                     </h2>
//                     <section className="mt-2 ms-4">
//                         <p>Position</p>
//                         <span className="text-sm">{field?.location[0].toFixed(4)+" °N , "+field?.location[1].toFixed(4)+"°E"}</span>
//                     </section>
//                     <p className="mt-2 ms-4">
//                         <p>Area Size</p>
//                         <span className="text-sm">{field?.areaSize || "N/A"} acres</span>
//                     </p>
//                 </div>
//                 <div className=" overflow-hidden h-full w-full" ref={mapContainerRef}></div>
//             </div>
//         </div>
//     );
// }