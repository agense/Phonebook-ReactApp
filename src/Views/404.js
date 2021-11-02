import React from 'react';
import ErrorComponent from '../Components/Error';

export default function NotFound(props) {
    return (
        <div className="not-found">   
            <ErrorComponent title={"Not Found"}/>
        </div>
    )
}
