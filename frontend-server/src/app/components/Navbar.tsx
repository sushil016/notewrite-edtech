import React from 'react'

const Navbar = () => {
  return (
    <div className='text-white flex justify-between gap-6'>
      <div className='text-3xl '>
        idea
      </div>

      <div className='flex gap-8'>
        <p>services</p>
        <p>Projects</p>
        <p>Contact me</p>
      </div>
    </div>
  )
}

export default Navbar
