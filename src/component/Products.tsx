import { CreditCard, PiggyBank, Landmark, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

const products = [
  {
    icon: <Landmark className="w-10 h-10 text-boa-accent" />,
    title: 'Checking Accounts',
    desc: 'Everyday banking made easy. No hidden fees, instant alerts, and seamless payments.',
  },
  {
    icon: <PiggyBank className="w-10 h-10 text-boa-accent" />,
    title: 'Savings Accounts',
    desc: 'Earn more with high-yield interest. Set goals and watch your savings grow automatically.',
  },
  {
    icon: <CreditCard className="w-10 h-10 text-boa-accent" />,
    title: 'Credit Cards',
    desc: 'Build credit with flexible limits, low interest, and cashback rewards you’ll love.',
  },
  {
    icon: <Wallet className="w-10 h-10 text-boa-accent" />,
    title: 'Personal Loans',
    desc: 'Get fast, affordable loans for life’s big moments — no paperwork, no stress.',
  },
];

export default function Products() {
  return (
    <section className="bg-boa-bg py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-boa-primary mb-4">
          Explore Our Banking Products
        </h2>
        <p className="text-boa-text max-w-2xl mx-auto mb-12">
          Whether you’re saving, spending, or borrowing, we offer the right tools to help you take control of your finances.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition"
            >
              <div className="mb-4 flex justify-center">{product.icon}</div>
              <h3 className="text-lg font-semibold text-boa-primary mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-boa-text">{product.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
