import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiXMark } from "react-icons/hi2";
import { useGlobalContext } from '../provider/GlobalProvider'

const EditAddressDetails = ({ close, data }) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            _id: data._id,
            userId: data.userId,
            address_line: data.address_line,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            mobile: data.mobile
        }
    })
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateAddress,
                data: {
                    ...data,
                    address_line: data.address_line,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="overlay overflow-y-auto p-4">
            <div className="modal mx-auto my-8 max-w-lg">
                <div className="modal-head">
                    <div>
                        <p className="eyebrow">Delivery</p>
                        <h2 className="mt-1 font-display text-base font-semibold">Edit address</h2>
                    </div>
                    <button onClick={close} aria-label="Close" className="icon-btn hover:text-critical">
                        <HiXMark size={22} />
                    </button>
                </div>

                <form className="grid gap-4 p-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-1.5">
                        <label htmlFor="addressline" className="label">Address line</label>
                        <input
                            type="text"
                            id="addressline"
                            className="input"
                            {...register("address_line", { required: true })}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                            <label htmlFor="city" className="label">City</label>
                            <input type="text" id="city" className="input" {...register("city", { required: true })} />
                        </div>
                        <div className="grid gap-1.5">
                            <label htmlFor="state" className="label">State</label>
                            <input type="text" id="state" className="input" {...register("state", { required: true })} />
                        </div>
                        <div className="grid gap-1.5">
                            <label htmlFor="pincode" className="label">Pincode</label>
                            <input type="text" id="pincode" className="input" {...register("pincode", { required: true })} />
                        </div>
                        <div className="grid gap-1.5">
                            <label htmlFor="country" className="label">Country</label>
                            <input type="text" id="country" className="input" {...register("country", { required: true })} />
                        </div>
                    </div>

                    <div className="grid gap-1.5">
                        <label htmlFor="mobile" className="label">Mobile number</label>
                        <input type="text" id="mobile" className="input" {...register("mobile", { required: true })} />
                    </div>

                    <button type="submit" className="btn-primary btn-block btn-lg mt-2">Save changes</button>
                </form>
            </div>
        </section>
    )
}

export default EditAddressDetails
