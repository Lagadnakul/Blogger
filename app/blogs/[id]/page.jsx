'use client'
import { assets, blog_data } from "@/Assets/assets"
import Footer from "@/Components/Footer"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

const Page = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const params = useParams()

  const fetchBlogData = async () => {
    try {
      const blogId = parseInt(params.id)
      console.log('Looking for blog with ID:', blogId)
      
      // Try to find blog in static data first
      const blog = blog_data.find(blog => blog.id === blogId)
      
      if (blog) {
        console.log('Found blog:', blog)
        setData(blog)
        setError(null)
      } else {
        // If not in static data, try fetching from API
        const response = await axios.get(`/api/blog?id=${blogId}`)
        if (response.data) {
          setData(response.data)
          setError(null)
        } else {
          setError("Blog not found")
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchBlogData()
  }, [params.id])

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return data ? (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src={assets.logo} width={130} height={25} alt="logo" />
          </Link>
          <button className="flex items-center gap-2 border border-black px-5 py-2 hover:shadow-[-7px_7px_0px_#000000]">
            Get Started
            <Image src={assets.arrow} width={12} height={12} alt="arrow" />
          </button>
        </div>

        {/* Blog Title and Author */}
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          <Image
            className="mx-auto mt-6 border border-white rounded-full"
            src={data.author_img}
            width={60}
            height={60}
            alt={`${data.author} profile`}
          />
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">
            {data.author}
          </p>
        </div>

        {/* Blog Content */}
        <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
          <Image
            className='border-4 border-white'
            src={data.image}
            width={800}
            height={500}
            alt={data.title}
          />
          <div 
            className='blog-content' 
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          {/* Social Share */}
          <div className='my-24'>
            <p className='text-black font-semibold my-4'>
              Share this article on Social Media
            </p>
            <div className='flex gap-4'>
              <Image 
                src={assets.facebook_icon} 
                width={50} 
                height={50} 
                alt='Share on Facebook' 
              />
              <Image 
                src={assets.twitter_icon} 
                width={50} 
                height={50} 
                alt='Share on Twitter' 
              />
              <Image 
                src={assets.googleplus_icon} 
                width={50} 
                height={50} 
                alt='Share on Google Plus' 
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading...</p>
    </div>
  )
}

export default Page