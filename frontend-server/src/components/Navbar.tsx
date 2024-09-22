'use client'

import { useRef } from 'react'
import {gsap} from 'gsap'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MovingButton } from './ui/moving-border'

const Navbar = () => {

  const gsapRef = useRef<HTMLDivElement>(null);

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
    <div ref={gsapRef} className= ' text-white w-full h-[] flex justify-evenly gap-6 p-4 backdrop-blur-sm border-b-1 drop-shadow-lg shadow-lg shadow-zinc-100/10 fixed z-50'>
      <button onClick={()=> router.push('/')} className='text-3xl text-blue-400 font-semibold hover:opacity-80 drop-shadow-2xl duration-200'>Robonauts</button>

      <div className='flex gap-8'>
        <button className='w-32 h-8 text-zinc-300 hover:text-blue-400    hover:scale-105 translate transform duration-150'>services
          </button>
          <button className='w-32 h-8 text-zinc-300 hover:text-blue-400 hover:scale-105 translate transform duration-150' >Projects</button>
          <button onClick={()=>{router.push("/contact")}} className='w-32 h-8 text-zinc-300 hover:text-blue-400 hover:scale-105 translate transform duration-150'>Contact us</button>
      </div>

      <Link href="/login" > <MovingButton 
      borderRadius="1rem"
      className='bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800'>Sign in</MovingButton>
          </Link>
    </div>
  )
}

export default Navbar
