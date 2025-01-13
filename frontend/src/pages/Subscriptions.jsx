import { useEffect, useState } from "react";
import { FaLeaf, FaCloudSun, FaBox, FaWater, FaChartLine, FaUserTie, FaSeedling, FaBell, FaFlask, FaTractor } from 'react-icons/fa';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  handleSubscriptionPayment,
  fetchSubscriptions as fetchSubscriptionsAPI,
} from '../services/operations/subscriptionApi'


const iconMapping = {
  FaLeaf: <FaLeaf />,
  FaCloudSun: <FaCloudSun />,
  FaBox: <FaBox />,
  FaWater: <FaWater />,
  FaChartLine: <FaChartLine />,
  FaUserTie: <FaUserTie />,
  FaSeedling: <FaSeedling />,
  FaBell: <FaBell />,
  FaFlask: <FaFlask />,
  FaTractor: <FaTractor />,
};


export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState({
    userSubscriptions: [],
    availableSubscriptions: [],
  });

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (!token) {
          throw new Error("No authentication token found");
        }

        const data = await fetchSubscriptionsAPI(token);
        if (data) setSubscriptions(data);
        console.log('real data',data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        toast.error("Could not load subscriptions.");
      }
    };

    fetchSubscriptions();
  }, [token]);


  const handleSubscribe = async (subscription) => {
    if (!token) {
      toast.error("You need to log in to subscribe.");
      return;
    }

    const amount = subscription.price * 100; 
    try {
      await handleSubscriptionPayment(token, amount, subscription._id, user, () => {
        toast.success("Subscription successful!");
        // Re-fetch subscriptions after successful payment
        const fetchSubscriptions = async () => {
          const data = await fetchSubscriptionsAPI(token);
          if (data) setSubscriptions(data);
        };
        fetchSubscriptions();
      });
    } catch (error) {
      console.error("Subscription payment failed:", error);
      toast.error("Subscription payment failed.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Subscriptions</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Subscriptions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.userSubscriptions.map((sub) => (
            <div
              key={sub._id}
              className="border border-gray-300 rounded-lg shadow p-6 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="text-4xl text-blue-500 mb-3">
                {iconMapping[sub.icon] || <FaLeaf />}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{sub.name}</h3>
              <p className="text-gray-600 my-2">{sub.description}</p>
              <p className="text-blue-600 font-semibold">${sub.price}/month</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Available Subscriptions</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="pb-6"
        >
          {subscriptions.availableSubscriptions.map((service) => (
            <SwiperSlide key={service._id}>
              <div className="border border-gray-300 rounded-lg shadow p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="text-4xl text-green-500 mb-3">
                  {iconMapping[service.icon] || <FaLeaf />}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                <p className="text-gray-600 my-2">
                  {service.description.length > 40
                    ? `${service.description.slice(0, 40)}...`
                    : service.description}
                </p>
                <p className="text-green-600 font-semibold">${service.price}/month</p>
                {!subscriptions.userSubscriptions.some((sub) => sub._id === service._id) && (
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleSubscribe(service)}
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
