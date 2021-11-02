import React, { Component } from 'react';
import Axios from '../../Axios';
import Loader from '../../Components/Loader';
import {Redirect} from 'react-router-dom';
import { handleErrors } from '../../ErrorHandler';

export default class Register extends Component {
    state = {
        isLoading : false,
        request : { 
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirmation: ""
        },
        errors: [],
    }
    onChange = (e) => this.setState({
        request: {...this.state.request,
            [e.target.name]: e.target.value
        }
    });

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({isLoading: true});
        Axios.post('Auth/Register', this.state.request)
        .then( async response => {
            await this.props.login(response.data.token);
            this.setState({isLoading: false});
        })
        .catch((err) => {
            this.setState({ ...handleErrors(err.response), isLoading: false, });
        });  
    }

    errorInField = (field) => {
        return field in this.state.errors;
    }

    render() {
        if(this.props.isLoggedIn)
        {
            return <Redirect to='/' /> 
        }
        else {
            return (
                <div className="center-holder">
                <div className="center-holder-item">
                    <h1>Register</h1>
                    <div className="card form-card">
                        <div className="card-body">
                            <form onSubmit={this.handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input type="text" 
                                    name="firstName" 
                                    value={this.state.request.firstName} 
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
                                    value={this.state.request.lastName} 
                                    onChange={this.onChange}
                                    className="form-control" 
                                    id="lastName" 
                                    required
                                    />
                                    {this.errorInField("LastName") ? <div className="error">{this.state.errors.LastName}</div> : ""}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" 
                                    name="email" 
                                    value={this.state.request.email} 
                                    onChange={this.onChange}
                                    className="form-control" 
                                    id="email" 
                                    required
                                    />
                                    {this.errorInField("Email") ? <div className="error">{this.state.errors.Email}</div> : ""}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" 
                                    name="password" 
                                    value={this.state.request.Password} 
                                    onChange={this.onChange}
                                    className="form-control" 
                                    id="password" 
                                    required
                                    />
                                    {this.errorInField("Password") ? <div className="error">{this.state.errors.Password}</div> : ""}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="passwordConfirmation" className="form-label">Password Confirmation</label>
                                    <input type="password" 
                                    name="passwordConfirmation" 
                                    value={this.state.request.PasswordConfirmation} 
                                    onChange={this.onChange}
                                    className="form-control" 
                                    id="passwordConfirmation" 
                                    required
                                    />
                                    {this.errorInField("PasswordConfirmation") ? <div className="error">{this.state.errors.PasswordConfirmation}</div> : ""}
                                </div>
                                {this.state.isLoading ? <Loader /> : 
                                <input type="submit" value="Register" className="btn-sm btn btn-success"/>
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
