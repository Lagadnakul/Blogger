'use client'
import React from 'react'

const SubsTableItem = ({email, mongoId, deleteEmail, date}) => {
    const emailDate = new Date(date);
    
    const handleDelete = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this subscription?')) {
            deleteEmail(mongoId);
        }
    };
     
    return (
        <tr className='bg-white border-b text-left'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                {email || "No Email"}
            </th>
            <td className='px-6 py-4 hidden sm:block'>
                {emailDate.toDateString()}
            </td>
            <td className='px-6 py-4 cursor-pointer text-red-500 hover:text-red-700'>
                <button 
                    onClick={handleDelete}
                    className="font-bold"
                    aria-label="Delete subscription"
                >
                    ✕
                </button>
            </td>
        </tr>
    )
}

export default SubsTableItem