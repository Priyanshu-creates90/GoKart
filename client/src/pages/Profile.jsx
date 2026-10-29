import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineUser, HiOutlineCamera } from 'react-icons/hi2'
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit'
import Axios from '../utils/Axios.js'
import SummaryApi from '../common/SummaryApi.js'
import AxiosToastError from '../utils/AxiosToastError.js'
import toast from 'react-hot-toast'
import fetchUserDetails from '../utils/fetchUserDetails.js'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice.js'
import Loading from '../components/Loading.jsx'

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    })

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        })
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-4">

            {/* identity card */}
            <div className="card flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
                <div className="relative">
                    <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-line bg-sunken text-fg-faint">
                        {
                            user.avatar ? (
                                <img
                                    alt={user.name}
                                    src={user.avatar}
                                    className="h-full w-full object-cover"
                                />) : (
                                <HiOutlineUser size={38} />
                            )
                        }
                    </div>
                    <button
                        onClick={() => setOpenProfileAvatarEdit(true)}
                        aria-label="Change photo"
                        className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-brand text-brand-on shadow-card transition-colors hover:bg-brand-strong hover:text-white"
                    >
                        <HiOutlineCamera size={16} />
                    </button>
                </div>

                <div className="text-center sm:text-left">
                    <p className="eyebrow">Signed in as</p>
                    <h1 className="mt-1 font-display text-xl font-semibold">{user.name}</h1>
                    <p className="text-sm text-fg-muted">{user.email}</p>
                </div>
            </div>

            {
                openProfileAvatarEdit && (
                    <UserProfileAvatarEdit close={() => setOpenProfileAvatarEdit(false)} />
                )
            }

            {/* details form */}
            <div className="panel">
                <div className="panel-head">
                    <h2 className="font-display text-sm font-semibold">Personal details</h2>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4 p-5">
                    <div className="grid gap-1.5">
                        <label htmlFor="name" className="label">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your full name"
                            className="input"
                            value={userData.name}
                            name="name"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <label htmlFor="email" className="label">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="input"
                            value={userData.email}
                            name="email"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <label htmlFor="mobile" className="label">Mobile</label>
                        <input
                            type="text"
                            id="mobile"
                            placeholder="10-digit mobile number"
                            className="input"
                            value={userData.mobile}
                            name="mobile"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button className="btn-primary mt-2 w-full sm:w-fit sm:min-w-40">
                        {loading ? <Loading label="Saving" /> : "Save changes"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile
