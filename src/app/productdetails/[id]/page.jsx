"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/hooks/useTheme";
import { cartContext } from "@/context/CartContext";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import useEmblaCarousel from "embla-carousel-react";
import { AiFillStar, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isWished, setIsWished] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const { addToCart, setIsCartOpen } = useContext(cartContext);

  // Wishlist
  async function handleWishlist(id) {
    if (wishLoading) return;

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setWishLoading(true);

    try {
      if (!isWished) {
        // CASE: Add to wishlist
        const { data } = await axios.post(
          `https://ecommerce.routemisr.com/api/v1/wishlist`,
          { productId: id },
          { headers: { token } },
        );
        if (data.status === "success") {
          setIsWished(true);
          toast.success("Added to wishlist", {
            style: {
              border: "1px solid #12bb9c",
              color: "#12bb9c",
              background: "#0f172a",
            },
            iconTheme: { primary: "#12bb9c", secondary: "#fff" },
          });
        }
      } else {
        // CASE: Remove from wishlist
        const { data } = await axios.delete(
          `https://ecommerce.routemisr.com/api/v1/wishlist/${id}`,
          { headers: { token } },
        );
        if (data.status === "success") {
          setIsWished(false);
          toast.success("Removed from wishlist", {
            style: {
              border: "1px solid #ef4444",
              color: "#ef4444",
              background: "#0f172a",
            },
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          });
        }
      }
    } catch (error) {
      console.error("Wishlist Error:", error);
      toast.error("Something went wrong");
    } finally {
      setWishLoading(false);
    }
  }

  // Embla Setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveImage(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  useTheme("#0f172a", "Product Details | Novalo");

  useEffect(() => {
    async function getProductDetails() {
      try {
        const { data } = await axios.get(
          `https://ecommerce.routemisr.com/api/v1/products/${id}`,
        );
        setProduct(data.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) getProductDetails();
  }, [id]);

  async function handleAddToCart(productId) {
    setIsAdding(true);
    const res = await addToCart(productId);
    if (res?.data?.status === "success") {
      toast.success("Added to cart!", {
        style: {
          borderRadius: "10px",
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #12bb9c",
        },
        iconTheme: { primary: "#12bb9c", secondary: "#fff" },
      });
      setIsCartOpen(true);
    }
    setIsAdding(false);
  }

  const scrollTo = (index) => {
    setActiveImage(index);
    if (emblaApi) emblaApi.scrollTo(index);
  };

  return (
    <div className="bg-[#0f172a] min-h-screen pt-24 pb-12 text-white">
      <div className="max-w-screen-xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-5 space-y-5">
            {isLoading ? (
              <Skeleton
                height={400}
                borderRadius={24}
                baseColor="#1e293b"
                highlightColor="#334155"
              />
            ) : (
              <>
                <div
                  className="embla overflow-hidden rounded-3xl bg-[#1e293b] border border-gray-800 cursor-grab active:cursor-grabbing"
                  ref={emblaRef}
                >
                  <div className="embla__container flex">
                    {product?.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="embla__slide flex-[0_0_100%] min-w-0 relative aspect-square"
                      >
                        <Image
                          src={img}
                          alt={product?.title}
                          fill
                          /* Dynamic Padding: px-10 if multiple images, p-4 if single */
                          className={`object-contain ${product.images.length > 1 ? "px-10 py-6" : "p-4"}`}
                          priority
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {product?.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar justify-center lg:justify-start">
                    {product?.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                          activeImage === index
                            ? "border-[#12bb9c] scale-105"
                            : "border-gray-800 opacity-40"
                        }`}
                      >
                        <Image
                          src={img}
                          alt="thumb"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:col-span-7 flex flex-col justify-center py-32 lg:py-0">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton
                  width="20%"
                  height={15}
                  baseColor="#1e293b"
                  highlightColor="#334155"
                />
                <Skeleton
                  width="80%"
                  height={35}
                  baseColor="#1e293b"
                  highlightColor="#334155"
                />
                <Skeleton
                  count={3}
                  baseColor="#1e293b"
                  highlightColor="#334155"
                />
              </div>
            ) : (
              <>
                <span className="text-[#12bb9c] font-bold uppercase tracking-[0.2em] text-xs mb-3 block">
                  {product?.category?.name}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug tracking-tight">
                  {product?.title}
                </h1>

                <div className="flex items-center gap-5 mb-6">
                  <span className="text-2xl font-bold text-white">
                    {product?.price?.toLocaleString()} EGP
                  </span>
                  <div className="flex items-center text-yellow-400 gap-1.5 bg-yellow-400/10 px-3 py-1 rounded-lg">
                    <i className="fa-solid fa-star text-[10px]"></i>
                    <span className="text-sm font-bold">
                      {product?.ratingsAverage}
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                  {product?.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* ADD TO CART BUTTON */}
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={isAdding}
                    className="flex-1 bg-[#12bb9c] hover:bg-[#0da085] disabled:bg-gray-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#12bb9c]/10 uppercase text-sm tracking-widest cursor-pointer flex items-center justify-center gap-3"
                  >
                    {isAdding ? (
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        <i className="fa-solid fa-cart-shopping"></i>
                        Add to Cart
                      </>
                    )}
                  </button>

                  {/* WISHLIST BUTTON */}
                  <button
                    onClick={() => handleWishlist(product._id)}
                    disabled={wishLoading}
                    className="flex-1 py-4 bg-[#1e293b] border border-gray-800 rounded-xl transition-all cursor-pointer flex items-center justify-center group/wish"
                  >
                    {wishLoading ? (
                      <ImSpinner2 className="animate-spin text-[#12bb9c] text-xl" />
                    ) : isWished ? (
                      <div className="flex items-center gap-2">
                        <AiFillHeart className="text-red-500 text-xl" />
                        <span className="text-sm font-bold uppercase tracking-widest">
                          Wishlisted
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AiOutlineHeart className="text-gray-400 group-hover/wish:text-red-500 text-xl transition-colors" />
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover/wish:text-white transition-colors">
                          Wishlist
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-800/50 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                      Brand
                    </p>
                    <p className="font-bold text-sm text-gray-200">
                      {product?.brand?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                      Stock Status
                    </p>
                    <p className="font-bold text-sm text-[#12bb9c]">
                      {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
