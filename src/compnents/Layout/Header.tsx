import React from 'react';


const AppHeader: React.FC = () => {
    return (
        <header style={headerStyle}>
            <p style={paragraphStyle}>اپلیکیشن چک داده سالمینا</p>
        </header>
    )
}

const headerStyle: React.CSSProperties = {
    background: '#1d3557',
    color: '#fff',
    textAlign: 'center',
    minWidth: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Vazir',
}

const paragraphStyle: React.CSSProperties = {
    fontSize: '35px'
}

export default AppHeader;