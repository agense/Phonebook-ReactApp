import React, { Component } from 'react'

export default class ContactUsers extends Component {
    render() {
        return (
            <div>
                <h6>Shared With</h6>
                {this.props.contactUsers.map(u => (
                    <div className="contact-user-item" key={u.id}>
                        <div className="contact-data">{u.name}</div>
                        <div>
                            <button className="btn btn-sm btn-azure" 
                            onClick={this.props.onStopSharing.bind(this, u.id)}>
                            <i className="fas fa-minus"></i>
                            </button>
                        </div>
                    </div>
                ))
                }
            </div>
        )
    }
}
