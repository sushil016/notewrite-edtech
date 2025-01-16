'use client';
import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. User Agreement</h2>
              <p>Welcome, if you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern100xDevs relationship with you in relation to this website.

The term ‘Notewrite’ or ‘us’ or ‘we’ refers to the owner of the website. The term ‘you’ refers to the user or viewer of our website.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users must maintain accurate account information</li>
                <li>Accounts are personal and non-transferable</li>
                <li>Users are responsible for maintaining account security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Course Content</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Content is for personal educational use only</li>
                <li>Sharing or redistributing content is prohibited</li>
                <li>Course materials are protected by copyright</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Teacher Guidelines</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Teachers must provide accurate course information</li>
                <li>Content must be original or properly licensed</li>
                <li>Regular course updates and maintenance required</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 