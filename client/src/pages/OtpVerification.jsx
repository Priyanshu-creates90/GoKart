import React, { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

const VerifyOtp = () => {

    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const isValid = data.every(item => item)
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(() => {
        if (!location?.state?.email) navigate("/forgot-password")
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.verifyOtp,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })

            if (response.data.error) toast.error(response.data.message)

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <AuthShell
            eyebrow="Verification"
            title="Enter your code"
            subtitle={
                location?.state?.email
                    ? <>We sent a 6-digit code to <span className="font-medium text-fg">{location.state.email}</span></>
                    : "We sent a 6-digit code to your email."
            }
            footer={<>Wrong email? <Link to="/forgot-password" className="link">Start over</Link></>}
        >
            <form className="grid gap-5" onSubmit={handleSubmit}>

                <div className="grid gap-2">
                    <label htmlFor="otp" className="label">One-time code</label>
                    <div className="flex items-center justify-between gap-2">
                        {
                            data.map((element, index) => {
                                return (
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        key={index}
                                        id={index === 0 ? "otp" : undefined}
                                        ref={(ref) => {
                                            inputRef.current[index] = ref
                                            return ref
                                        }}
                                        maxLength={1}
                                        value={data[index]}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            const newData = [...data]
                                            newData[index] = value
                                            setData(newData)

                                            if (value && index < 5) {
                                                inputRef.current[index + 1].focus()
                                            }
                                        }}
                                        className="h-14 w-full rounded-xl border border-line bg-sunken text-center font-display text-lg font-semibold text-fg outline-none transition-colors focus:border-brand focus:bg-surface"
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                <button disabled={!isValid} className="btn-primary btn-block btn-lg">Verify code</button>
            </form>
        </AuthShell>
    )
}

export default VerifyOtp
