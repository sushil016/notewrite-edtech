'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export function RazorpayScript() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Script
      id="razorpay-checkout-js"
      src="https://checkout.razorpay.com/v1/checkout.js"
      onLoad={() => setIsLoaded(true)}
      strategy="lazyOnload"
    />
  );
} 