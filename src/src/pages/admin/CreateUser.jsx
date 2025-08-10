import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function CreateUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [balance, setBalance] = useState(0);
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('balance', balance.toString());
        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Failed to create user');
                return
            }

            toast.success('User created successfully!');
            setName('');
            setEmail('');
            setPassword('');
            setBalance(0);
            setProfilePicture(null);
        } catch (error) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-16 p-6">
            <div className="mb-4 flex flex-col items-start">
                <p className="text-gray-700"><Link to="/admin" className="text-primary hover:underline hover:text-accent">Dashboard</Link> / Create User</p>
                <h1 className="text-xl font-bold text-center">Create User</h1>
            </div>
            <div className="mt-6 flex justify-center">
                <div className="p-4 bg-white rounded shadow w-full md:w-1/2">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="balance" className="block text-gray-700 font-bold mb-2">
                                Balance
                            </label>
                            <input
                                type="number"
                                id="balance"
                                value={balance}
                                onChange={(e) => setBalance(Number(e.target.value))}
                                className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="profilePicture" className="block text-gray-700 font-bold mb-2">
                                Profile Picture (optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-accent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
