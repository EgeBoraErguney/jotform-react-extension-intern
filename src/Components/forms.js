import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const Forms = () => {

    const cookies = new Cookies();
    const apiKey = cookies.get("apiKey");

    return (
        <>
            <h1>Welcome</h1>
            {apiKey}
        </>
    )
}

export default Forms;