import React from 'react';
import ErrorComponent from '../Components/Error';

export default function Unauthorized() {
    return (
        <div className="not-found">   
            <ErrorComponent title={"This action is unauthorized"}/>
        </div>
    )
}