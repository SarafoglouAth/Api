import React from 'react';
import './Footer.css'; // Ensure the correct path to your CSS file

function Footer() {
    return (
        <footer className="footer-container">
            <div className="Insidecontainer">
                <p className="footer-text">&copy; {new Date().getFullYear()} Your Website Name. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;