import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className="navbar">
            <Link to="/">
                <img src="/logo.png" alt="Logo" className='logo' />
            </Link>
            <div className="side_navbar">
                <Link to="/" >
                    <span>Home</span>
                </Link>
                <Link to="/form" >
                    <span>Form</span>
                </Link>
                <Link to="/about" >
                    <span>About</span>
                </Link>

                <Link to="/" >
                    <button>Get Started</button>
                </Link>
            </div>
        </div>
    );
}
