import { Link, useNavigate } from "react-router-dom";
import { CiMail, CiUser } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";
import { isStrongPassword } from "../utils/isStrongPassword";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && token) {
            navigate("/");
        }
    }, [user, token, navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const initialValue = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const [formData, setFormData] = useState(initialValue);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordView = () => setShowPassword(!showPassword);
    const handleConfirmPasswordView = () =>
        setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirmPassword)
            newErrors.confirmPassword = "Confirm Password is required";
        else if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (formData.password && !isStrongPassword(formData.password)) {
            newErrors.password = "Password does not meet the strength requirements";
        }

        setErrors(newErrors);

        const errorMessages = Object.values(newErrors);
        if (errorMessages.length > 0) {
            toast.error(errorMessages[0]);
        }

        if (Object.keys(newErrors).length === 0) {
            dispatch(registerUser(formData))
                .then((result) => {
                    if (result.type === "auth/registerUser/fulfilled") {
                        setFormData(initialValue);
                        navigate("/login");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen font-sans">


            {/* Form Section */}
            <div className="flex-1 flex flex-col items-center justify-center py-8 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md space-y-6 bg-white rounded-lg p-8"
                >
                    <p className="text-center text-2xl font-semibold text-gray-700">
                        Register
                    </p>

                    {/* Name Input */}
                    <div className="flex items-center border rounded-lg p-2">
                    <CiUser className="font-bold mx-1" fontSize="1.5rem" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="flex-1 outline-none"
                        />
                    </div>


                    {/* Email Input */}
                    <div className="flex items-center border rounded-lg p-2">
                    <CiMail className="font-bold mx-1" fontSize="1.5rem" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="flex-1 outline-none"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex items-center border rounded-lg p-2">
                        <CiLock className="font-bold mx-1" fontSize="1.5rem" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="flex-1 outline-none"
                        />

                        <span
                            className=" cursor-pointer"
                            onClick={handlePasswordView}
                        >
                            {
                                showPassword ? <FiEyeOff onClick={handlePasswordView}
                                className="font-bold mx-1 cursor-pointer" fontSize="1.3rem" /> : <FiEye onClick={handlePasswordView}
                                    className="font-bold mx-1 cursor-pointer" fontSize="1.3rem" />
                            }
                        </span>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="flex items-center border rounded-lg p-2">
                        <CiLock className="font-bold mx-1" fontSize="1.5rem" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="flex-1 outline-none"
                        />

                        {
                            showConfirmPassword ? <FiEyeOff onClick={handleConfirmPasswordView}
                            className="font-bold mx-1 cursor-pointer" fontSize="1.3rem" /> : <FiEye onClick={handleConfirmPasswordView}
                            className="font-bold mx-1 cursor-pointer" fontSize="1.3rem" />
                        }
                    </div>

                    {/* Buttons */}
                    <div className="space-y-4 text-center">
                        <button className="w-full py-2 rounded-full bg-teal-500 text-white text-lg font-semibold shadow hover:bg-teal-600">
                            Register
                        </button>
                        <p className="text-md mt-6 text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-teal-500 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

