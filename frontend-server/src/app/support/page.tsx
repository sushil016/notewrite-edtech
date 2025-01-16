'use client';
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaWhatsapp, FaHeadset, FaBook, FaCreditCard, FaUserGraduate } from 'react-icons/fa';
import { MovingButton } from '@/components/ui/moving-border';
import { Input } from '@/components/ui/input';
import TextArea from '@/components/ui/textArea';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';

const supportCategories = [
  {
    icon: FaHeadset,
    title: 'Technical Support',
    description: 'Issues with course access, video playback, or platform features',
  },
  {
    icon: FaBook,
    title: 'Course Content',
    description: 'Questions about course materials, assignments, or certifications',
  },
  {
    icon: FaCreditCard,
    title: 'Billing & Payments',
    description: 'Payment issues, refunds, or subscription inquiries',
  },
  {
    icon: FaUserGraduate,
    title: 'Teacher Support',
    description: 'Assistance for course creators and instructors',
  },
];

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'Technical Support',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/support/ticket', formData);
      toast.success('Support ticket submitted successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'Technical Support',
      });
    } catch (error) {
      toast.error('Failed to submit support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How Can We Help You?
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our support team is here to assist you. Choose a category below or contact us directly.
          </p>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {supportCategories.map((category, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <category.icon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
              <p className="text-gray-400">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <FaEnvelope className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
            <p className="text-gray-400">support@notewrite.com</p>
            <p className="text-gray-400">24/7 Response</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <FaPhone className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Phone Support</h3>
            <p className="text-gray-400">+91 7007115675</p>
            <p className="text-gray-400">Mon-Fri, 9AM-6PM IST</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <FaWhatsapp className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">WhatsApp Support</h3>
            <p className="text-gray-400">+91 7007115675</p>
            <p className="text-gray-400">Quick Responses</p>
          </div>
        </div>

        {/* Support Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Submit a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/10 border border-gray-700 rounded-lg p-3 text-white"
                required
              >
                {supportCategories.map((category) => (
                  <option key={category.title} value={category.title}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Subject</label>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Message</label>
              <TextArea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Detailed description of your issue"
                rows={5}
              />
            </div>

            <MovingButton
              type="submit"
              disabled={loading}
              className="w-full"
              loading={loading}
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </MovingButton>
          </form>
        </div>
      </div>
    </div>
  );
} 