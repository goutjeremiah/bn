import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    Edit,
    Trash2,
    X,
    Info,
    CheckCircle,
    AlertCircle,
    Loader2,
} from 'lucide-react'; // Added icons for the modal and buttons


export default function UserDetails() {
    const { id } = useParams();
    const [details, setDetails] = useState({});
    const [account, setAccount] = useState({}); // for new account
    const [creditCard, setCreditCard] = useState({}); // for new credit card
    const [transaction, setTransaction] = useState({}); // for new transaction
    // State to track which account ID is currently being edited
    const [editingAccountId, setEditingAccountId] = useState(null);
    // State to hold the temporary data for the account being edited
    const [editingCardId, setEditingCardId] = useState(null);
    const [editingTransactionId, setEditingTransactionId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransactionId, setDeletingTransactionId] = useState(null);
    const [editedAccountData, setEditedAccountData] = useState({});
    const [editedCardData, setEditedCardData] = useState({});
    const [editedTransactionData, setEditedTransactionData] = useState({});
    const [notification, setNotification] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("details"); // New state for active tab
    const token = localStorage.getItem("token");

    // Function to handle form submission for updating user details
    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", details.name);
        formData.append("email", details.email);
        formData.append("password", details.password);
        if (details.profilePicture) {
            formData.append("profile_picture", details.profilePicture);
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    method: "POST", // Or 'PUT'/'PATCH' depending on your API
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to update user");
                return;
            }

            toast.success("User updated successfully!");
        } catch (error) {
            toast.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("account_name", account.account_name);
        formData.append("balance", account.balance);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}/accounts`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "POST",
                body: formData,
            }
        );
        const data = await response.json();
        if (!response.ok) {
            toast.error(data.message || "Failed to create account");
            return;
        }
        toast.success("Account created successfully!");
        getUser();
        setAccount({});
    };

    const handleCreateCard = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("card_holder_name", creditCard.card_holder_name);
        formData.append("expiration_month", creditCard.expiration_month);
        formData.append("expiration_year", creditCard.expiration_year);
        formData.append("cvv", creditCard.cvv);
        formData.append("card_type", creditCard.card_type);
        formData.append("credit_limit", creditCard.credit_limit);
        formData.append("current_debt", creditCard.current_debt);
        formData.append("account_id", creditCard.account_id);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}/credit-cards`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "POST",
                body: formData,
            }
        );
        const data = await response.json();
        if (!response.ok) {
            toast.error(data.message || "Failed to create credit card");
            return;
        }
        toast.success("Credit card created successfully!");
        getUser();
        setCreditCard({});
    };

    const handleCreateTransaction = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("amount", transaction.amount);
        formData.append("new_balance", transaction.new_amount)
        formData.append("description", transaction.type);
        formData.append("date", transaction.date);
        formData.append("account_id", transaction.account_id);
        formData.append("type", transaction.type);

        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}/transactions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "POST",
                body: formData,
            }
        );
        const data = await response.json();
        if (!response.ok) {
            toast.error(data.message || "Failed to create transaction");
            return;
        }
        toast.success("Transaction created successfully!");
        getUser();
        setTransaction({});
    };

    const handleCreateNotification = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", notification.title);
        formData.append("message", notification.message);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}/notifications`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "POST",
                body: formData,
            }
        );
        const data = await response.json();
        if (!response.ok) {
            toast.error(data.message || "Failed to create notification");
            return;
        }
        toast.success("Notification created successfully!");
        getUser();
        setNotification({});
    };

    // Function to handle changes in the input fields when editing
    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setEditedAccountData({ ...editedAccountData, [name]: value });
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setEditedCardData({ ...editedCardData, [name]: value });
    };

    // Function to set a row into editing mode
    const handleAccountEdit = (account) => {
        setEditingAccountId(account.id);
        setEditedAccountData({ ...account }); // Copy the current account data to the editing state
    };

    const handleCardEdit = (card) => {
        setEditingCardId(card.id);
        setEditedCardData({ ...card });
    };

    // Function to cancel editing
    const handleCancelClick = () => {
        setEditingAccountId(null); // Exit editing mode
        setEditedAccountData({}); // Clear edited data
        setEditingCardId(null);
        setEditedCardData({});
    };

    // This function will be called by handleSaveClick
    const handleAccountUpdate = async (accountId) => {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL
            }/accounts/${accountId}/admin`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedAccountData),
            }
        );
        if (!response.ok) {
            toast.error("Failed to update account");
            return;
        }
        toast.success("Account updated successfully!");
        getUser();
        setEditingAccountId(null);
        setEditedAccountData({});
    };

    const handleCardUpdate = async (cardId) => {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/credit-cards/${cardId}/admin`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedCardData),
            }
        );
        if (!response.ok) {
            toast.error("Failed to update card");
            return;
        }
        toast.success("Card updated successfully!");
        getUser();
        setEditingCardId(null);
        setEditedCardData({});
    };

    const handleCardDelete = async (cardId) => {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/cards/${cardId}/admin`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        if (!response.ok) {
            toast.error("Failed to delete card");
            return;
        }
        setDetails((prevDetails) => ({
            ...prevDetails,
            cards: prevDetails.cards.filter((card) => card.id !== cardId),
        }));
        toast.success("Card deleted successfully!");
    };

    // Placeholder for your delete logic
    const handleDeleteClick = async (accountId) => {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL
            }/accounts/${accountId}/admin`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        if (!response.ok) {
            toast.error("Failed to delete account");
            return;
        }
        setDetails((prevDetails) => ({
            ...prevDetails,
            accounts: prevDetails.accounts.filter(
                (acc) => acc.id !== accountId
            ),
        }));
        toast.success("Account deleted successfully!");
    };

    // Handles opening the edit modal with the selected transaction's data
    const handleTransactionEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsEditModalOpen(true);
    };

    // Handles opening the delete confirmation modal
    const handleTransactionDelete = (id) => {
        setDeletingTransactionId(id);
        setIsDeleteModalOpen(true);
    };

    // Handles form changes in the edit modal
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditingTransaction((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handles the submission of the edit form
    const handleUpdateTransaction = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}/transactions/${editingTransaction.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editingTransaction),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update transaction.');
            }

            // Optimistically update the UI with the new data
            setDetails(prev => ({
                ...prev,
                transactions: prev.transactions.map(t =>
                    t.id === editingTransaction.id ? { ...t, ...editingTransaction } : t
                ),
            }));

            toast.success('Transaction updated successfully!');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Update transaction error:', error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    // Handles the deletion of a transaction
    const handleDeleteTransaction = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}/transactions/${deletingTransactionId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Failed to delete transaction.');
            }

            // Optimistically remove the transaction from the UI
            setDetails(prev => ({
                ...prev,
                transactions: prev.transactions.filter(
                    (t) => t.id !== deletingTransactionId
                ),
            }));

            toast.success('Transaction deleted successfully!');
            setIsDeleteModalOpen(false);
            setDeletingTransactionId(null);
        } catch (error) {
            console.error('Delete transaction error:', error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };



    const getUser = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_API_URL}/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    method: "GET",
                }
            );
            const data = await response.json();
            if (response.ok) {
                setDetails(data);
            } else {
                toast.error(data.message || "Failed to fetch user details.");
            }
        } catch (error) {
            toast.error(
                error.message || "An error occurred while fetching user data."
            );
        } finally {
            setLoading(false);
        }
    };
    // Effect to fetch user data when the component mounts or ID changes
    useEffect(() => {
        getUser();
    }, [id, token]); // Add token to dependency array if it can change

    // Function to render content based on the active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case "details":
                return (
                    // User Details Form (Existing Content)
                    <div className="p-4 bg-white rounded shadow w-full md:w-1/2">
                        <form onSubmit={handleSubmitDetails}>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-gray-700 font-bold mb-2"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={details.name}
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            name: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 font-bold mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={details.email}
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            email: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-gray-700 font-bold mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={details.password}
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            password: e.target.value,
                                        })
                                    }
                                    className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="profilePicture"
                                    className="block text-gray-700 font-bold mb-2"
                                >
                                    Profile Picture (optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setDetails({
                                            ...details,
                                            profilePicture:
                                                e.target.files?.[0] || null,
                                        })
                                    }
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-accent"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                            >
                                {loading ? "Updating..." : "Update"}
                            </button>
                        </form>
                    </div>
                );
            case "accounts":
                return (
                    // Mock Transaction History Content
                    <div className="p-4 bg-white rounded shadow w-full animate-fade-in flex flex-col justify-center items-center">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-start w-full">
                            Accounts
                        </h3>
                        <div className="space-y-4 w-full md:w-1/2 my-6 shadow rounded p-4">
                            <form onSubmit={handleCreateAccount}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="accountName"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Account Name
                                    </label>
                                    <input
                                        type="text"
                                        id="accountName"
                                        value={account.account_name}
                                        onChange={(e) =>
                                            setAccount({
                                                ...account,
                                                account_name: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="accountBalance"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Account Balance
                                    </label>
                                    <input
                                        type="text"
                                        id="accountBalance"
                                        value={account.balance}
                                        onChange={(e) =>
                                            setAccount({
                                                ...account,
                                                balance: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create New Account"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Account Number
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Account Name
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Balance
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                {details.accounts && details.accounts.length > 0 && (
                                    <tbody>
                                        {details.accounts.map((account) => (
                                            <tr
                                                key={account.id}
                                                className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                            >
                                                {editingAccountId === account.id ? (
                                                    // Render input fields when in editing mode
                                                    <>
                                                        <td className="py-3 px-4 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                name="account_number"
                                                                value={
                                                                    editedAccountData.account_number ||
                                                                    ""
                                                                }
                                                                onChange={
                                                                    handleAccountChange
                                                                }
                                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                name="account_name"
                                                                value={
                                                                    editedAccountData.account_name ||
                                                                    ""
                                                                }
                                                                onChange={
                                                                    handleAccountChange
                                                                }
                                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4 border-b border-gray-200">
                                                            <input
                                                                type="text"
                                                                name="balance"
                                                                value={
                                                                    editedAccountData.balance ||
                                                                    ""
                                                                }
                                                                onChange={
                                                                    handleAccountChange
                                                                }
                                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4 border-b border-gray-200">
                                                            <button
                                                                onClick={() =>
                                                                    handleAccountUpdate(
                                                                        account.id
                                                                    )
                                                                }
                                                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 mx-1"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={
                                                                    handleCancelClick
                                                                }
                                                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 mx-1"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    // Render text fields when in view mode
                                                    <>
                                                        <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                            {account.account_number}
                                                        </td>
                                                        <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                            {account.account_name}
                                                        </td>
                                                        <td className="py-3 px-4 border-b border-gray-200 text-green-600">
                                                            ${account.balance}
                                                        </td>
                                                        <td className="py-3 px-4 border-b border-gray-200">
                                                            <button
                                                                onClick={() =>
                                                                    handleAccountEdit(
                                                                        account
                                                                    )
                                                                }
                                                                className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 mx-1"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        account.id
                                                                    )
                                                                }
                                                                className="bg-accent hover:bg-text text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 mx-1"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                                {details.accounts && (
                                    <tbody>
                                        <tr>
                                            <td colSpan="4" className="py-3 px-4 border-b text-center border-gray-200 text-gray-700">
                                                No accounts found
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                );
            case "credit-cards":
                return (
                    <div className="p-4 bg-white rounded shadow w-full animate-fade-in flex flex-col justify-center items-center">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-start w-full">
                            Credit Cards
                        </h3>
                        <div className="space-y-4 w-full md:w-2/3 my-6 shadow rounded p-4">
                            <form onSubmit={handleCreateCard} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="mb-4">
                                    <label
                                        htmlFor="cardHolderName"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Card Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        id="cardHolderName"
                                        value={creditCard.card_holder_name}
                                        onChange={(e) =>
                                            setCreditCard({
                                                ...creditCard,
                                                card_holder_name:
                                                    e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="expirationMonth"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Expiration Month
                                    </label>
                                    <input
                                        type="text"
                                        id="expirationMonth"
                                        value={creditCard.expiration_month}
                                        onChange={(e) =>
                                            setCreditCard({
                                                ...creditCard,
                                                expiration_month:
                                                    e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                        placeholder="MM"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="expirationYear"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Expiration Year
                                    </label>
                                    <input
                                        type="text"
                                        id="expirationYear"
                                        value={creditCard.expiration_year}
                                        onChange={(e) =>
                                            setCreditCard({
                                                ...creditCard,
                                                expiration_year: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                        placeholder="YYYY"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="cvv"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        value={creditCard.cvv}
                                        onChange={(e) =>
                                            setCreditCard({
                                                ...creditCard,
                                                cvv: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                        placeholder="CVV"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="cardType"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Card Type
                                    </label>
                                    <input
                                        type="text"
                                        id="cardType"
                                        value={creditCard.card_type}
                                        onChange={(e) =>
                                            setCreditCard({
                                                ...creditCard,
                                                card_type: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        placeholder="Card Type"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="creditLimit"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Credit Limit
                                    </label>
                                    <input
                                        type="number"
                                        id="creditLimit"
                                        value={creditCard.credit_limit}
                                        onChange={(e) =>
                                            setCreditCard({
                                                ...creditCard,
                                                credit_limit: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        placeholder="Credit Limit"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="currentDebt"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Current Debt
                                    </label>
                                    <input
                                        type="number"
                                        id="currentDebt"
                                        value={creditCard.current_debt}
                                        onChange={(e) =>
                                            setCreditCard({
                                                ...creditCard,
                                                current_debt: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        placeholder="Current Debt"
                                    />
                                </div>
                                <div className="flex gap-4 justify-end col-span-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="md:w-auto w-full bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create New Credit Card"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Card Number
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Card Holder Name
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Expiration Date
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            CVV
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Card Type
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Credit Limit
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Current Debt
                                        </th>
                                        <th className="py-3 px-4 border-b border-gray-200">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                {details.credit_cards && details.credit_cards.length > 0 && (
                                <tbody>
                                    {details.credit_cards.map((creditCard) => (
                                        <tr
                                            key={creditCard.id}
                                            className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                        >
                                            {editingCardId === creditCard.id ? (
                                                // Render input fields when in editing mode
                                                <>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            name="card_number"
                                                            value={
                                                                editedCardData.card_number ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleCardChange
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            name="card_holder_name"
                                                            value={
                                                                editedCardData.card_holder_name ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleCardChange
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            name="expiration_month"
                                                            value={
                                                                editedCardData.expiration_month ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleCardChange
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            name="expiration_year"
                                                            value={
                                                                editedCardData.expiration_year ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleCardChange
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            name="cvv"
                                                            value={
                                                                editedCardData.cvv ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleCardChange
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            name="card_type"
                                                            value={
                                                                editedCardData.card_type ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleCardChange
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            name="credit_limit"
                                                            value={
                                                                editedCardData.credit_limit ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleCardChange
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <input
                                                            type="text"
                                                            name="current_debt"
                                                            value={
                                                                editedCardData.current_debt ||
                                                                ""
                                                            }
                                                            onChange={
                                                                handleCardChange
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <button
                                                            onClick={() =>
                                                                handleCardUpdate(
                                                                    creditCard.id
                                                                )
                                                            }
                                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 mx-1"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={
                                                                handleCancelClick
                                                            }
                                                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 mx-1"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                // Render text fields when in view mode
                                                <>
                                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                        {creditCard.card_number}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                        {creditCard.card_holder_name}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                        {creditCard.expiration_month}/{creditCard.expiration_year}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                        {creditCard.cvv}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                        {creditCard.card_type}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200 text-green-600">
                                                        ${creditCard.credit_limit}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200 text-green-600">
                                                        ${creditCard.current_debt}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-200">
                                                        <button
                                                            onClick={() =>
                                                                handleCardEdit(
                                                                    creditCard
                                                                )
                                                            }
                                                            className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 mx-1"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleCardDelete(
                                                                    creditCard.id
                                                                )
                                                            }
                                                            className="bg-accent hover:bg-text text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 mx-1"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                                )}
                                {details.credit_cards && (
                                    <tbody>
                                        <tr>
                                            <td colSpan="8" className="py-3 px-4 border-b text-center border-gray-200 text-gray-700">
                                                No credit cards found
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                );
            case "transactions":
                return (
                    <div className="p-4 bg-white rounded shadow w-full animate-fade-in flex flex-col justify-center items-center">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-start w-full">
                            Transactions
                        </h3>
                        <div className="space-y-4 w-full md:w-2/3 my-6 shadow rounded p-4">
                            <form onSubmit={handleCreateTransaction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="mb-4">
                                    <label
                                        htmlFor="amount"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Amount
                                    </label>
                                    <input
                                        type="text"
                                        id="amount"
                                        value={transaction.amount}
                                        onChange={(e) =>
                                            setTransaction({
                                                ...transaction,
                                                amount:
                                                    e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="newAmount"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        New Amount
                                    </label>
                                    <input
                                        type="text"
                                        id="newAmount"
                                        value={transaction.new_amount}
                                        onChange={(e) =>
                                            setTransaction({
                                                ...transaction,
                                                new_amount:
                                                    e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                        
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="description"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        type="text"
                                        id="description"
                                        value={transaction.description}
                                        onChange={(e) =>
                                            setTransaction({
                                                ...transaction,
                                                description: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                        placeholder="Description"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="date"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={transaction.date}
                                        onChange={(e) =>
                                            setTransaction({
                                                ...transaction,
                                                date: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                        placeholder="DD-MM-YYYY"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="account"
                                        className="block text-gray-700 font-bold mb-2"
                                        >
                                        Account
                                    </label>
                                    <select
                                        id="account"
                                        onChange={(e) =>
                                            setTransaction({
                                                ...transaction,
                                                account_id: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        placeholder="Account"
                                    >
                                        <option value="">Select Account</option>
                                        {details.accounts.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.account_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                        
                                    <label htmlFor="type" className="block text-gray-700 font-bold mb-2">Type</label>
                                    <select
                                        id="type"
                                        onChange={(e) =>
                                            setTransaction({
                                                ...transaction,
                                                type: e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        placeholder="Type"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 justify-end col-span-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="md:w-auto w-full bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create New Transaction"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                        <th className="py-3 px-4 border-b border-gray-200">Account Number</th>
                                        <th className="py-3 px-4 border-b border-gray-200">Account Name</th>
                                        <th className="py-3 px-4 border-b border-gray-200">Amount</th>
                                        <th className="py-3 px-4 border-b border-gray-200">New Balance</th>
                                        <th className="py-3 px-4 border-b border-gray-200">Type</th>
                                        <th className="py-3 px-4 border-b border-gray-200">Date</th>
                                        <th className="py-3 px-4 border-b border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                {details.transactions && details.transactions.length > 0 && (
                                    <tbody>
                                        {details.transactions.map((transaction) => (
                                            <tr
                                                key={transaction.id}
                                                className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                            >
                                                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                    {transaction.account.account_number}
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                    {transaction.account.account_name}
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                    {transaction.amount}
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                    {transaction.new_balance}
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                    {transaction.type}
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200 text-green-600">
                                                    {transaction.date}
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200 flex space-x-2">
                                                    <button
                                                        onClick={() => handleTransactionEdit(transaction)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleTransactionDelete(transaction.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                                {details.transactions && details.transactions.length === 0 && (
                                    <tbody>
                                        <tr>
                                            <td colSpan="7" className="py-3 px-4 border-b text-center border-gray-200 text-gray-700">
                                                No transactions found
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>

                            {/* Edit Transaction Modal */}
                            {isEditModalOpen && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                                    <div className="relative p-8 bg-white w-96 rounded-lg shadow-xl">
                                        <div className="flex justify-between items-center pb-3">
                                            <h3 className="text-xl font-bold text-gray-900">Edit Transaction</h3>
                                            <button
                                                onClick={() => setIsEditModalOpen(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <form onSubmit={handleUpdateTransaction}>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={editingTransaction?.amount || ''}
                                                    onChange={handleFormChange}
                                                    step="0.01"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    New Balance
                                                </label>
                                                <input
                                                    type="number"
                                                    name="new_balance"
                                                    value={editingTransaction?.new_balance || ''}
                                                    onChange={handleFormChange}
                                                    step="0.01"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    value={editingTransaction?.description || ''}
                                                    onChange={handleFormChange}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Type
                                                </label>
                                                <select
                                                    name="type"
                                                    value={editingTransaction?.type || ''}
                                                    onChange={handleFormChange}
                                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                >
                                                    <option value="credit">Credit</option>
                                                    <option value="debit">Debit</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        'Save Changes'
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditModalOpen(false)}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Delete Confirmation Modal */}
                            {isDeleteModalOpen && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                                    <div className="relative p-8 bg-white w-96 rounded-lg shadow-xl text-center">
                                        <div className="pb-3">
                                            <AlertCircle size={48} className="mx-auto text-red-500" />
                                            <h3 className="text-xl font-bold text-gray-900 mt-4">Confirm Deletion</h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Are you sure you want to delete this transaction? This action cannot be undone.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between space-x-2 mt-4">
                                            <button
                                                onClick={handleDeleteTransaction}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Loader2 size={16} className="mx-auto animate-spin" />
                                                ) : (
                                                    'Delete'
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setIsDeleteModalOpen(false)}
                                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            case "notification":
                return (
                    <div className="p-4 bg-white rounded shadow w-full animate-fade-in flex flex-col justify-center items-center">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-start w-full">
                            Notification
                        </h3>
                        <div className="space-y-4 w-full md:w-2/3 my-6 shadow rounded p-4">
                            <form onSubmit={handleCreateNotification} className=" gap-4">
                                <div className="mb-4">
                                    <label
                                        htmlFor="title  "
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={notification.title}
                                        onChange={(e) =>
                                            setNotification({
                                                ...notification,
                                                title:
                                                    e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="message"
                                        className="block text-gray-700 font-bold mb-2"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        value={notification.message}
                                        onChange={(e) =>
                                            setNotification({
                                                ...notification,
                                                message:
                                                    e.target.value,
                                            })
                                        }
                                        className="shadow appearance-none rounded w-full py-2 px-3 text-primary ring-1 ring-primary focus:ring-accent focus:outline-none"
                                        required

                                    ></textarea>
                                </div>

                                <div className="flex gap-4 justify-end col-span-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="md:w-auto w-full bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create New Notification"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                        <th className="py-3 px-4 border-b border-gray-200">Title</th>
                                        <th className="py-3 px-4 border-b border-gray-200">Message</th>
                                        {/* <th className="py-3 px-4 border-b border-gray-200">Date</th> */}
                                        {/* <th className="py-3 px-4 border-b border-gray-200">Actions</th> */}
                                    </tr>
                                </thead>
                                {details.notifications && details.notifications.length > 0 && (
                                    <tbody>
                                        {details.notifications.map((notification) => (
                                            <tr
                                                key={notification.id}
                                                className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                            >
                                                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                    {notification.type}
                                                </td>
                                                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                                                    {notification.message}
                                                </td>
                                                {/* <td className="py-3 px-4 border-b border-gray-200 flex space-x-2">
                                                    <button
                                                        onClick={() => handleTransactionEdit(transaction)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleTransactionDelete(transaction.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                                {details.notifications && details.notifications.length === 0 && (
                                    <tbody>
                                        <tr>
                                            <td colSpan="7" className="py-3 px-4 border-b text-center border-gray-200 text-gray-700">
                                                No notifications found
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>

                            {/* Edit Transaction Modal */}
                            {/* {isEditModalOpen && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                                    <div className="relative p-8 bg-white w-96 rounded-lg shadow-xl">
                                        <div className="flex justify-between items-center pb-3">
                                            <h3 className="text-xl font-bold text-gray-900">Edit Transaction</h3>
                                            <button
                                                onClick={() => setIsEditModalOpen(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <form onSubmit={handleUpdateTransaction}>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={editingTransaction?.amount || ''}
                                                    onChange={handleFormChange}
                                                    step="0.01"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    New Balance
                                                </label>
                                                <input
                                                    type="number"
                                                    name="new_balance"
                                                    value={editingTransaction?.new_balance || ''}
                                                    onChange={handleFormChange}
                                                    step="0.01"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    value={editingTransaction?.description || ''}
                                                    onChange={handleFormChange}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Type
                                                </label>
                                                <select
                                                    name="type"
                                                    value={editingTransaction?.type || ''}
                                                    onChange={handleFormChange}
                                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                >
                                                    <option value="credit">Credit</option>
                                                    <option value="debit">Debit</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        'Save Changes'
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditModalOpen(false)}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )} */}

                            {/* Delete Confirmation Modal */}
                            {/* {isDeleteModalOpen && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                                    <div className="relative p-8 bg-white w-96 rounded-lg shadow-xl text-center">
                                        <div className="pb-3">
                                            <AlertCircle size={48} className="mx-auto text-red-500" />
                                            <h3 className="text-xl font-bold text-gray-900 mt-4">Confirm Deletion</h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Are you sure you want to delete this transaction? This action cannot be undone.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between space-x-2 mt-4">
                                            <button
                                                onClick={handleDeleteTransaction}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Loader2 size={16} className="mx-auto animate-spin" />
                                                ) : (
                                                    'Delete'
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setIsDeleteModalOpen(false)}
                                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>
                )
                default:
                return null;
        }
    };

    return (
        <div className="mt-16 p-6 font-inter">
            {" "}
            {/* Added font-inter for consistent styling */}
            <div className="flex flex-col items-start mb-4 gap-2">
                <p className="text-gray-500">
                    <Link
                        to="/admin"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Admin
                    </Link>{" "}
                    / User Details
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                    User Details
                </h2>
            </div>
            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
                <ul
                    className="flex flex-wrap -mb-px text-sm font-medium text-center"
                    role="tablist"
                >
                    <li className="mr-2" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ease-in-out
                                ${activeTab === "details"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            onClick={() => setActiveTab("details")}
                            role="tab"
                            aria-selected={activeTab === "details"}
                        >
                            User Details
                        </button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ease-in-out
                                ${activeTab === "accounts"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            onClick={() => setActiveTab("accounts")}
                            role="tab"
                            aria-selected={activeTab === "accounts"}
                        >
                            User Accounts
                        </button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ease-in-out
                                ${activeTab === "credit-cards"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            onClick={() => setActiveTab("credit-cards")}
                            role="tab"
                            aria-selected={activeTab === "credit-cards"}
                        >
                            Credit Cards
                        </button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ease-in-out
                                ${activeTab === "transactions"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            onClick={() => setActiveTab("transactions")}
                            role="tab"
                            aria-selected={activeTab === "transactions"}
                        >
                            Transactions
                        </button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ease-in-out
                                ${activeTab === "notification"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            onClick={() => setActiveTab("notification")}
                            role="tab"
                            aria-selected={activeTab === "notification"}
                        >
                            Notification
                        </button>
                    </li>
                </ul>
            </div>
            {/* Tab Content Area */}
            <div className="flex flex-col justify-center items-center w-full">
                {renderTabContent()}
            </div>
        </div>
    );
}
