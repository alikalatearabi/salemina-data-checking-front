import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.scss';

const AppHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the JWT token from localStorage
        localStorage.removeItem('token');

        // Optionally, clear any other user-related data from localStorage
        localStorage.removeItem('user');

        // Navigate to the login page
        navigate('/login', { replace: true }); // `replace: true` prevents navigating back to the protected route
    };

    return (
        <header className={styles.header}>
            <p className={styles.title}>اپلیکیشن چک داده سالمینا</p>
            <button className={styles.logoutButton} onClick={handleLogout} aria-label="خروج">
                خروج
            </button>
        </header>
    );
};

export default AppHeader;