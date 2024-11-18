import React from 'react'
import { cn } from "@/lib/utils"

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2",
        "text-sm ring-offset-background placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className
      )}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea
