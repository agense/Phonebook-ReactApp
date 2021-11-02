import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import SearchForm from '../Components/SearchForm';
import Loader from '../Components/Loader';

export default class Contacts extends Component {

    render() {
        if(!this.props.isLoggedIn)
        {
            return <Redirect to='/login' /> 
        }
        else{
            return (
                <div>
                    <h1>My Contacts</h1>
                    <SearchForm onSearch={this.props.onSearch} onClearSearch={this.props.onClearSearch}/>
                        {this.props.isLoading ? <Loader/> : 
                        <>
                        {!this.props.contacts || this.props.contacts.length <= 0 ? 
                        <>
                            <div className="no-content">No Contacts Found</div>
                        </> : 
                        <>
                        {this.props.contacts.map(contact => (
                            <div key={contact.id}className="contact-row">
                                <div className="contact-data">
                                    <div>{contact.name}</div>
                                    <div>{contact.phone}</div>
                                </div>
                                <div className="contact-actions">
                                    <Link to={`/contacts/${contact.id}`} className="btn btn-azure">
                                        <i className="fas fa-eye"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        </>
                        }
                        </>
                    }
                </div>
            )
        }
    }
}
