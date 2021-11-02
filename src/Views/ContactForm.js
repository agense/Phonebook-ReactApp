import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import Axios from '../Axios';
import Loader from '../Components/Loader';
import {handleErrors} from '../ErrorHandler';

export default class ContactForm extends Component {
    state ={
        contact: {
            "firstName": "",
            "lastName": "",
            "countryCode": "",
            "phone": "",
        },
        redirect: false,
        redirectPath: "/",
        isLoading: false,
        errors : [],
    }

    componentDidMount() {
        if(this.props.id != null){
            this.getContact(this.props.id);
        }
    }
    getContact = (id) => {
        this.setState({isLoading: true});
        Axios.get(`Contacts/${id}`)
        .then((response) => {
            console.log(response.data)
            this.setState({
                contact : {...response.data}, isLoading: false
            });
        })
        .catch((err) => {
            console.log(err.response);
            this.setState({ ...handleErrors(err.response), isLoading: false });
        });  
    }

    onChange = (e) => this.setState({
        contact: {...this.state.contact,
            [e.target.name]: e.target.value
        }
    });

    errorInField = (field) => {
        return field in this.state.errors;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.props.id){
            return this.updateContact();
        }else{
            return this.createContact();
        }
    }

    updateContact = () => {
        this.setState({isLoading: true});
        Axios.put(`Contacts/${this.props.id}`, this.state.contact)
        .then(async response => {
            console.log(response.data)
            await this.props.onUpdate(this.mapContact(response.data));
            this.setState({isLoading: false, redirect: true, redirectPath: "/Contacts"});
        })
        .catch((err) => {
            console.log(err.response);
            this.setState({ ...handleErrors(err.response), isLoading: false, });
        });  
    }

    createContact = () => {
        this.setState({isLoading: true});
        Axios.post('Contacts', this.state.contact)
        .then(async response => {
            console.log(response.data)
            await this.props.onCreate(this.mapContact(response.data));
            this.setState({isLoading: false, redirect: true, redirectPath: "/Contacts"});
        })
        .catch((err) => {
            console.log(err.response);
            this.setState({ ...handleErrors(err.response), isLoading: false, });
        });  
    }

    mapContact = (item) => {
        const contact = {
            id: item.id,
            name : item.name ?? `${item.firstName} ${item.lastName}`,
            phone: item.countryCode ? `${item.countryCode}${item.phone}` : item.phone,
          }
        return contact;
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to={this.state.redirectPath} />
        }
        else
        {
            return (
                <div className="center-holder">
                    <div className="center-holder-item">
                        <h1>{this.props.title}</h1>
                        <div className="card form-card">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                <div className="mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input type="text" 
                                        name="firstName" 
                                        value={this.state.contact.firstName} 
                                        onChange={this.onChange}
                                        className="form-control" 
                                        id="firstName" 
                                        required
                                        />
                                        {this.errorInField("FirstName") ? <div className="error">{this.state.errors.FirstName}</div> : ""}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input type="text" 
                                        name="lastName" 
                                        value={this.state.contact.lastName} 
                                        onChange={this.onChange}
                                        className="form-control" 
                                        id="lastName" 
                                        required
                                        />
                                        {this.errorInField("LastName") ? <div className="error">{this.state.errors.LastName}</div> : ""}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="countryCode" className="form-label">Country Code</label>
                                        <input type="text" 
                                        name="countryCode" 
                                        value={this.state.contact.countryCode} 
                                        onChange={this.onChange}
                                        className="form-control" 
                                        id="countryCode" 
                                        required
                                        />
                                        {this.errorInField("CountryCode") ? <div className="error">{this.state.errors.CountryCode}</div> : ""}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input type="text" 
                                        name="phone" 
                                        value={this.state.contact.phone} 
                                        onChange={this.onChange}
                                        className="form-control" 
                                        id="phone" 
                                        required
                                        />
                                        {this.errorInField("Phone") ? <div className="error">{this.state.errors.Phone}</div> : ""}
                                    </div>
                                    {this.state.isLoading ? <Loader/> : 
                                        <input type="submit" value={this.props.title} className="btn btn-sm btn-success"/>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
