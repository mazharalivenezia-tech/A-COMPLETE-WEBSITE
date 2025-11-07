
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Faskicks Sports</h3>
            <p className="text-sm text-gray-400">Built for speed, designed for life.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Shipping & Returns</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link to="/size-guide" className="text-gray-400 hover:text-white">Size Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Admin Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-2">Get the latest on new releases and sales.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
                Sign Up
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Faskicks Sports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;