'use client';
import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { cartContext } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';




const SuccessOverlay = () => (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
        <div className="text-center p-10 bg-[#1e293b] rounded-3xl shadow-2xl animate-[scale-in_0.3s_ease-out] border border-gray-700">
            <div className="w-20 h-20 bg-[#12bb9c]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-check text-4xl text-[#12bb9c]"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-gray-400 text-sm">Redirecting to secure payment...</p>
            <div className="mt-8 flex justify-center">
                <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#12bb9c] animate-[progress_2s_linear]"></div>
                </div>
            </div>
        </div>
    </div>
);

export default function Checkout() {
    let { onlinePayment, cashPayment, cartId, cartDetails } = useContext(cartContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const router = useRouter();

    useTheme("#0f172a", "Checkout | Novalo");

    async function handleOrderSubmit(values) {
        setIsLoading(true);
        const action = paymentMethod === 'online' ? onlinePayment : cashPayment;
        
        try {
            let res = await action(cartId, values);
            if (res?.data?.status === 'success') {
                setIsSuccess(true);
                toast.success('Address confirmed!');
                setTimeout(() => {
                    if (paymentMethod === 'online') {
                        window.location.href = res?.data?.session?.url;
                    } else {
                        router.push('/allorders');
                    }
                }, 2000);
            } else {
                toast.error(res?.response?.data?.message || 'Order failed');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setIsLoading(false);
        }
    }

    let formik = useFormik({
        initialValues: { details: '', city: '', phone: '' },
        validationSchema: Yup.object({
            details: Yup.string().required("Address is required").min(10, "Be more specific"),
            city: Yup.string().required("City is required"),
            phone: Yup.string().required("Phone is required").matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian number'),
        }),
        onSubmit: handleOrderSubmit
    });

    return (
        
        <div className="min-h-screen bg-[#0f172a] flex flex-col -mt-20 pt-20">
            {isSuccess && <SuccessOverlay />}
            
            <section className="grow py-12 md:py-24 antialiased"> 
                <div className="mx-auto max-w-screen-xl px-4 pt-10 lg:pt-0">
                    <h1 className="text-3xl font-extrabold text-white mb-10 tracking-tight">Checkout</h1>

                    <div className="lg:flex lg:items-start lg:gap-12">
                        {/* FORM COLUMN */}
                        <div className="flex-1 space-y-6">
                            <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
                                <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-5 mb-8 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#12bb9c] text-white flex items-center justify-center text-sm">1</span>
                                    Shipping Information
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Street Address</label>
                                        <input type="text" {...formik.getFieldProps('details')} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-[#12bb9c] outline-none transition-all placeholder:text-gray-600" placeholder="e.g. 123 Nile St, Maadi, Cairo" />
                                        {formik.touched.details && formik.errors.details && <p className="text-red-400 text-xs mt-2 font-medium">{formik.errors.details}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                                            <input type="text" {...formik.getFieldProps('phone')} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-[#12bb9c] outline-none" placeholder="01xxxxxxxxx" />
                                            {formik.touched.phone && formik.errors.phone && <p className="text-red-400 text-xs mt-2 font-medium">{formik.errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">City</label>
                                            <input type="text" {...formik.getFieldProps('city')} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-[#12bb9c] outline-none" placeholder="Cairo" />
                                            {formik.touched.city && formik.errors.city && <p className="text-red-400 text-xs mt-2 font-medium">{formik.errors.city}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
                                <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-5 mb-8 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#12bb9c] text-white flex items-center justify-center text-sm">2</span>
                                    Payment Method
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button onClick={() => setPaymentMethod('online')} type="button" className={`cursor-pointer p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'online' ? 'border-[#12bb9c] bg-[#12bb9c]/5 text-[#12bb9c]' : 'border-gray-700 bg-[#0f172a] text-gray-400'}`}>
                                        <i className="fa-brands fa-cc-visa text-3xl"></i>
                                        <div className="text-left ">
                                            <p className="font-bold text-sm">Online Payment</p>
                                            <p className="text-[10px] opacity-70 uppercase tracking-tighter">Visa / Mastercard</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setPaymentMethod('cash')} type="button" className={`cursor-pointer p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'cash' ? 'border-[#12bb9c] bg-[#12bb9c]/5 text-[#12bb9c]' : 'border-gray-700 bg-[#0f172a] text-gray-400'}`}>
                                        <i className="fa-solid fa-wallet text-3xl"></i>
                                        <div className="text-left">
                                            <p className="font-bold text-sm">Cash on Delivery</p>
                                            <p className="text-[10px] opacity-70 uppercase tracking-tighter">Pay at your door</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SUMMARY COLUMN */}
                        <div className="mt-10 lg:mt-0 w-full lg:max-w-md">
                            <div className="bg-[#1e293b] p-8 rounded-3xl border border-gray-700/50 shadow-2xl sticky top-28">
                                <h3 className="text-xl font-bold text-white mb-8">Order Summary</h3>
                                <div className="space-y-5 max-h-100 overflow-y-auto mb-8 pr-3 custom-scrollbar">
                                    {cartDetails?.products?.map((item) => (
                                        <div key={item.product._id} className="flex gap-5 items-center">
                                            <div className="w-20 h-20 relative rounded-2xl overflow-hidden border border-gray-700 flex-shrink-0">
                                                <Image src={item.product.imageCover} alt="product" fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold text-sm truncate">{item.product.title}</p>
                                                <p className="text-gray-400 text-xs font-medium">Quantity: {item.count}</p>
                                                <p className="text-[#12bb9c] font-black text-sm mt-1">{item.price} EGP</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-700/50 pt-6 space-y-3">
                                    <div className="flex justify-between text-gray-400 text-sm font-medium">
                                        <span>Subtotal</span>
                                        <span>{cartDetails?.totalCartPrice} EGP</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm font-medium">
                                        <span>Shipping</span>
                                        <span className="text-[#12bb9c]">Free</span>
                                    </div>
                                    <div className="flex justify-between text-white font-black text-2xl pt-4">
                                        <span>Total</span>
                                        <span>{cartDetails?.totalCartPrice} EGP</span>
                                    </div>
                                    
                                    <button 
                                        onClick={formik.handleSubmit}
                                        disabled={isLoading || !formik.isValid}
                                        className="w-full bg-[#12bb9c] py-5 cursor-pointer rounded-2xl text-white font-black uppercase tracking-[0.2em] mt-8 hover:bg-[#0ea388] transition-all disabled:opacity-30 shadow-xl shadow-[#12bb9c]/20"
                                    >
                                        {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : `Place Order`}
                                    </button>
                                    
                                    <div className="flex items-center justify-center gap-2 pt-6 opacity-40">
                                        <i className="fa-solid fa-lock text-[10px] text-white"></i>
                                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Secure encrypted checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}