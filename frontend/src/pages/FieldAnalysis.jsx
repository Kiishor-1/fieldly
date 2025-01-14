
import React, { useEffect, useReducer, useState } from "react";
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
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { fetchFieldById } from "../slices/fieldSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './FieldAnalysis.css'
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { generateAnalysis } from "../services/operations/analyticsApi";
import { FIELD_ENDPOINTS } from "../services/api";
import { apiConnector } from "../services/apiConnector";

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY;
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FieldAnalysis() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMonitoringData, setNewMonitoringData] = useState({ date: "", status: "", growth: "" });
    const [newHarvestData, setNewHarvestData] = useState({ month: "", yield: 0, cost: 0 });
    const [loading, setLoading] = useState(false);
    const [generatedText, setGeneratedText] = useState("");
    const [triggerAnimation, setTriggerAnimation] = useState(false);
    const mapContainerRef = useReducer(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { field } = useSelector((state) => state.field);
    const { token } = useSelector((state) => state.auth);

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



    const fetchAIResponse = async (token) => {
        setLoading(true);
        setTriggerAnimation(false);
        try {
            const generatedText = await generateAnalysis(id, token);

            setGeneratedText(generatedText);
            setTriggerAnimation(true);

            // Show success toast
            // toast.success("AI analysis generated successfully!");
        } catch (error) {
            console.error("Error fetching AI-generated text:", error);

            setGeneratedText("Failed to fetch AI-generated data.");
            setTriggerAnimation(true);

            toast.error("Failed to generate AI analysis.");
        } finally {
            setLoading(false);
        }
    };


    const handleAddData = async () => {
        setLoading(true);
        try {
            const response = await apiConnector(
                "POST",
                FIELD_ENDPOINTS.ADD_FIELD_DATA(id),
                {
                    monitoringData: newMonitoringData,
                    harvestData: newHarvestData,
                },
                {
                    Authorization: `Bearer ${token}`,
                }
            );
            console.log(response?.data);
            dispatch(fetchFieldById(id));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding data:", error);
        } finally {
            setLoading(false);
        }
    };


    const harvestData = {
        labels: field?.harvestData?.map((data) => data.month) || [],
        datasets: [
            {
                label: "Harvest Yield (tons)",
                data: field?.harvestData?.map((data) => data.yield) || [],
                backgroundColor: "#4caf50",
            },
        ],
    };
    return (
        <div className="text-md flex md:flex-row flex-col items-cente w-full relative">
            <div className="flex-1 flex flex-col p-4">
                <h2 className="md:text-2xl text-md font-bold text-gray-600 flex items-center gap-2">
                    Field Report <span className="text-sm text-gray-500 uppercase">for</span> {field?.name}
                </h2>

                <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-2 mt-8">
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-600">Area Size: {field?.areaSize || "N/A"} acres</p>
                        <p className="text-gray-600 mt-2">
                            <span>Crop Types</span>
                            <ul className="flex items-center gap-3 flex-wrap p-4">
                                {
                                    field?.cropType.map((crop, id) => (
                                        <li className="bg-green-100 font-semibold text-slate-600 rounded-full px-3 py-1" key={id}>{crop}</li>
                                    ))
                                }
                            </ul>
                        </p>
                    </div>


                    <div className="flex-1 bg-white p-4 rounded-lg lg:row-span-2">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Harvest</h3>
                        <div className="w-full h-64">
                            <Bar className="w-full border" data={harvestData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="border rounded-lg bg-white p-4 h-[fit-content]">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg p-4  gap-2 flex items-center text-sm">
                                <h4 className="text-lg font-medium rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center"> <RiMoneyRupeeCircleFill /></h4>
                                <p className="text-gray-700">${field?.analytics?.totalCost || 0}</p>
                            </div>
                            <div className="bg- p-4 gap-2  flex items-center text-sm">
                                <h4 className="text-lg font-medium rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center"> <AiOutlineStock /></h4>
                                <p className="text-gray-700">{field?.analytics?.totalStock || 0}%</p>
                            </div>
                            <div className="bg-y p-4 gap-2 flex items-center text-sm">
                                <h4 className="text-lg font-medium rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center"><GiStumpRegrowth /></h4>
                                <p className="text-gray-700">{field?.analytics?.averageGrowth || 0}%</p>
                            </div>
                            <div className="b p-4 gap-2 flex items-center text-sm">
                                <h4 className="text-lg font-medium rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center"><FaArrowTrendUp /></h4>
                                <p className="text-gray-700">{field?.analytics?.marketTrends || 0}</p>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="mt-8">
                    <h3 className="text-xl font-semibold flex items-center justify-between text-gray-700 mb-2">
                        <span>
                            Monitoring
                        </span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md"
                        >
                            Add Data
                        </button>
                    </h3>
                    <DataTable
                        value={field?.monitoringData || []}
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

                <div className="mt-6">
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => fetchAIResponse(token)}
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

            <div className="md:w-[25%] w-full md:h-[88vh] my-2 md:sticky md:top-0 border rounded-lg shadow-md relative">
                <div className="flex flex-col p-4 justify-center text-gray-100 absolute top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-60 rounded-lg">
                    <FaRegMap fontSize="2rem" />
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


            {
                isModalOpen && (
                    <Modal
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        center
                        className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 relative"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Data</h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Monitoring Data</h3>
                            <div className="space-y-4">
                                <input
                                    type="date"
                                    placeholder="Date"
                                    value={newMonitoringData.date}
                                    onChange={(e) =>
                                        setNewMonitoringData({ ...newMonitoringData, date: e.target.value })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                                <select
                                    value={newMonitoringData.status}
                                    onChange={(e) =>
                                        setNewMonitoringData({ ...newMonitoringData, status: e.target.value })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    <option value="" disabled>
                                        Select Status
                                    </option>
                                    <option value="Critical">Critical</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Healthy">Healthy</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Growth"
                                    value={newMonitoringData.growth}
                                    onChange={(e) =>
                                        setNewMonitoringData({ ...newMonitoringData, growth: e.target.value })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Harvest Data</h3>
                            <div className="space-y-4">
                                <select
                                    value={newHarvestData.month}
                                    onChange={(e) =>
                                        setNewHarvestData({ ...newHarvestData, month: e.target.value })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    <option value="" disabled>
                                        Select Month
                                    </option>
                                    {[
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                        "August",
                                        "September",
                                        "October",
                                        "November",
                                        "December",
                                    ].map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Yield"
                                    value={newHarvestData.yield}
                                    onChange={(e) =>
                                        setNewHarvestData({ ...newHarvestData, yield: Number(e.target.value) })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                                <input
                                    type="number"
                                    placeholder="Cost"
                                    value={newHarvestData.cost}
                                    onChange={(e) =>
                                        setNewHarvestData({ ...newHarvestData, cost: Number(e.target.value) })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddData}
                            className={`mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg transition-all duration-300 hover:bg-green-700 disabled:bg-gray-400`}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </Modal>
                )
            }
        </div>
    );
}

