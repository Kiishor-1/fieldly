import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import { fetchAnalyticsData } from "../services/operations/analyticsApi";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Analytics = () => {
  const [data, setData] = useState(null);
  const { token} = useSelector((state)=>state.auth);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAnalyticsData(token);
      if (data) setData(data);
    };

    fetchData();
  }, []);


  if (!data) {
    return <div className="w-full h-[calc(100vh-143px)] flex items-center justify-center">
      <div className="spinner"></div>
    </div>;
  }

  const { totalFields, cropTypesCount, areaSizeData } = data;
  const cropTypesCountKeys = cropTypesCount ? Object.keys(cropTypesCount) : [];
  const cropTypesCountValues = cropTypesCount ? Object.values(cropTypesCount) : [];

  const areaSizeDataKeys = areaSizeData ? Object.keys(areaSizeData) : [];
  const areaSizeDataValues = areaSizeData ? Object.values(areaSizeData) : [];

  const cropTypeData = {
    labels: cropTypesCountKeys,
    datasets: [
      {
        data: cropTypesCountValues,
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0", "#FF9F40"],
      },
    ],
  };

  const areaSizeDataForBar = {
    labels: areaSizeDataKeys,
    datasets: [
      {
        label: "Area Size (hectares)",
        data: areaSizeDataValues,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="p-4 hideScroll">
      <h2 className="text-2xl font-bold mb-4">Field Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-8 bg-white shadow rounded flex flex-col justify-center items-center h-68">
          <h3 className="text-lg font-semibold mb-2">Total Registered Fields</h3>
          <Pie className="w-full h-full" data={cropTypeData} />
        </div>

        <div className="p-8 bg-white shadow rounded flex flex-col justify-center items-center h-68">
          <h3 className="text-lg font-semibold mb-2">Crop Type Distribution</h3>
          <Pie className="w-full h-full" data={cropTypeData} />
        </div>

        <div className="p-8 bg-white shadow rounded flex flex-col justify-center items-center h-68">
          <h3 className="text-lg font-semibold mb-2">Area Size Distribution</h3>
          <Bar className="w-full h-full" data={areaSizeDataForBar} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
