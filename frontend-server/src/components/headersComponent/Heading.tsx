import React from 'react'

const Heading = ({ value}) => {
  return (
    <div>
       <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 flex justify-center">
          {value}
        </h2>
    </div>
  )
}

export default Heading
