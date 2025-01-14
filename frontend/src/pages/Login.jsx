import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice';
import { isStrongPassword } from '../utils/isStrongPassword';
import { CiMail } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { CiLock } from "react-icons/ci";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && token) {
            navigate('/');
        }
    }, [user, token, navigate]);

    const initialValue = {
        email: "",
        password: "",
    };
    const [formData, setFormData] = useState(initialValue);

    const handleChange = (e) => {
        setFormData((prev) => {
            const { value, name } = e.target;
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handlePasswordView = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!isStrongPassword(formData.password)) {
            return;
        }

        const firstError = Object.values(newErrors)[0];
        if (firstError) {
            toast.error(firstError);
        }
        if (Object.keys(newErrors).length === 0) {
            dispatch(login(formData))
                .then((result) => {
                    if (result.type === 'auth/login/fulfilled') {
                        setFormData(initialValue);
                        navigate('/');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <div className="relative w-full h-screen font-sans">
            <div className="absolute top-4 left-4">
                <div className="flex items-center justify-center w-full md:text-3xl font-bold text-2xl">
                    <img src="/images/logo.png" className="w-10" alt="Logo" />
                    <span className="text-gray-700 px-2">Fieldly</span>
                </div>
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center py-8 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md space-y-6 bg-white rounded-lg md:p-8">
                    <p className="text-2xl font-semibold text-gray-800 text-center">Login</p>

                    <div className="flex items-center border rounded-lg p-2">
                        <CiMail className="font-bold mx-1" fontSize="1.3rem" />
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
                        <CiLock className="font-bold mx-1" fontSize="1.3rem" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="flex-1 outline-none"
                        />

                        {
                            showPassword ? <FiEyeOff onClick={handlePasswordView}
                                className="font-bold mx-1 cursor-pointer" fontSize="1.3rem" /> : <FiEye onClick={handlePasswordView}
                                    className="font-bold mx-1 cursor-pointer" fontSize="1.3rem" />
                        }
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            type="submit"
                            className="w-full py-3 rounded-full bg-teal-600 text-white font-medium hover:bg-teal-700 transition">
                            Log in
                        </button>
                        <p className="text-gray-600 text-md">
                            Have an account?{" "}
                            <Link to="/register" className="text-teal-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
