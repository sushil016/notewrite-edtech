import React from 'react'

interface HeadingProps {
  value: string;
}

const Heading: React.FC<HeadingProps> = ({ value }) => {
  return (
    <div>
       <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 flex  left-0">
          {value}
        </h2>
    </div>
  )
}

export default Heading
