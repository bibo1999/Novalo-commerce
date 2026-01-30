'use client';
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const cartContext = createContext();

export function CartContextProvider({ children }) {
    const [cartId, setCartId] = useState(null);
    const [numOfCartItems, setNumOfCartItems] = useState(0);
    const [cartDetails, setCartDetails] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [numOfFavoriteItems, setNumOfFavoriteItems] = useState(0);
    const [wishListDetails, setWishListDetails] = useState([]);

    // Clear Cart after checkout
    const clearCartState = () => {
    setCartDetails(null);
    setNumOfCartItems(0);
    setCartId(null);
    };

    
    const getHeaders = () => ({
        token: typeof window !== 'undefined' ? localStorage.getItem('userToken') : '',
    });

    // --- 1. API  ---

    async function getLoggedUserCart() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/cart`, { 
            headers: getHeaders() 
        }).then((res) => res).catch((error) => error);
    }

    async function addToCart(productId) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/cart`,
            { productId },
            { headers: getHeaders() }
        ).then((res) => {
            refreshCart(); 
            return res;
        }).catch((error) => error);
    }

    // --- OPTIMISTIC REMOVE ---
    async function removeItemFromCart(productId) {
        // 1. Save snapshot for rollback
        const previousDetails = { ...cartDetails };
        const previousNum = numOfCartItems;

        // 2. Optimistic Update: Remove instantly
        if (cartDetails) {
            const updatedProducts = cartDetails.products.filter(
                (item) => item.product._id !== productId && item.product !== productId
            );
            
            const newTotal = updatedProducts.reduce((acc, item) => acc + (item.price * item.count), 0);
            
            setCartDetails({
                ...cartDetails,
                products: updatedProducts,
                totalCartPrice: newTotal
            });
            setNumOfCartItems(prev => prev - 1);
        }

        return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, 
            { headers: getHeaders() }
        ).then((res) => {
            // Final sync with server to ensure state is perfectly accurate
            if (res?.data?.status === 'success') {
                setNumOfCartItems(res.data.numOfCartItems);
                setCartDetails(res.data.data);
            }
            return res;
        }).catch((error) => {
            // Rollback on failure
            setCartDetails(previousDetails);
            setNumOfCartItems(previousNum);
            return error;
        });
    }

    // --- OPTIMISTIC UPDATE COUNT ---
    async function updateProductCount(productId, count) {
        if (count < 1) return;

        // 1. Save for any rollback
        const previousDetails = { ...cartDetails };

        // 2. Change count instantly
        if (cartDetails) {
            const updatedProducts = cartDetails.products.map((item) => {
                if (item.product._id === productId || item.product === productId) {
                    return { ...item, count: count };
                }
                return item;
            });

            const newTotal = updatedProducts.reduce((acc, item) => acc + (item.price * item.count), 0);

            setCartDetails({
                ...cartDetails,
                products: updatedProducts,
                totalCartPrice: newTotal
            });
        }

        return axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
            { count },
            { headers: getHeaders() }
        ).then((res) => {
            if (res?.data?.status === 'success') {
                setNumOfCartItems(res.data.numOfCartItems);
                setCartDetails(res.data.data);
            }
            return res;
        }).catch((error) => {
            // Rollback on failure
            setCartDetails(previousDetails);
            return error;
        });
    }

    async function removeCart() {
        return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`, 
            { headers: getHeaders() }
        ).then((res) => {
            setCartDetails(null);
            setNumOfCartItems(0);
            setCartId(null);
            return res;
        }).catch((error) => error);
    }

    // --- 2. FUNCTIONS ---
    
    async function refreshCart() {
        const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
        if (!token) return;
        
        try {
            const res = await getLoggedUserCart();
            if (res?.data?.status === 'success') {
                setNumOfCartItems(res.data.numOfCartItems);
                setCartDetails(res.data.data);
                setCartId(res.data.data._id);
            }
        } catch (error) {
            console.error("Cart sync failed", error);
        }
    }
    

    // --- 3. PAYMENT & WISHLIST ---

    async function onlinePayment(cartId, shippingAddress) {
        const url = `${window.location.protocol}//${window.location.host}`;
        return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
            { shippingAddress },
            { headers: getHeaders() }
        ).then((res) => {
        if (res?.data?.status === 'success') {
            clearCartState(); 
        }
        return res;
    }).catch((error) => error);
    }

    async function cashPayment(cartId, shippingAddress) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
            { shippingAddress },
            { headers: getHeaders() }
        ).then((res) => {
        if (res?.data?.status === 'success') {
            clearCartState(); 
        }
        return res;
    }).catch((error) => error);
    }

    async function getLoggedWishList() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, 
            { headers: getHeaders() }
        ).then((res) => res).catch((error) => error);
    }

    return (
        <cartContext.Provider value={{
            cartId,
            numOfCartItems,
            setNumOfCartItems,
            cartDetails,
            isCartOpen,
            setIsCartOpen,
            refreshCart,
            addToCart,
            getLoggedUserCart,
            removeItemFromCart,
            updateProductCount,
            onlinePayment,
            cashPayment,
            removeCart,
            wishListDetails,
            setWishListDetails,
            getLoggedWishList
        }}>
            {children}
        </cartContext.Provider>
    );
}