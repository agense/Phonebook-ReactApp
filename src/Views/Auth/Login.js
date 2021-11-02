import React, { Component } from 'react';
import Loader from '../../Components/Loader';
import {Redirect} from 'react-router-dom';
import Axios from '../../Axios';
import { handleErrors } from '../../ErrorHandler';

export default class Login extends Component {
    state = {
        isLoading : false,
        request : { 
            email: "",
            password: "",
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
        Axios.post('Auth/Login', this.state.request)
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
                    <h1>Login</h1>
                    <div className="card form-card">
                        <div className="card-body">
                            <form onSubmit={this.handleSubmit}>
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
                                    { this.errorInField("Password") ? <div className="error">{this.state.errors.Password}</div> : "" }
                                </div>
                                {this.state.isLoading ? <Loader/> : 
                                    <input type="submit" value="Login" className="btn btn-sm btn-success"/>
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
