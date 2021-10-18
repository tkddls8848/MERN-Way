import React from 'react';
import Nav from '../components/nav';
import HeadInfo from '../components/HeadInfo';

const photos = () => {
    return (
        <div>
            <HeadInfo title={'My Photo'}/>
            <Nav/>
            <h1>PHOTO PAGE</h1>
        </div>
    );
};

export default photos;