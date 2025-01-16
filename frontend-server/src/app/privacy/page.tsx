'use client';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-3">Privacy Policy</h1>
          <h2 className='text-xl font-semibold text-white mb-4 underline'>Last updated: 16th January 2025</h2>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Name and contact information</li>
                <li>Educational background and preferences</li>
                <li>Course enrollment and progress data</li>
                <li>Payment information (processed securely through our payment partners Razorpay)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve our educational services</li>
                <li>To personalize your learning experience</li>
                <li>To communicate with you about courses and updates</li>
                <li>To process payments and maintain billing records</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Secure data storage practices</li>
                <li>Limited access to personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
              <p>If you have any questions about our privacy policy, please contact us at:</p>
              <p className="mt-2">Email: support@notewrite.com</p>
              <p>Phone: +91 7007115675</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 