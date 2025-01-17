import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Header from "../components/Header";
import { isTokenExpired, logout } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../slices/authSlice";
import { LuLandPlot } from "react-icons/lu";
import { MdOutlinePayments, MdOutlineSpaceDashboard } from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    } else if (isTokenExpired(token)) {
      const sessionExpired = async () => {
        dispatch(logout());
        toast.error("Session Expired");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      };
      sessionExpired();
    }
  }, [token, user, navigate, dispatch]);

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      // toast.success("User logged out successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error during logout");
    }
  };

  // Define navigation links based on user role
  const adminNavLinks = [
    { title: "Dashboard", to: "/admin", icon: MdOutlineSpaceDashboard }
  ];

  const userNav = [
    { title: "Fields", to: "/", icon: LuLandPlot },
    { title: "My Subscriptions", to: "/subscriptions", icon: MdOutlinePayments },
    { title: "Analytics", to: "/analytics", icon: IoAnalyticsSharp },
  ];

  const navLinks = user?.role === "Admin" ? adminNavLinks : userNav;

  const getActiveIndex = () => {
    const currentPath = location.pathname;
    const activeLink = navLinks.findIndex((link) => link.to === currentPath);
    return activeLink !== -1 ? activeLink : 0;
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="flex h-screen overflow-hidden p-2 bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 md:rounded-xl bg-white shadow-lg w-56 transform z-10 ${isSidebarOpen ? "block" : "hidden"
          } transition-transform duration-300 md:relative lg:block`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div className="w-full flex items-center justify-center md:px-2 px-2 py-2">
          <div className="flex items-center justify-center w-full md:text-3xl font-bold text-2xl">
            <img src="/images/logo.png" className="w-10" alt="Logo" />
            <span className="text-gray-700 px-2">Fieldly</span>
          </div>
        </div>

        <nav className="mt-10 px-3 w-full text-sm">
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium ${activeIndex === index
                  ? "bg-gray-100 font-bold border border-gray-400 border-2"
                  : "hover:bg-gray-100 hover:font-bold"
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-10 left-5">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 md:ps-2 transition-opacity duration-300 ${isSidebarOpen ? "opacity-50" : "opacity-100"
          } overflow-y-auto hideScroll`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <Outlet />
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center p-6 min-w-[250px]">
            <p className="text-lg font-semibold">Are you sure?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-80"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:opacity-80"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
