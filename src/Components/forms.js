import React, { useState, useEffect } from 'react';

const Forms = () => {

    const apiKey = localStorage.getItem("apiKey");

    return (
        <>
            <h1>Welcome</h1>
            {apiKey}
        </>
    )
}

export default Forms;