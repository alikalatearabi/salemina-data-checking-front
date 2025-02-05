import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{width: '100%'}}>
            <Header />
            <div style={layoutStyle}>
                <main style={mainContentStyle}>
                    {children}
                </main>
            </div>
        </div>
    )
}

const layoutStyle: React.CSSProperties = {
    display: 'flex',
};

const mainContentStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
};

export default AppLayout;