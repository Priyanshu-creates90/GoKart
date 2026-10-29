import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

const ForgotPassword = () => {

    const [data, setData] = useState({
        email: ""
    })

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

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })

            if (response.data.error) toast.error(response.data.message)

            if (response.data.success) {
                toast.success(response.data.message)

                navigate("/verify-forgot-password-otp", {
                    state: data
                })

                setData({
                    email: "",
                    password: "",
                })

            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <AuthShell
            eyebrow="Password reset"
            title="Forgot your password?"
            subtitle="Enter your email and we'll send a one-time code."
            footer={<>Remembered it? <Link to="/login" className="link">Back to login</Link></>}
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

                <button disabled={!isValid} className="btn-primary btn-block btn-lg mt-2">Send code</button>
            </form>
        </AuthShell>
    )
}

export default ForgotPassword
