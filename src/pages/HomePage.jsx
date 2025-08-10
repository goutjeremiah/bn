import Hero from "../component/Hero";
import Products from "../component/Products";
import Features from "../component/Features";
import Faq from "../component/Faq";
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user') || null;
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            navigate('/user/dashboard');
        }
    }, []);
    return (
        <div>
            <Hero />
            <Products />
            <Features />
            <Faq />
        </div>
    );
}