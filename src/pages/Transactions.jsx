import { useState, useEffect } from 'react';
import {
    CircleDollarSign,
    Loader2,
    Wallet,
    Calendar,
    ArrowUpFromDot,
    ArrowDownToDot,
    Banknote,
    BadgeAlert,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatNumber';

// This component displays a list of all transactions for the logged-in user.
export default function UserTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the auth token from local storage
    const token = localStorage.getItem('token');

    // Fetch user transactions from the backend API
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch transactions.');
                }

                const data = await response.json();
                setTransactions(data.transactions);
                setError(null);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                toast.error(err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [token]);

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500">
                <Loader2 size={32} className="animate-spin mr-2" />
                <p>Loading transactions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-red-500 bg-red-100 rounded-lg shadow-sm">
                <BadgeAlert size={48} className="mb-4" />
                <p className="text-lg font-bold">Error</p>
                <p className="text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg mt-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                <CircleDollarSign className="mr-3" size={36} />
                My Transactions
            </h1>

            {transactions.length > 0 ? (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                >
                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700 font-semibold">
                                        {transaction.description}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 font-mono">
                                        <span className={
                                            `font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`
                                        }>
                                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700 font-mono">
                                        {formatCurrency(transaction.new_balance)}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                        <span className={
                                            `px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                             ${transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                                        }>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-500 text-sm">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">
                        You have no transactions to display.
                    </p>
                </div>
            )}
        </div>
    );
}
