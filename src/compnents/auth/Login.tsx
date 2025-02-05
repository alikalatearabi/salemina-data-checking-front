import React, { useState } from "react";
import { Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./Login.module.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/Logo.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login: React.FC<{ onLogin: (status: boolean) => void }> = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDarkMode] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            message.error("لطفاً نام کاربری و رمز عبور معتبر وارد کنید");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", username)
            onLogin(true);
            navigate("/dashboard");
            message.success("ورود با موفقیت انجام شد!");
        } catch (error) {
            console.error("Login error:", error);
            message.error("نام کاربری یا رمز عبور اشتباه است");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.loginContainer} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={styles.loginCard}>
                <div className={styles.loginIcon}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </div>
                <h2>ورود به سامانه بررسی داده‌ها</h2>
                <p>برای بررسی و مدیریت داده‌های محصولات وارد حساب کاربری خود شوید.</p>
                <Input
                    placeholder="نام کاربری"
                    prefix={<UserOutlined />}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    aria-label="نام کاربری"
                />
                <Input.Password
                    placeholder="رمز عبور"
                    prefix={<LockOutlined />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                    aria-label="رمز عبور"
                />
                <div className={styles.rememberMe}>
                    <Checkbox>مرا به خاطر بسپار</Checkbox>
                </div>
                <Button
                    className={styles.loginButton}
                    onClick={handleLogin}
                    loading={loading}
                    icon={loading ? <LoadingOutlined /> : null}
                >
                    ورود
                </Button>
                <div className={styles.forgotPassword}>رمز عبور را فراموش کرده‌اید؟</div>
                <div className={styles.signUpLink}>
                    حساب کاربری ندارید؟ <a href="/signup">ثبت نام کنید</a>
                </div>
            </div>
        </div>
    );
};

export default Login;