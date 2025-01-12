// import React from 'react';

// // Dummy Data for demonstration
// const activeSubscriptions = [
//   { id: 1, name: 'Crop Analytics', description: 'Advanced crop health and growth insights.', price: '$20/month' },
//   { id: 2, name: 'Weather Updates', description: 'Get real-time weather alerts.', price: '$10/month' },
//   { id: 3, name: 'Fertilizer Stock Management', description: 'Track and manage your fertilizer inventory.', price: '$15/month' },
//   { id: 4, name: 'Irrigation Scheduling', description: 'Automated and optimized irrigation schedules.', price: '$25/month' },
// ];

// const availableSubscriptions = [
//   { id: 5, name: 'Market Price Insights', description: 'Track real-time market prices for your crops.', price: '$15/month' },
//   { id: 6, name: 'Expert Consultation', description: 'Monthly sessions with agronomy experts.', price: '$25/month' },
//   { id: 7, name: 'Premium Field Analytics', description: 'Detailed cost and ROI analysis for fields.', price: '$30/month' },
//   { id: 8, name: 'Pest Control Alerts', description: 'Real-time pest control measures and alerts.', price: '$12/month' },
//   { id: 9, name: 'Seed Selection Guidance', description: 'Get recommendations for best seeds based on soil and climate.', price: '$18/month' },
//   { id: 10, name: 'Soil Testing Reports', description: 'Detailed soil health reports and recommendations.', price: '$22/month' },
//   { id: 11, name: 'Crop Yield Prediction', description: 'AI-driven insights into expected crop yields.', price: '$28/month' },
//   { id: 12, name: 'Equipment Maintenance Reminders', description: 'Timely reminders for maintaining farm equipment.', price: '$10/month' },
// ];

// export default function Subscriptions() {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

//       {/* Active Subscriptions */}
//       <section>
//         <h2 className="text-xl font-semibold mb-3">My Subscriptions</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {activeSubscriptions.map((sub) => (
//             <div
//               key={sub.id}
//               className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition-shadow"
//             >
//               <h3 className="text-lg font-bold">{sub.name}</h3>
//               <p className="text-gray-600 my-2">{sub.description}</p>
//               <p className="text-blue-500 font-semibold">{sub.price}</p>
//               <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//                 Manage
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Available Subscriptions */}
//       <section className="mt-8">
//         <h2 className="text-xl font-semibold mb-3">Available Subscriptions</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {availableSubscriptions.map((service) => (
//             <div
//               key={service.id}
//               className="border bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
//             >
//               <h3 className="text-lg font-bold">{service.name}</h3>
//               <p className="text-gray-600 my-2">{service.description}</p>
//               <p className="text-blue-500 font-semibold">{service.price}</p>
//               <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
//                 Subscribe
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }



import React from 'react';
import { FaLeaf, FaCloudSun, FaBox, FaWater, FaChartLine, FaUserTie, FaSeedling, FaBell, FaFlask, FaTractor } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const activeSubscriptions = [
  { id: 1, name: 'Crop Analytics', description: 'Advanced crop health and growth insights.', price: '$20/month', icon: <FaLeaf /> },
  { id: 2, name: 'Weather Updates', description: 'Get real-time weather alerts.', price: '$10/month', icon: <FaCloudSun /> },
  { id: 3, name: 'Fertilizer Stock Management', description: 'Track and manage your fertilizer inventory.', price: '$15/month', icon: <FaBox /> },
  { id: 4, name: 'Irrigation Scheduling', description: 'Automated and optimized irrigation schedules.', price: '$25/month', icon: <FaWater /> },
];

const availableSubscriptions = [
  { id: 5, name: 'Market Price Insights', description: 'Track real-time market prices for your crops.', price: '$15/month', icon: <FaChartLine /> },
  { id: 6, name: 'Expert Consultation', description: 'Monthly sessions with agronomy experts.', price: '$25/month', icon: <FaUserTie /> },
  { id: 7, name: 'Premium Field Analytics', description: 'Detailed cost and ROI analysis for fields.', price: '$30/month', icon: <FaSeedling /> },
  { id: 8, name: 'Pest Control Alerts', description: 'Real-time pest control measures and alerts.', price: '$12/month', icon: <FaBell /> },
  { id: 9, name: 'Seed Selection Guidance', description: 'Recommendations for best seeds based on soil and climate.', price: '$18/month', icon: <FaFlask /> },
  { id: 10, name: 'Soil Testing Reports', description: 'Detailed soil health reports and recommendations.', price: '$22/month', icon: <FaFlask /> },
  { id: 11, name: 'Crop Yield Prediction', description: 'AI-driven insights into expected crop yields.', price: '$28/month', icon: <FaChartLine /> },
  { id: 12, name: 'Equipment Maintenance Reminders', description: 'Timely reminders for maintaining farm equipment.', price: '$10/month', icon: <FaTractor /> },
];

export default function Subscriptions() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Subscriptions</h1>

      {/* Active Subscriptions */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Subscriptions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="border border-gray-300 rounded-lg shadow p-6 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="text-4xl text-blue-500 mb-3">{sub.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{sub.name}</h3>
              <p className="text-gray-600 my-2">{sub.description}</p>
              <p className="text-blue-600 font-semibold">{sub.price}</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Manage
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Available Subscriptions */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Available Subscriptions</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop={true} // Enable looping
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="pb-6"
        >
          {availableSubscriptions.map((service) => (
            <SwiperSlide key={service.id}>
              <div className="border border-gray-300 rounded-lg shadow p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="text-4xl text-green-500 mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                <p className="text-gray-600 my-2">{service?.description.length > 40 ? service?.description.slice(0,40)+"...":service?.description}</p>
                <p className="text-green-600 font-semibold">{service.price}</p>
                <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Subscribe
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
