'use client'
import Image from 'next/image'
import Header from "@/Components/Header"
import BlogList from "@/Components/BlogList"
import Footer from '@/Components/Footer'
import { Toaster } from "react-hot-toast" // Changed from ToastContainer

export default function Home() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Header />
      <BlogList />
      <Footer />
    </>
  );
}