'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const BlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blog')
      // Add unique IDs if they don't exist
      const blogsWithIds = response.data.blogs.map((blog, index) => ({
        ...blog,
        id: blog._id || blog.id || `blog-${index}` // Fallback chain for IDs
      }))
      setBlogs(blogsWithIds)
      setError(null)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const deleteBlog = async (mongoId) => {
    try {
      if (!mongoId) {
        toast.error('Blog ID is missing')
        return
      }

      const response = await axios.delete('/api/blog', {
        params: { id: mongoId }
      })
      
      if (response.data.msg) {
        toast.success(response.data.msg)
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== mongoId))
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error(error.response?.data?.error || 'Failed to delete blog')
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1 className='text-2xl font-bold mb-4'>All Blogs</h1>
      <div className='relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-sm text-gray-700 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='hidden sm:block px-6 py-3'>Author Name</th>
              <th scope='col' className='px-6 py-3'>Blog Title</th>
              <th scope='col' className='px-6 py-3'>Date</th>
              <th scope='col' className='px-6 py-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <BlogTableItem
                key={`blog-${blog.id || index}`}
                mongoId={blog.id || blog._id}
                title={blog.title}
                author={blog.author}
                authorImg={blog.author_img}
                date={blog.date || new Date()}
                deleteBlog={deleteBlog}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BlogList