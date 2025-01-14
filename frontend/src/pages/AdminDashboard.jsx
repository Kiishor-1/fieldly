import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { Bar, Pie, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { toast } from "react-hot-toast";
import { FaChartBar, FaSeedling, FaMapMarkedAlt, FaLandmark } from "react-icons/fa";

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY;

const AdminDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    const fetchAnalytics = async () => {
        try {
            const { data } = await apiConnector(
                "GET",
                "/analytics/admin-analytics",
                null,
                { Authorization: `Bearer ${token}` }
            );
            setAnalyticsData(data);
            const locationCoords = data.fields.map((field) => field.location);
            setLocations(locationCoords);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response.data?.message || 'Failed to fetch analytics data');
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    useEffect(() => {
        if (locations.length > 0) {
            const map = new mapboxgl.Map({
                container: "map", // Container ID
                style: "mapbox://styles/mapbox/streets-v11", // Map style
                center: [0, 0], // Default center [longitude, latitude]
                zoom: 2,
            });

            locations.forEach((loc, index) => {
                const popup = new mapboxgl.Popup({ offset: 25 }).setText(
                    `Field ${index + 1}: [${loc[1]}, ${loc[0]}]`
                );

                new mapboxgl.Marker()
                    .setLngLat(loc)
                    .setPopup(popup)
                    .addTo(map);
            });
        }
    }, [locations]);

    if (loading) {
        return <div className="h-[calc(100vh-250px)] w-full flex items-center justify-center">
            <div className="spinner"></div>
        </div>;
    }

    const totalLand = analyticsData.totalLand;
    const cropTypes = analyticsData.cropTypes;
    const totalCrops = cropTypes.reduce((acc, crop) => acc + crop.count, 0);
    const chartData = {
        labels: cropTypes.map((crop) => crop.type),
        datasets: [
            {
                label: "Crop Distribution",
                data: cropTypes.map((crop) => crop.count),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
        ],
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-500 text-white p-4 rounded-lg shadow flex items-center">
                    <FaLandmark className="text-4xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold">Total Land</h2>
                        <p className="text-xl font-bold">{totalLand} acres</p>
                    </div>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg shadow flex items-center">
                    <FaSeedling className="text-4xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold">Total Crops</h2>
                        <p className="text-xl font-bold">{totalCrops}</p>
                    </div>
                </div>
                <div className="bg-yellow-500 text-white p-4 rounded-lg shadow flex items-center">
                    <FaChartBar className="text-4xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold">Market Trends</h2>
                        <p className="text-xl font-bold">{analyticsData.marketTrends}</p>
                    </div>
                </div>
                <div className="bg-red-500 text-white p-4 rounded-lg shadow flex items-center">
                    <FaMapMarkedAlt className="text-4xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold">Locations</h2>
                        <p className="text-xl font-bold">{locations.length}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow mb-6 ">
                <h2 className="text-lg font-bold mb-4">Crop Distribution</h2>
                <Pie className="max-h-[60vh]" data={chartData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-lg font-bold mb-4">Total Yield Over Time</h2>
                <Line
                    data={{
                        labels: analyticsData.yieldData.map((data) => data.month),
                        datasets: [
                            {
                                label: "Total Yield",
                                data: analyticsData.yieldData.map((data) => data.yield),
                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                borderColor: "rgba(75, 192, 192, 1)",
                                borderWidth: 1,
                            },
                        ],
                    }}
                />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4">Field Locations</h2>
                <div id="map" className="w-full h-64 rounded-lg"></div>
            </div>
        </div>
    );
};

export default AdminDashboard;
