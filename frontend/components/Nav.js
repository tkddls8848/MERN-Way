import React from 'react';
import Link from 'next/link'

const Nav = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link href='/'>HOME</Link>
                </li>
                <li>
                    <Link href="/photos">PHOTOS</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;