import React from 'react';
import ErrorComponent from '../Components/Error';

export default function Error(props) {
    return (
        <div className="not-found">   
            <ErrorComponent title={"Some Error Occurred"}/>
        </div>
    )
}