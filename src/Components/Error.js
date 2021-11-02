import React from 'react'

export default function Error(props) {
    return (
        <div className="not-found">   
            <h1>{props.title ?? "Some Error Occurred"}</h1>
        </div>
    )
}
