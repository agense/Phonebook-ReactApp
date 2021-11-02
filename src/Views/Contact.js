import React, { Component } from 'react';
import Axios from '../Axios';
import { Link, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Components/Loader';
import { handleErrors } from '../ErrorHandler';
import ContactUsers from '../Components/ContactUsers';
import SearchForm from '../Components/SearchForm';

export default class Contact extends Component {
    state ={
        contact: {
            id: "",
            firstName : "",
            lastName : "",
            countryCode : "",
            phoneNumber : "",
            isOwnedContact: "",
        },
        contactUsers: [],
        searchedUsers : [],
        isLoading: false,
        redirect: false,
        redirectPath: "/",
        isSearchLoading: false,
        showSharingForm : false,
    }
    
    componentDidMount() {
        this.getContact(this.props.id);
    }
    
    getContact = (id) => {
        this.setState({isLoading: true});
        Axios.get(`Contacts/${id}`)
        .then((response) => {
            this.setState({
                contact : {...response.data}, isLoading: false
            });
            if(response.data.isOwnedContact){
                this.getContactUsers(this.props.id);
            }
        })
        .catch((err) => {
            this.setState({ ...handleErrors(err.response), isLoading: false, }); 
        });  
    }

    getContactUsers = (id) => {
        Axios.get(`Contacts/${id}/users`)
        .then((response) => {
            //remove self
            let contactUsers = [...response.data.filter(u => parseInt(u.id) !== parseInt(this.props.authId))];
            this.setState({
                contactUsers : [...contactUsers]
            });
        })
        .catch((err) => {
            this.notify("There was an error.Contact users were not loaded");
        });  
    }

    deleteContact = (id) => {
        this.setState({isLoading: true});
        Axios.delete(`contacts/${id}`)
        .then( async response => {
            await this.props.onDelete(id);
            this.setState({isLoading: false, redirect: true, redirectPath: "/Contacts"});
        })
        .catch( (err) => {
            this.setState({ isLoading: false, });
            this.notify(err.response.data.message);
        })
    }

    disableSharing = (userId) => {
        Axios.delete(`contacts/${this.state.contact.id}/sharing/${userId}`)
        .then( response => {
            console.log(response);
            this.setState({
                contactUsers : [...this.state.contactUsers.filter(u => u.id != userId)]
            });
            this.notify(response.data.message);
        })
        .catch( (err) => {
            this.notify(err.response.data.message);
        })
    }

    enableSharing = (user) => {
        Axios.post(`contacts/${this.state.contact.id}/sharing/${user.id}`)
        .then( response => {
            this.setState({
                contactUsers : [user, ...this.state.contactUsers], 
                searchedUsers : [...this.state.searchedUsers.filter(u => u.id != user.id)],
            });
            this.notify(response.data.message);
        })
        .catch( (err) => {
            this.notify(err.response.data.message);
        })
    }

    searchUsers = (searchInput) =>{
        this.setState({isSearchLoading: true});
        const search = encodeURI(searchInput);
        Axios.get(`Users/Search?search=${search}`)
        .then(response => {
            //Remove self
            const found = [...response.data.filter(u => parseInt(u.id) !== parseInt(this.props.authId))];
            //Remove the users with whom contact is shared already
            const filtered = found.filter(({ id: id1 }) => !this.state.contactUsers.some(({ id: id2 }) => id2 === id1));
            
            this.setState({
                searchedUsers : [...filtered],
                isSearchLoading : false
            })
            if(filtered == 0){
                this.notify("No Users Found");
            }
        })
        .catch(err => {
        this.setState({isSearchLoading: false});
        this.notify(err.response.data.message);
        })
    }
    toggleSharingForm = () => {
        this.setState({
            showSharingForm : !this.state.showSharingForm
        });
    }

    onClearSearch = () => {
        this.setState({
            searchedUsers : []
        });
    }

    notify = (message) => toast(message);

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirectPath} />
        }
        else{
            return (
                <>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={true}
                    closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
                /><ToastContainer />
                <div className="item-holder">
                    <h1>Manage Contact</h1>
                    { this.state.isLoading ? <Loader/> :
                    <>
                        <div className="contact-row">
                            <div className="contact-data">  
                                <div>{this.state.contact.firstName} {this.state.contact.lastName} </div>
                                <div>{this.state.contact.countryCode} {this.state.contact.phone}</div>
                            </div> 
                        </div>
                            <div className="contact-action-list">
                                { this.state.contact.isOwnedContact ?
                                <>
                                <div>
                                <Link to={`/Contacts/${this.state.contact.id}/update`} 
                                    className="btn btn-sm btn-azure mr-2"><i className="fas fa-pen"></i></Link>
                                    <button className="btn btn-sm btn-black" 
                                    onClick={this.deleteContact.bind(this, this.state.contact.id)}>
                                    <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                                <button className="btn btn-sm btn-success" 
                                    onClick={this.toggleSharingForm.bind(this)}>
                                        Share <i className="fas fa-share"></i>
                                        </button>
                                </>: ""
                                } 
                            </div>
                            { (this.state.contact.isOwnedContact && this.state.showSharingForm) ?
                                    <>
                                <div className="sharing-form-holder">
                                <h6>Find A User</h6>
                                <SearchForm onSearch={this.searchUsers} onClearSearch={this.onClearSearch}/>
                                </div>
                                { this.state.isSearchLoading ?
                                        <div className="partial-loader">
                                        <i className="fas fa-spinner fa-spin"></i>
                                        </div> : "" }
                                { (this.state.isSearchLoading == false && this.state.searchedUsers.length > 0) ? 
                                <div className="searched-users">
                                    {this.state.searchedUsers.map( user => (
                                        <div className="contact-user-item" key={user.Id}>
                                            <div className="contact-data">{user.name}</div>
                                            <button className="btn btn-sm btn-success" 
                                            onClick={this.enableSharing.bind(this, user)}>
                                                <i className="fas fa-share"></i>
                                            </button> 
                                        </div>
                                    ))}
                                </div>  : "" }
                                </> : ""
                                }
                            <div className="contact-users">
                                    {this.state.contactUsers.length > 0 ? 
                                    <ContactUsers contactUsers={this.state.contactUsers} 
                                    onStopSharing={this.disableSharing}/> 
                                    : ""}
                            </div>
                        </> }
                </div>
                </>
            )
        }
    }
}
