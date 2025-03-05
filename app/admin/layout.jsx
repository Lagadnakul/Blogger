'use client'
import Sidebar from '@/Components/AdminComponents/Sidebar'
import Image from 'next/image'
import { assets } from '@/Assets/assets'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <ToastContainer theme="dark"/>
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex item-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-blac k">
            <h3 className="font-medium">Admin Panel</h3>
            <Image src={assets.profile_icon} width={40} alt='' />
        </div>
        {children}
      </div>
 
      </div>
  )
}