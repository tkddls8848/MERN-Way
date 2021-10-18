import React from 'react';
import Head from 'next/head';

const HeadInfo = ({title}) => {
    return (
        <Head>
            <title>{title}</title>
        </Head>
    );
};

HeadInfo.defaultProps = {
    title : 'default'
}

export default HeadInfo;