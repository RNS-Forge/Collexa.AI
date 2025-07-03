import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, HelpCircle, Info, Home, Sparkles } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navigation = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Collections', href: '/collections', icon: BookOpen },
        { name: 'RNS Reply', href: '/feature2', icon: Sparkles },
        { name: 'How it Works', href: '/how-it-works', icon: HelpCircle },
        { name: 'About', href: '/about', icon: Info },
    ];

    const isActive = (path) => location.pathname === path; return (
        <nav className="bg-gradient-to-r from-white via-red-50 to-white shadow-lg fixed w-full z-50 border-b border-red-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-xl group-hover:from-red-700 group-hover:to-red-800 transition-all duration-300">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                                Collexa.AI
                            </span>
                        </Link>
                    </div>                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive(item.href)
                                    ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg'
                                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 mr-2" />
                                {item.name}
                            </Link>
                        ))}
                    </div>                    {/* Mobile Navigation Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-red-600 focus:outline-none p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden bg-gradient-to-r from-white via-red-50 to-white border-t border-red-200">
                    <div className="px-4 pt-2 pb-3 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive(item.href)
                                    ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg'
                                    : 'text-gray-700 hover:text-red-600 hover:bg-red-100'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
