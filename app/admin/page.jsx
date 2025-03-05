'use client'
import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

const Page = () => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEmails = async () => {
    try {
      const response = await axios.get('/api/email')
      if (response.data && response.data.emails) {
        setEmails(response.data.emails)
        setError(null)
      } else {
        setError('No emails found')
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
      setError('Failed to load subscriptions')
      toast.error('Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const deleteEmail = async (mongoId) => {
    try {
      if (!mongoId) {
        toast.error('Email ID is missing')
        return
      }

      const response = await axios.delete('/api/email', {
        params: {
          id: mongoId
        }
      })

      if (response.data.success) {
        toast.success(response.data.msg || 'Email deleted successfully')
        await fetchEmails() // Refresh the list
      } else {
        toast.error(response.data.msg || 'Failed to delete email')
      }
    } catch (error) {
      console.error('Error deleting email:', error)
      toast.error(error.response?.data?.msg || 'Failed to delete email')
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <>
      <Toaster position="bottom-center" />
      <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
        <h1 className="text-2xl font-bold mb-4">All Subscriptions</h1>
        <div className='relative max-w-[600px] h-[80vh] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
          <table className='w-full text-sm text-gray-500'>
            <thead className='text-xs text-left text-gray-700 uppercase bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3'>Email Subscription</th>
                <th scope='col' className='hidden sm:block px-6 py-3'>Date</th>
                <th scope='col' className='px-6 py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((item, index) => (
                <SubsTableItem 
                  key={item._id || `email-${index}`}
                  mongoId={item._id}
                  deleteEmail={deleteEmail}
                  email={item.email}
                  date={item.date}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Page