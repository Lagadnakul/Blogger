
'use client'
import { assets } from "@/Assets/assets"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const Header = () => {
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await axios.post('/api/email', formData);
      
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
      } else {
        toast.error(response.data.msg || "Subscription failed");
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error(error.response?.data?.msg || "Failed to subscribe");
    }
  };

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      {/* ...existing code... */}
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image
            src={assets.logo}
            width={180}
            height={40}
            alt="logo"
            className="w-[130px] sm:w-auto"
            priority
          />
        </Link>
        <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]">
          Get Started
          <Image 
            src={assets.arrow} 
            width={12} 
            height={12} 
            alt="arrow" 
          />
        </button>
      </div>

      <div className="text-center my-8">
        <h1 className="text-3xl sm:text-5xl font-medium">Welcome To Blogs</h1>
        <p className="mt-10 max-w-[740px] m-auto text-xs sm:text-base">
          Hello, Your Favorite blogs are here. Start with us, upload your ideas.
        </p>
        <form onSubmit={onSubmitHandler} className="flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]">
          <input 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="pl-4 outline-none w-full"
          />
          <button
            type="submit"
            className="border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white hover:bg-black hover:text-white transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;