"use client";
import React, { useState } from "react";
import Line from "./effects/Line";
import SubHeading from "./headersComponent/SubHeading";
import Heading from "./headersComponent/Heading";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaXTwitter, FaEnvelope, FaPhone } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { MovingButton } from "./ui/moving-border";

const Footer = () => {
  const navigate = useRouter();
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter subscription logic here
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#0F172A]/95 text-white">
      <Line />
      
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-6 mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400">Stay updated with our latest courses and tech news</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-transparent border border-gray-600"
              required
            />
            <MovingButton>
              <button type="submit" className="whitespace-nowrap">
                Subscribe Now
              </button>
            </MovingButton>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-blue-400">@Robonauts</h2>
          <p className="text-gray-400">An Edtech platform for Engineering college</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              <a href="mailto:support@robonauts.edu" className="text-gray-400 hover:text-white">
                support@robonauts.edu
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-blue-400" />
              <a href="tel:+1234567890" className="text-gray-400 hover:text-white">
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>

        {/* Catalog Section */}
        <div className="space-y-4">
          <Heading value="Catalog" />
          <ul className="space-y-2">
            <li className="text-gray-400 hover:text-white cursor-pointer">College Works</li>
            <li className="text-gray-400 hover:text-white cursor-pointer">Web Development</li>
            <li className="text-gray-400 hover:text-white cursor-pointer">Mobile Development</li>
            <li className="text-gray-400 hover:text-white cursor-pointer">AI & Machine Learning</li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <Heading value="Resources" />
          <ul className="space-y-2">
            <li className="text-gray-400 hover:text-white cursor-pointer">Class Notes</li>
            <li className="text-gray-400 hover:text-white cursor-pointer">Assignments</li>
            <li className="text-gray-400 hover:text-white cursor-pointer">PYQs</li>
            <li className="text-gray-400 hover:text-white cursor-pointer">TextBooks</li>
            <li className="text-gray-400 hover:text-white cursor-pointer">Study Materials</li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className="space-y-6">
          <div>
            <Link href="/about">
              <button className="text-2xl text-gray-300 hover:text-white">
                About us
              </button>
            </Link>
          </div>
          <div className="space-y-4">
            <Heading value="Follow us on" />
            <div className="flex gap-4">
              <button
                onClick={() => navigate.push("https://x.com/Sushil_Sahani37")}
                className="text-gray-400 hover:text-white hover:scale-125 duration-300"
              >
                <FaXTwitter size={24} />
              </button>
              <button
                onClick={() => navigate.push("https://www.instagram.com/sushil______16")}
                className="text-gray-400 hover:text-white hover:scale-125 duration-300"
              >
                <FaInstagram size={24} />
              </button>
              <button
                onClick={() => navigate.push("https://www.linkedin.com/in/sushil-sahani-46235527b")}
                className="text-gray-400 hover:text-white hover:scale-125 duration-300"
              >
                <FaLinkedin size={24} />
              </button>
            </div>
          </div>
          <div className="pt-4">
            <Link href="/support" className="text-gray-400 hover:text-white">
              @support
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/faq" className="hover:text-white">FAQ</Link>
              <Link href="/careers" className="hover:text-white">Careers</Link>
            </div>
            <div className="text-sm text-gray-400">
              Copyright © 2024 Robonauts. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
