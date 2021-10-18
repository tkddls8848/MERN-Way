import React from 'react';
import Nav from './nav';

const Layout = ({children}) => {
    return (
        <div>
            <Nav></Nav>
            <div>
                {children}
            </div>
        </div>
    );
};

export default Layout;