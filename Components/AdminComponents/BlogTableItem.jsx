import { assets } from '@/Assets/assets'
import Image from 'next/image'

const BlogTableItem = ({authorImg, title, author, date, deleteBlog, mongoId}) => {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!mongoId) {
        console.error('mongoId is missing:', { mongoId });
        return;
    }
    
    if (window.confirm('Are you sure you want to delete this blog?')) {
        try {
            await deleteBlog(mongoId);
        } catch (error) {
            console.error('Error in handleDelete:', error);
        }
    }
};

  return (
    <tr className='bg-white border-b'>
      <th scope='row' className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
        <Image 
          src={authorImg || assets.profile_icon}
          width={40}
          height={40}
          alt={author || 'Author'}
        />
        <p>{author || "No author"}</p>
      </th>
      <td className='px-6 py-4'>{title || "No title"}</td>
      <td className='px-6 py-4'>{new Date(date).toLocaleDateString()}</td>
      <td className='px-6 py-4 cursor-pointer text-red-500 hover:text-red-700'>
        <button 
          onClick={handleDelete}
          className="font-bold"
          aria-label="Delete blog"
        >
          ✕
        </button>
      </td>
    </tr>
  )
}

export default BlogTableItem