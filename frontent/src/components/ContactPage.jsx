import React, { useState } from 'react'
import { contactStyles } from "../assests/dummyStyles"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import {
  Ticket,
  MessageCircle,
  Send,
  Phone,
  Mail,
  MapPin,
  Popcorn
} from "lucide-react"

const ContactPage = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.phone || formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    const whatsappMessage =
      `Name: ${encodeURIComponent(formData.name)}%0A` +
      `Email: ${encodeURIComponent(formData.email)}%0A` +
      `Phone: ${encodeURIComponent(formData.phone)}%0A` +
      `Subject: ${encodeURIComponent(formData.subject)}%0A` +
      `Message: ${encodeURIComponent(formData.message)}`;

    window.open(`https://wa.me/8299431275?text=${whatsappMessage}`, '_blank');
    toast.success("Opening WhatsApp...");
  };

  return (
    <div className={contactStyles.pageContainer}>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />

      {/* Animated Red Hover Background */}
      <div className="absolute inset-0 bg-red-600 opacity-5 blur-3xl hover:opacity-10 transition-all duration-500"></div>

      <div className="flex flex-col items-center justify-center min-h-screen py-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-wide">
            <span className="text-red-600">Contact</span>
            <span className="text-white"> Us</span>
          </h1>

          <p className="text-gray-400 mt-3 max-w-xl">
            Have questions about movie booking or special events?  
            Our team is here to help you anytime.
          </p>
        </div>

        {/* MAIN FLEX CONTAINER */}
        <div className="flex flex-wrap gap-8 justify-center items-start w-full max-w-6xl px-4">

          {/* FORM CARD */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-xl hover:shadow-red-600/20 transition-all duration-300 w-full md:w-[60%]">

            <div className="flex items-center gap-2 text-red-500 mb-4">
              <Ticket />
              <span className="font-semibold">BOOKING SUPPORT</span>
            </div>

            <h2 className="text-xl text-white flex items-center gap-2 mb-6">
              <MessageCircle /> Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600 transition"
                placeholder="Full Name"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600 transition"
                placeholder="Email Address"
              />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength={10}
                className="p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600 transition"
                placeholder="10 digit Phone Number"
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600 transition"
              >
                <option value="">Select a subject</option>
                <option value="Ticket Booking">Ticket Booking</option>
                <option value="Group Events">Group Events</option>
                <option value="Membership">Membership Inquiry</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Refund">Refund Request</option>
                <option value="Other">Other</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600 transition"
                placeholder="Describe your inquiry..."
              ></textarea>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                Send via WhatsApp
                <Send />
              </button>

            </form>
          </div>

          {/* INFO CARD */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-xl hover:shadow-red-600/20 transition-all duration-300 w-full md:w-[35%]">

            <div className="flex items-center gap-2 text-red-500 mb-4">
              <Popcorn />
              <span className="font-semibold">CINEMA INFO</span>
            </div>

            <h2 className="text-xl text-white mb-6">
              Contact Information
            </h2>

            <div className="flex flex-col gap-4 text-gray-300">

              <div className="flex items-center gap-3 hover:text-red-500 transition">
                <Phone />
                +9878787878
              </div>

              <div className="flex items-center gap-3 hover:text-red-500 transition">
                <Mail />
                booking@contact.com
              </div>

              <div className="flex items-center gap-3 hover:text-red-500 transition">
                <MapPin />
                123 Cinema Street, Mumbai
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default ContactPage
