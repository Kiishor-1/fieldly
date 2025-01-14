import { Link, useNavigate } from "react-router-dom";
import { CiMail, CiUser } from "react-icons/ci";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";
import { isStrongPassword } from "../utils/isStrongPassword";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && token) {
            navigate("/");
        }
    }, [user, token, navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const initialValue = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    };
    const [formData, setFormData] = useState(initialValue);
    const [errors, setErrors] = useState({});


    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const { name, email, password, confirmPassword, role } = formData;
        setIsDisabled(!name || !email || !password);
    }, [formData]);

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setFormData((prev) => ({
            ...prev,
            role: role,
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
        if (!formData.role) newErrors.role = "Role is required";

        if (formData.password && !isStrongPassword(formData.password)) {
            newErrors.password = "Password does not meet the strength requirements";
        }

        setErrors(newErrors);

        const errorMessages = Object.values(newErrors);
        if (errorMessages.length > 0) {
            toast.error(errorMessages[0]);
        }
        console.log(formData)
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
        <div className="relative flex w-full h-screen font-sans">
            <div className="absolute top-4 left-4">
                <div className="flex items-center justify-center w-full md:text-3xl font-bold text-2xl">
                    <img src="/images/logo.png" className="w-10" alt="Logo" />
                    <span className="text-gray-700 px-2">Fieldly</span>
                </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center py-8 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md space-y-6 bg-white rounded-lg md:p-8"
                >
                    <p className="text-center text-2xl font-semibold text-gray-700">
                        Register
                    </p>

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
                            className="cursor-pointer"
                            onClick={handlePasswordView}
                        >
                            {showPassword ? (
                                <FiEyeOff
                                    className="font-bold mx-1 cursor-pointer"
                                    fontSize="1.3rem"
                                />
                            ) : (
                                <FiEye
                                    className="font-bold mx-1 cursor-pointer"
                                    fontSize="1.3rem"
                                />
                            )}
                        </span>
                    </div>

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
                        <span
                            className="cursor-pointer"
                            onClick={handleConfirmPasswordView}
                        >
                            {showConfirmPassword ? (
                                <FiEyeOff
                                    className="font-bold mx-1 cursor-pointer"
                                    fontSize="1.3rem"
                                />
                            ) : (
                                <FiEye
                                    className="font-bold mx-1 cursor-pointer"
                                    fontSize="1.3rem"
                                />
                            )}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-gray-600 font-medium">Select your role:</p>
                        <div className="flex justify-around gap-4">
                            {["User", "Admin"].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleSelect(role)}
                                    className={`w-full font-semibold py-2 px-4 rounded-lg ${selectedRole === role
                                        ? "bg-teal-500 shadow text-white"
                                        : "text-teal-300 border border-teal-300"
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                        )}
                    </div>

                    <div className="space-y-4 text-center">
                        <button
                            disabled={isLoading || isDisabled}
                            className={`w-full py-2 rounded-full bg-teal-500 text-white text-lg font-semibold shadow hover:bg-teal-600 ${isLoading || isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Register
                        </button>
                        <p className="text-md mt-6 text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-teal-500 hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
