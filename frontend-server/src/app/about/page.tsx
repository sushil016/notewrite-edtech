'use client';
import React from 'react';
import { FaGraduationCap, FaUsers, FaLaptopCode, FaBook } from 'react-icons/fa';

const stats = [
  { icon: FaGraduationCap, label: 'Students', value: '10+' },
  { icon: FaUsers, label: 'Expert Teachers', value: '5+' },
  { icon: FaLaptopCode, label: 'Courses', value: '5+' },
  { icon: FaBook, label: 'Study Materials', value: '20+' },
];

const team = [
  {
    name: 'Sushil Sahani',
    role: 'Founder & CEO',
    image: '/path/to/image.jpg', // Add team member images
    bio: 'Engineering student passionate about education technology.',
  },
  // Add more team members as needed
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transforming Engineering Education
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Notewrite is dedicated to making quality engineering education accessible to students through innovative digital learning solutions.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
              <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            At Notewrite, we believe in empowering engineering students with comprehensive learning resources and cutting-edge educational tools. Our platform combines traditional engineering curriculum with modern learning methodologies to create an engaging and effective learning experience.
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-400 text-center mb-4">{member.role}</p>
                <p className="text-gray-400 text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-gray-300 mb-6">
            Have questions or want to learn more about Notewrite? We'd love to hear from you!
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="text-gray-300">
              <p className="font-semibold">Email:</p>
              <p>support@notewrite.com</p>
            </div>
            <div className="text-gray-300">
              <p className="font-semibold">Phone:</p>
              <p>+91 7007115675</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 