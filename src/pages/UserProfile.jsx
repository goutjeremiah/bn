import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Lock,
    Save,
    XCircle,
    CheckCircle,
    Edit,
    Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function UserProfile() {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'change_password'
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Profile Details
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
    const [profileUpdateError, setProfileUpdateError] = useState(null);
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);

    // State for Change Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);

            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUser(data);
                // Initialize the editable form data with the fetched user details
                setFormData({ name: data.name, email: data.email, country: data.country, city: data.city, address: data.address, phone: data.phone, state: data.state, zip: data.zip });
            } catch (err) {
                console.error("Failed to fetch user details:", err);
                setError(`Failed to load user details: ${err.message}`);
                toast.error(`Failed to load user details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token, navigate]);

    // Handle form field changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle profile update submission
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileUpdateLoading(true);
        setProfileUpdateError(null);
        setProfileUpdateSuccess(false);

        // Basic client-side validation
        if (!formData.name || !formData.email) {
            setProfileUpdateError('Name and email cannot be empty.');
            setProfileUpdateLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/me`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join(' ');
                    setProfileUpdateError(errorMessages);
                    toast.error(`Profile update failed: ${errorMessages}`);
                } else {
                    throw new Error(data.message || 'Failed to update profile.');
                }
                return;
            }

            // Update user state with the new data from the response
            setUser(data.user);
            setFormData({ name: data.user.name, email: data.user.email }); // Sync form data
            setProfileUpdateSuccess(true);
            setIsEditing(false); // Exit edit mode
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error("Profile update error:", err);
            setProfileUpdateError(err.message);
            toast.error(`Profile update failed: ${err.message}`);
        } finally {
            setProfileUpdateLoading(false);
        }
    };

    // Handle password change submission
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordChangeLoading(true);
        setPasswordChangeError(null);
        setPasswordChangeSuccess(false);

        // Basic client-side validation
        if (newPassword.length < 6) {
            setPasswordChangeError("New password must be at least 6 characters long.");
            setPasswordChangeLoading(false);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordChangeError("New password and confirmation do not match.");
            setPasswordChangeLoading(false);
            return;
        }
        if (!currentPassword) {
            setPasswordChangeError("Current password is required.");
            setPasswordChangeLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/me/password`, { // Assuming this endpoint
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmNewPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join(' ');
                    setPasswordChangeError(errorMessages);
                    toast.error(`Password change failed: ${errorMessages}`);
                } else {
                    throw new Error(data.message || 'Failed to change password.');
                }
                return;
            }

            setPasswordChangeSuccess(true);
            toast.success('Password changed successfully!');
            // Clear form fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            console.error("Password change error:", err);
            setPasswordChangeError(err.message);
            toast.error(`Password change failed: ${err.message}`);
        } finally {
            setPasswordChangeLoading(false);
        }
    };

    // Function to handle canceling the edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({ name: user.name, email: user.email });
        setProfileUpdateError(null);
        setProfileUpdateSuccess(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gray-100 font-inter flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500 h-8 w-8" />
                <p className="text-gray-700 text-lg ml-2">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-gray-100 font-inter flex items-center justify-center">
                <p className="text-red-600 text-lg">Error: {error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen w-full bg-gray-100 font-inter flex items-center justify-center">
                <p className="text-gray-700 text-lg">User data not available.</p>
            </div>
        );
    }

    return (
        <div className="mt-24">
            <div className="min-h-screen w-full bg-gray-100 font-inter p-4">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
                        {activeTab === 'profile' && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-accent transition"
                            >
                                <Edit size={16} className="mr-2" />
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${activeTab === 'profile'
                                ? 'text-accent border-b-2 border-accent'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={16} className="inline-block mr-2" /> Profile Details
                        </button>
                        <button
                            className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${activeTab === 'change_password'
                                ? 'text-accent border-b-2 border-accent'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('change_password')}
                        >
                            <Lock size={16} className="inline-block mr-2" /> Change Password
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="flex items-center justify-center mb-6">
                                    {user.profile_picture_url ? (
                                        <img
                                            src={user.profile_picture_url}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-semibold">
                                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    ) : (
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800">{user.name}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    ) : (
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800">{user.email}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    ) : (
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800">{user.phone}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    ) : (
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800">{user.address}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    ) : (
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800">{user.city}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    ) : (
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800">{user.state}</div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                        Country
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    ) : (
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800">{user.country}</div>
                                    )}
                                </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                                            Zip Code
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                id="zip"
                                                name="zip"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                                value={formData.zip}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        ) : (
                                            <div className="w-full px-3 py-2 bg-gray-100 rounded-md text-gray-800">{user.zip}</div>
                                        )}
                                    </div>
</div>


                                {isEditing && (
                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-accent transition duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={profileUpdateLoading}
                                        >
                                            {profileUpdateLoading ? (
                                                <Loader2 className="animate-spin mr-2" size={16} />
                                            ) : (
                                                <Save size={16} className="mr-2" />
                                            )}
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                                {profileUpdateError && (
                                    <p className="text-red-600 text-sm flex items-center">
                                        <XCircle size={16} className="mr-1" /> {profileUpdateError}
                                    </p>
                                )}
                                {profileUpdateSuccess && (
                                    <p className="text-green-600 text-sm flex items-center">
                                        <CheckCircle size={16} className="mr-1" /> Profile updated successfully!
                                    </p>
                                )}
                            </form>
                        )}

                        {activeTab === 'change_password' && (
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="current_password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="new_password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm_new_password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                {passwordChangeError && (
                                    <p className="text-red-600 text-sm flex items-center">
                                        <XCircle size={16} className="mr-1" /> {passwordChangeError}
                                    </p>
                                )}
                                {passwordChangeSuccess && (
                                    <p className="text-green-600 text-sm flex items-center">
                                        <CheckCircle size={16} className="mr-1" /> Password updated successfully!
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-blue-700 transition duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={passwordChangeLoading}
                                >
                                    {passwordChangeLoading ? (
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    ) : (
                                        <Save size={16} className="mr-2" />
                                    )}
                                    Change Password
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
