'use client';
import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-8">Refund & Cancellation Policy</h1>
          
          <div className="space-y-6">
            <section>
                <h2>
                You are entitled to a refund in the case of the purchased course not being assigned to you within the expiration date from your date of purchase or if you have paid twice for the same course. Under any other circumstance, we will not consider any requests for refund as this is a digital course purchase.
                </h2>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Contact Support</h2>
              <p>For questions, please contact:</p>
              <p className="mt-2">Email: support@notewrite.com</p>
              <p>Phone: +91 7007115675</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}