import { ShieldCheck, Smartphone, Banknote, Headset } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-boa-accent" />,
    title: 'Top-tier Security',
    desc: 'Bank with confidence. We use industry-standard encryption and fraud protection to keep your money safe.',
  },
  {
    icon: <Smartphone className="w-8 h-8 text-boa-accent" />,
    title: 'Easy Mobile Access',
    desc: 'Manage your accounts, send money, and pay bills right from your phone — anytime, anywhere.',
  },
  {
    icon: <Banknote className="w-8 h-8 text-boa-accent" />,
    title: 'Smart Financial Tools',
    desc: 'Track your spending, set savings goals, and get personalized insights to help you grow.',
  },
  {
    icon: <Headset className="w-8 h-8 text-boa-accent" />,
    title: '24/7 Customer Support',
    desc: `Reach us anytime by phone, chat, or email. We're here to help, day or night.`,
  },
];

export default function Features() {
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
    <>
        <div className="bg-transparent rounded-xl shadow-md p-6 w-full max-w-sm mx-auto md:mx-0 md:hidden">
          <h2 className="text-xl font-semibold text-dark mb-4 text-center">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent border-dark bg-transparent placeholder:text-dark/80 text-dark"
                placeholder="you@example.com"
                name="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent border-dark bg-transparent placeholder:text-dark/80 text-dark"
                placeholder="••••••••"
                name="password"
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-transparent border border-dark text-dark py-2 rounded-md font-semibold hover:bg-accent hover:text-white hover:border-accent transition"
            >
              Log In
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
              )}
            </button>
          </form>
          <p className="text-sm text-dark mt-4 text-center">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-dark hover:text-accent font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-boa-primary mb-4">
          Everything You Need in One App
        </h2>
        <p className="text-boa-text max-w-2xl mx-auto mb-12">
          From secure transactions to smart budgeting, our app puts complete control of your finances in your hands.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <div
              key={index}
              className="bg-boa-light rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4 flex justify-center">{feat.icon}</div>
              <h3 className="text-lg font-semibold text-boa-primary mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-boa-text">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
