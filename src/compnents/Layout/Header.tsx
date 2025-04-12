import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BarChartOutlined, MenuOutlined, CloseOutlined, ShopOutlined, LogoutOutlined } from '@ant-design/icons';
import styles from './AppHeader.module.scss';

const AppHeader: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [_, setWindowWidth] = useState(window.innerWidth);

    // Track window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        // Remove the JWT token from localStorage
        localStorage.removeItem('token');

        // Optionally, clear any other user-related data from localStorage
        localStorage.removeItem('user');

        // Navigate to the login page
        navigate('/login', { replace: true }); // `replace: true` prevents navigating back to the protected route
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Check if current path matches the link
    const isActive = (path: string) => location.pathname === path;

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <p className={styles.title}>اپلیکیشن چک داده سالمینا</p>
                
                {/* Mobile menu button */}
                <button 
                    className={styles.mobileMenuButton} 
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? "بستن منو" : "باز کردن منو"}
                >
                    {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                </button>
                
                {/* Navigation links - shown on desktop or when mobile menu is open */}
                <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <Link 
                        to="/dashboard" 
                        className={`${styles.navLink} ${isActive('/dashboard') ? styles.activeLink : ''}`}
                    >
                        <ShopOutlined /> محصولات
                    </Link>
                    <Link 
                        to="/user-stats" 
                        className={`${styles.navLink} ${isActive('/user-stats') ? styles.activeLink : ''}`}
                    >
                        <BarChartOutlined /> آمار کاربران
                    </Link>
                    <button 
                        className={styles.logoutButton} 
                        onClick={handleLogout} 
                        aria-label="خروج"
                    >
                        <LogoutOutlined /> خروج
                    </button>
                </div>
            </div>
            
            {/* Backdrop for mobile menu */}
            {isMobileMenuOpen && (
                <div 
                    className={styles.menuBackdrop} 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default AppHeader;