import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./compnents/Layout/Layout";
import ProductCardView from "./compnents/product-component/ProductCardView";
import Login from "./compnents/auth/Login";
import FilterDrawer from "./compnents/filter-component/FilterDrawer";

function App() {
    const [filters, setFilters] = useState<Record<string, string | undefined | number>>({});
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!localStorage.getItem("token")
    );

    const handleApplyFilters = (newFilters: Record<string, string | undefined | number>) => {
        setFilters(newFilters);
    };

    const handleLogin = (status: boolean) => {
        setIsAuthenticated(status);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                />
                <Route
                    path="/"
                    element={<Login onLogin={handleLogin} />}
                />
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <AppLayout>
                                <div style={mainContentStyle}>
                                    <FilterDrawer onApplyFilters={handleApplyFilters} />
                                    <ProductCardView filters={filters} />
                                </div>
                            </AppLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

const mainContentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    flexDirection: "column",
};

export default App;
