import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AuthShell from '../components/AuthShell';

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })
    const isValid = Object.values(data).every(item => item)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (!(location?.state?.data?.success)) navigate("/")
        if (location?.state?.email) {
            setData((prev) => {
                return {
                    ...prev,
                    email: location?.state?.email
                }
            })
        }
    }, [])


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
                ...SummaryApi.reset_password,
                data: data
            })

            if (response.data.error) toast.error(response.data.message)

            if (response.data.success) {
                toast.success(response.data.message)

                navigate("/login")

                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })

            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <AuthShell
            eyebrow="Almost done"
            title="Set a new password"
            subtitle="Choose something you haven't used here before."
            footer={<>Changed your mind? <Link to="/login" className="link">Back to login</Link></>}
        >
            <form className="grid gap-4" onSubmit={handleSubmit}>

                <div className="grid gap-1.5">
                    <label htmlFor="newPassword" className="label">New password</label>
                    <div className="input-shell">
                        <input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            className="input-bare"
                            name="newPassword"
                            value={data.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
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
                            placeholder="Repeat new password"
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

                <button disabled={!isValid} className="btn-primary btn-block btn-lg mt-2">Reset password</button>
            </form>
        </AuthShell>
    )
}

export default ResetPassword
