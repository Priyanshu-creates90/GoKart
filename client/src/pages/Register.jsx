import React, { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

const Register = () => {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

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

        if (data.password !== data.confirmPassword) {
            toast.error("Password and Confirm Password are not same")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            })

            if (response.data.error) toast.error(response.data.message)

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <AuthShell
            eyebrow="Get started"
            title="Create your account"
            subtitle="One account for orders, addresses and reorders."
            footer={<>Already have an account? <Link to="/login" className="link">Log in</Link></>}
        >
            <form className="grid gap-4" onSubmit={handleSubmit}>

                <div className="grid gap-1.5">
                    <label htmlFor="name" className="label">Name</label>
                    <input
                        id="name"
                        type="text"
                        autoFocus
                        className="input"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                    />
                </div>

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
                    <label htmlFor="password" className="label">Password</label>
                    <div className="input-shell">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="input-bare"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            placeholder="Create a password"
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

                <div className="grid gap-1.5">
                    <label htmlFor="confirmPassword" className="label">Confirm password</label>
                    <div className="input-shell">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="input-bare"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            className="text-fg-faint transition-colors hover:text-brand"
                        >
                            {showConfirmPassword ? <HiOutlineEye size={18} /> : <HiOutlineEyeSlash size={18} />}
                        </button>
                    </div>
                </div>

                <button disabled={!isValid} className="btn-primary btn-block btn-lg mt-2">Create account</button>
            </form>
        </AuthShell>
    )
}

export default Register
