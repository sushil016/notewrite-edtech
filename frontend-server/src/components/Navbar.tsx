import React from 'react'
import {gsap} from 'gsap'

const Navbar = () => {
  return (
    <div className='text-white flex justify-evenly gap-6 p-4'>
      <button className='text-3xl text-slate-100 font-semibold hover:opacity-90'>Idea</button>

      <div className='flex gap-8'>
        <button className='w-32 h-8 text-zinc-300 hover:text-white hover:scale-105 translate transform duration-150'>services
          </button>
          <button className='w-32 h-8 text-zinc-300 hover:text-white hover:scale-105 translate transform duration-150' >Projects</button>
          <button className='w-32 h-8 text-zinc-300 hover:text-white hover:scale-105 translate transform duration-150'>Contact me</button>
      </div>

      <button className="w-32 h-10 rounded-xl bg-white text-black border border-black  text-sm hover:opacity-90">
            login ->
          </button>
    </div>
  )
}

export default Navbar
