'use client';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
  {
    question: 'What is Notewrite?',
    answer: 'Notewrite is an educational platform specifically designed for engineering students, offering comprehensive course materials, study resources, and interactive learning experiences.'
  },
  {
    question: 'How do I access the course materials?',
    answer: 'After enrolling in a course, you can access all materials through your dashboard. Materials include video lectures, notes, assignments, and additional resources.'
  },
  {
    question: 'Are the courses self-paced?',
    answer: 'Yes, all courses are self-paced. You can learn at your own speed and access the materials whenever it\'s convenient for you.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including credit/debit cards, UPI, and net banking through our secure payment gateway Razorpay.'
  },
  {
    question: 'Can I download the study materials?',
    answer: 'Yes, most study materials are available for download, allowing you to study offline. However, video content is only available for streaming.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 7-day money-back guarantee for all courses. Please refer to our refund policy for more details.'
  },
  {
    question: 'How do I become an instructor?',
    answer: 'To become an instructor, you need to apply through our teacher application process. We review each application carefully to maintain quality standards.'
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Currently, we offer a mobile-responsive website. A dedicated mobile app is under development and will be released soon.'
  }
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-gray-700">
    <button
      className="w-full py-6 flex justify-between items-center focus:outline-none"
      onClick={onClick}
    >
      <span className="text-lg font-medium text-white">{question}</span>
      {isOpen ? (
        <FaChevronUp className="text-blue-400" />
      ) : (
        <FaChevronDown className="text-blue-400" />
      )}
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 mb-6' : 'max-h-0'
      }`}
    >
      <p className="text-gray-400">{answer}</p>
    </div>
  </div>
);

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400">
            Find answers to common questions about Notewrite
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            Still have questions? Contact our support team at{' '}
            <a
              href="mailto:support@notewrite.com"
              className="text-blue-400 hover:text-blue-300"
            >
              support@notewrite.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 