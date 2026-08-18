import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
    
    const variants = {
        primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        secondary: "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500",
        outline: "text-gray-700 border-gray-300 bg-white hover:bg-gray-50 focus:ring-blue-500",
        danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
