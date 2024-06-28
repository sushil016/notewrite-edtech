import React from 'react'

const SubHeading = ({ value}) => {
  return (
    <div>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 flex justify-center">
          {value}
        </p>
    </div>
  )
}

export default SubHeading
