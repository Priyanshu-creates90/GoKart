import React, { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import AuthShell from '../components/AuthShell';

const Login = () => {

    const [data, setData] = useState({
        email: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isValid = Object.values(data).every(item => item)

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })

            if (response.data.error) toast.error(response.data.message)

            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshtoken', response.data.data.refreshtoken)

                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))

                setData({
                    email: "",
                    password: "",
                })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <AuthShell
            eyebrow="Welcome back"
            title="Log in to GoKart"
            subtitle="Your cart and saved addresses are right where you left them."
            footer={<>New here? <Link to="/register" className="link">Create an account</Link></>}
        >
            <form className="grid gap-4" onSubmit={handleSubmit}>

                <div className="grid gap-1.5">
                    <label htmlFor="email" className="label">Email</label>
                    <input
                        id="email"
                        type="text"
                        className="input"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                    />
                </div>

                <div className="grid gap-1.5">
                    <div className="flex items-center justify-between gap-3">
                        <label htmlFor="password" className="label">Password</label>
                        <Link to={"/forgot-password"} className="text-xs font-medium text-brand hover:underline">Forgot password?</Link>
                    </div>
                    <div className="input-shell">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="input-bare"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="text-fg-faint transition-colors hover:text-brand"
                        >
                            {showPassword ? <HiOutlineEye size={18} /> : <HiOutlineEyeSlash size={18} />}
                        </button>
                    </div>
                </div>

                <button disabled={!isValid} className="btn-primary btn-block btn-lg mt-2">Log in</button>
            </form>
        </AuthShell>
    )
}

export default Login
