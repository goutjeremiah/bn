"use client"

import { Link } from 'react-router-dom';
import heroImage from '../assets/img2.jpg';
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function Hero() {
    const navigate = useNavigate();
  
    const [ data, setData ] = useState( {
      email: "",
      password: "",
    } );
  
    const [ loading, setLoading ] = useState( false );
  
    const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
      setData( {
        ...data,
        [ e.target.name ]: e.target.value,
      } );
    };
  
    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
      e.preventDefault();
  
      // You can remove this code block
      setLoading( true );
  
      const response = await fetch( `${import.meta.env.VITE_BACKEND_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( data ),
      } );
  
      const result = await response.json();
  
      setLoading( false );
      if ( response.status === 400 || response.status === 401 ) {
        toast.error( "Invalid Email or Password" );
      }
      if ( response.status === 200 ) {
        toast.success( result.message );
        localStorage.setItem( "user", JSON.stringify( result.user ) );
        localStorage.setItem("token", result.token)
        if ( result.user.role == "user"){
          navigate( "/user/dashboard" );
        }
        else{
          navigate("/admin");
        }
      }
    };
  return (
    <section
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-16">
        {/* Left Text */}
        <div className="text-white text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Secure Banking<br className="hidden sm:block" /> at Your Fingertips
          </h1>
          <p className="text-lg mb-8 max-w-md mx-auto md:mx-0 text-white/80">
            Manage your money with ease. Track transactions, send payments, and access top-tier customer support — all in one app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {/* <Link
              to="/signup"
              className="bg-transparent border border-accent text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-accent hover:text-white transition"
            >
              Open an Account
            </Link> */}
            {/* <Link
              to="/login"
              className="text-white hover:text-primary text-sm font-semibold underline underline-offset-2"
            >
              Already a customer?
            </Link> */}
          </div>
        </div>

        {/* Right Login Form */}
        <div className="bg-transparent border border-white rounded-xl shadow-md p-6 w-full max-w-sm mx-auto md:mx-0 hidden md:block">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md ring-white border-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent border-none bg-transparent placeholder:text-white/80 text-white"
                placeholder="you@example.com"
                name="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent border-none bg-transparent placeholder:text-white/80 text-white"
                placeholder="••••••••"
                name="password"
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-transparent border border-white text-white py-2 rounded-md font-semibold hover:bg-accent hover:text-white hover:border-accent transition"
            >
              Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
            </button>
          </form>
          <p className="text-sm text-white mt-4 text-center">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-white hover:text-accent font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

