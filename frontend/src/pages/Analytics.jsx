import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const data = {
    labels: ["Good Health", "Moderate", "Poor"],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Field Analytics</h2>
      <div className="max-w-md mx-auto">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default Analytics;
