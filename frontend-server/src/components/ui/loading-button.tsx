import { ComponentProps } from 'react';
import { MovingButton } from './moving-border';
import { Spinner } from './Spinner';

interface LoadingButtonProps extends ComponentProps<typeof MovingButton> {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  disabled,
  className = '',
  ...props
}: LoadingButtonProps) {
  console.log('LoadingButton isLoading:', isLoading);
  
  return (
    <MovingButton
      disabled={isLoading || disabled}
      loading={isLoading}
      className={`disabled:opacity-70 ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </MovingButton>
  );
} 