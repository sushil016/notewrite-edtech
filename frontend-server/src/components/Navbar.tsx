'use client'

import { useRef } from 'react'
import {gsap} from 'gsap'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Navbar = () => {

  const gsapRef = useRef();

  useGSAP(()=>{
    gsap.from(gsapRef.current ,{
      y: -50,
    opacity:0,
    duration:1,
    dealy:0.6,
    stagger: 0.2
    })
  })
const router = useRouter()

  return (
    <div ref={gsapRef} className=' text-white flex justify-evenly gap-6 p-4 backdrop-blur-sm'>
      <button onClick={()=> router.push('/')} className='text-3xl text-blue-400 font-semibold hover:opacity-80 drop-shadow-2xl duration-200'>NoteWrite</button>

      <div className='flex gap-8'>
        <button className='w-32 h-8 text-zinc-300 hover:text-blue-400    hover:scale-105 translate transform duration-150'>services
          </button>
          <button className='w-32 h-8 text-zinc-300 hover:text-blue-400 hover:scale-105 translate transform duration-150' >Projects</button>
          <button onClick={()=>{router.push("/contact")}} className='w-32 h-8 text-zinc-300 hover:text-blue-400 hover:scale-105 translate transform duration-150'>Contact us</button>
      </div>

      <Link href="/login" className="w-32 h-10 rounded-xl bg-blue-400 text-black border items-center flex justify-center border-black  text-sm hover:opacity-90 hover:bg-blue-300 duration-300">
            Sign in ->
          </Link>
    </div>
  )
}

export default Navbar
