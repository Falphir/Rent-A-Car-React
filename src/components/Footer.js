import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo/logo_simples.png'

function Footer() {
    return (
        <div className='footer-container'>

            <div className="footer-links">
                <div className='footer-link-wrapper'>
                    <div class='footer-link-items'>
                        <h2>About Us</h2>
                        <Link to='/'>Privacy Policy </Link>
                        <Link to='/'>Terms of Service</Link>
                    </div>
                    <div class='footer-link-items'>
                        <h2>Contact Us</h2>
                        <Link to='/'>Contact</Link>
                        <Link to='/'>Support</Link>
                    </div>
                </div>
            </div>
            <section className="social-media">
                <div className="social-media-wrap">
                    <div className="footer-logo">
                        <Link to='/' className='footer-logo'>
                            <img className='Logo' src={logo} />
                        </Link>
                    </div>
                    <small className="website-rights">
                        GrandHotel © 2022
                    </small>
                    <div className="social-icons">
                        <Link to='/' target="_blank" aria-label='Facebook' className="social-icon-link facebook">
                            <i className="fab fa-facebook-f"></i>
                        </Link>
                        <Link to='/' target="_blank" aria-label='Instagram' className="social-icon-link instagram">
                            <i className="fab fa-instagram"></i>
                        </Link>
                        <Link to='/' target="_blank" aria-label='Youtube' className="social-icon-link youtube">
                            <i className="fab fa-youtube"></i>
                        </Link>
                        <Link to='/' target="_blank" aria-label='Twitter' className="social-icon-link twitter">
                            <i className="fab fa-twitter"></i>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Footer
