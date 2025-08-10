import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react'; // use any icon lib
import React from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
        <Menu />
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:flex`}
      >
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold">Bank App</h2>
          <nav className="flex flex-col space-y-2">
            <Link to="/dashboard" className="hover:bg-gray-700 px-2 py-1 rounded">
              My Account
            </Link>
            <Link to="/transactions" className="hover:bg-gray-700 px-2 py-1 rounded">
              Transactions
            </Link>
            <Link to="/logout" className="hover:bg-gray-700 px-2 py-1 rounded">
              Logout
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
