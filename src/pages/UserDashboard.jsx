import { useState, useEffect } from 'react';
import {
  Menu,
  Inbox,
  ShoppingCart,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  Wallet,
  Send,
  ScanLine,
  Grid,
  Banknote,
  Award,
  Contact,
  LineChart
} from 'lucide-react';

import EditableText from '../component/EditableText'; // Assuming this component exists
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom is installed
import { formatNumber, formatCurrency } from '../utils/formatNumber'; // Assuming this utility function exists
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('accounts');

  // State to hold user details fetched from the API
  const [user, setUser] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for potential errors during API fetch
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Retrieve token and stored user from localStorage
  const token = localStorage.getItem('token');
  // const storedUser = JSON.parse(localStorage.getItem('user')) || null; // Not directly used in rendering, 'user' state is primary

  // Fetch user data when the component mounts or token changes
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Start loading
      setError(null);   // Clear previous errors

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json', // Ensure expecting JSON
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);

        // Calculate net worth only if accounts array exists and is not empty
        if (data.accounts && Array.isArray(data.accounts) && data.accounts.length > 0) {
          const totalNetWorth = data.accounts.reduce((total, account) => total + Number(account.balance), 0);
          // Ensure totalNetWorth is a number before toFixed
          setNetWorth(totalNetWorth.toFixed(2));
        } else {
          setNetWorth('0.00'); // Default to 0 if no accounts or empty
        }

      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setError(`Failed to load user details: ${err.message}`);
        // Optionally, show a toast notification here
        // toast.error(`Failed to load user details: ${err.message}`);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUser();
  }, [token, navigate]); // Depend on token and navigate

  // Initial editable states (can be removed if derived directly from 'user' state)
  // These were likely from a previous structure where balances were directly on User or hardcoded.
  // Now, they should be derived from the 'user.accounts' and 'user.credit_cards' arrays.
  // Keeping them for now, but consider removing or updating their source.
  const [netWorth, setNetWorth] = useState('0.00'); // Initialized to '0.00'
  // Removed checkingBalance, savingsBalance, creditCardBalance as they are now dynamic

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 font-inter flex items-center justify-center">
        <p className="text-gray-700 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 font-inter flex items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  // Render if user is null after loading (e.g., failed authentication but no explicit error message)
  if (!user) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 font-inter flex items-center justify-center">
        <p className="text-gray-700 text-lg">User data not available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-100 font-inter overflow-hidden">
      {/* Centered App container for mobile */}
      <div className="relative flex flex-col h-screen max-w-full bg-white">

        {/* Scrollable Main Content */}
        {/* Added optional chaining `user?.name` to prevent errors if user is temporarily null */}
        <div className="flex-1 overflow-y-auto pt-[112px] pb-[64px]">

          {/* Search Bar */}
          <div className="p-4">
            <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Hi I'm Erica. How can I help?"
                className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
              <div className="relative ml-2">
                <Bell size={20} className="text-red-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-3 w-3 flex items-center justify-center">4</span>
              </div>
            </div>
          </div>

          {activeTab === 'accounts' && (
            <>
              {/* Account Summary */}
              <div className="px-4 pb-4">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Hello, <span>{user?.name?.split(' ')[0]}</span> {/* Optional chaining for user and name */}
                    </h2>
                    <Link to="/user/transactions" className="text-blue-600">
                      <ChevronRight size={18} className="text-gray-400" />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Preferred Rewards Platinum Member</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <div className="flex items-center">
                        <Banknote size={16} className="text-gray-500 mr-2" />
                        <span>FBHT Life Plan®</span>
                      </div>
                      <Link to="/user/transactions" className="text-blue-600">
                        <ChevronRight size={16} className="text-gray-400" />
                      </Link>
                    </div>
                    <p className="text-xs text-blue-600 ml-6 -mt-2">Your next steps are ready. Let's go!</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-blue-600">Show Net Worth</span>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-800 mr-1">
                        {formatCurrency(netWorth)}
                      </span>
                      <LineChart size={18} className="text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking - Accounts Section */}
              <div className="px-4 pb-4">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">Banking</h2>
                    <Link to="/user/transactions" className="text-blue-600">
                      <ChevronRight size={18} className="text-gray-400" />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">FBHT</p>
                  {/* Safely iterate over accounts using optional chaining and length check */}
                  {user.accounts && user.accounts.length > 0 ? (
                    <div className="space-y-3">
                      {user.accounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between text-sm text-gray-700 py-2 border-b border-gray-100">
                          <div>
                            <p className="font-medium">{account.account_name} - {account.account_number.slice(-4)}</p> {/* Display last 4 digits */}
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-800 mr-1">
                              {formatCurrency(parseFloat(account.balance).toFixed(2))} {/* Format balance */}
                            </span>
                            <Link to="/user/transactions" className="text-blue-600">
                              <ChevronRight size={16} className="text-gray-400" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No bank accounts found.</p>
                  )}
                </div>
              </div>

              {/* Credit Cards Section */}
              <div className="px-4 pb-4">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">Credit Cards</h2>
                    <Link to="/user/transactions" className="text-blue-600">
                      <ChevronRight size={18} className="text-gray-400" />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">FBHT</p>

                  {/* Safely iterate over credit_cards using optional chaining and length check */}
                  {user.credit_cards && user.credit_cards.length > 0 ? (
                    <div className="space-y-3">
                      {user.credit_cards.map((creditCard) => (
                        <div key={creditCard.id} className="flex items-center justify-between text-sm text-gray-700 py-2 border-b border-gray-100">
                          <div>
                            <p className="font-medium">
                              {creditCard.card_type} - {creditCard.card_number ? creditCard.card_number.slice(-4) : 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Expires: {creditCard.expiration_month}/{creditCard.expiration_year}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-800 mr-1">
                              {formatCurrency(parseFloat(creditCard.current_debt).toFixed(2))} {/* Format current_debt */}
                            </span>
                            <Link to="/user/transactions" className="text-blue-600">
                              <ChevronRight size={16} className="text-gray-400" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No credit cards found.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'dashboard' && (
            <div className="p-4 text-center text-gray-500">
              <p>You're not subscribed to this feature.</p>
              <p>Please contact admin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
