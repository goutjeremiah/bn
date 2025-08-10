import { Link } from 'react-router-dom';
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
              <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="shadow appearance-none rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline focus:ring-accent focus:ring-1"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="shadow appearance-none rounded w-full py-2 px-3 text-primary mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-accent focus:ring-1"
                    placeholder="********"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-500"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account? <Link to="/register" className="text-primary hover:text-accent">Register</Link>
                </p>
              </form>
            </div>
          </div>
        );
}