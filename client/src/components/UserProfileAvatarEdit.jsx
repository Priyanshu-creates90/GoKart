import React, { useState } from 'react'
import { HiOutlineUser, HiXMark } from 'react-icons/hi2'
import { useSelector, useDispatch } from 'react-redux'
import SummaryApi from '../common/SummaryApi'
import Axios from "../utils/Axios"
import AxiosToastError from '../utils/AxiosToastError'
import { updatedAvatar } from '../store/userSlice'

const UserProfileAvatarEdit = ({ close }) => {
    const user = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleClose = () => {
        if (close) return close()
        window.history.back()
    }

    const handleUploadAvatarImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData
            })

            const { data: responseData } = response

            dispatch(updatedAvatar(responseData.data.avatar))

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="overlay flex items-center justify-center p-4">
            <div className="modal max-w-sm">
                <div className="modal-head">
                    <h2 className="font-display text-base font-semibold">Profile photo</h2>
                    <button onClick={handleClose} aria-label="Close" className="icon-btn">
                        <HiXMark size={22} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4 p-6">
                    <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-line bg-sunken text-fg-faint">
                        {
                            user.avatar ? (
                                <img
                                    alt={user.name}
                                    src={user.avatar}
                                    className="h-full w-full object-cover"
                                />) : (
                                <HiOutlineUser size={44} />
                            )
                        }
                    </div>

                    <form onSubmit={(e) => { e.preventDefault() }}>
                        <label htmlFor="uploadProfile" className="btn-outline cursor-pointer">
                            {loading ? "Uploading..." : "Upload new photo"}
                        </label>
                        <input onChange={handleUploadAvatarImage} type="file" id="uploadProfile" className="hidden" />
                    </form>

                    <p className="text-center text-xs text-fg-faint">JPG or PNG, square images look best.</p>
                </div>
            </div>
        </section>
    )
}

export default UserProfileAvatarEdit
