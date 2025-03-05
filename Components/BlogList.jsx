'use client'
import { blog_data } from '@/Assets/assets'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import BlogItem from './BlogItem'
import { usePathname } from 'next/navigation'

const BlogList = () => {
    const [menu, setMenu] = useState("All")
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const pathname = usePathname()

    const isAdminRoute = pathname.includes('/admin')

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blog');
            if (response.data && response.data.blogs) {
                // Ensure each blog has a proper ID
                const blogsWithIds = response.data.blogs.map(blog => ({
                    ...blog,
                    _id: blog._id || blog.id, // Keep MongoDB _id if exists
                    id: blog.id || blog._id // Ensure id exists
                }));
                console.log('Fetched blogs:', blogsWithIds); // Debug log
                setBlogs(blogsWithIds);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setError('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };
    const deleteBlog = async (mongoId) => {
        try {
            console.log('Attempting to delete blog with ID:', mongoId); // Debug log
            
            if (!mongoId) {
                toast.error('Blog ID is missing');
                return;
            }
    
            const response = await axios.delete('/api/blog', {
                params: { id: mongoId }
            });
            
            if (response.data.msg) {
                toast.success(response.data.msg);
                setBlogs(prevBlogs => prevBlogs.filter(blog => 
                    blog._id !== mongoId && blog.id !== mongoId
                ));
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error(error.response?.data?.error || 'Failed to delete blog');
        }
    };
    useEffect(() => {
        fetchBlogs()
    }, [])

    const filteredBlogs = blog_data.filter((item) => 
        menu === "All" ? true : item.category === menu
    )

    if (loading) return <div className="text-center py-10">Loading...</div>
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>

    return (
        <div>
            {/* Blog grid view - only show on home page */}
            {!isAdminRoute && (
                <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
                    {filteredBlogs.map((blog, index) => (
                        <BlogItem 
                            key={blog.id || `grid-${index}`}
                            id={blog.id || blog._id}
                            image={blog.image}
                            title={blog.title}
                            description={blog.description}
                            category={blog.category}
                            author={blog.author}
                            authorImg={blog.author_img}
                        />
                    ))}
                </div>
            )}
    
            {/* Blog table view - only show in admin */}
            {isAdminRoute && (
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
                        {blogs.map((blog) => (
    <BlogTableItem
        key={`blog-${blog.id}`}
        mongoId={blog._id || blog.id} // Try MongoDB _id first, then fallback to id
        title={blog.title}
        author={blog.author}
        authorImg={blog.author_img}
        date={blog.date}
        deleteBlog={deleteBlog}
    />
))}{blogs.map((blog) => (
    <BlogTableItem
        key={`blog-${blog.id}`}
        mongoId={blog._id || blog.id} // Try MongoDB _id first, then fallback to id
        title={blog.title}
        author={blog.author}
        authorImg={blog.author_img}
        date={blog.date}
        deleteBlog={deleteBlog}
    />
))}{blogs.map((blog) => (
    <BlogTableItem
        key={`blog-${blog.id}`}
        mongoId={blog._id || blog.id} // Try MongoDB _id first, then fallback to id
        title={blog.title}
        author={blog.author}
        authorImg={blog.author_img}
        date={blog.date}
        deleteBlog={deleteBlog}
    />
))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default BlogList