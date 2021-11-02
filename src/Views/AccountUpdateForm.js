import React, { Component } from 'react';
import Loader from '../Components/Loader';
import Axios from '../Axios';
import { handleErrors } from '../ErrorHandler';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';

export default class AccountUpdateForm extends Component {
    state = {
        isLoading : false,
        request : { 
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            newPassword: ""
        },
        errors: [],
        redirect : false,
        redirectPath: '',
    }
    componentDidMount(){
        this.getUserAccountData();
    }

    getUserAccountData = () => {
        this.setState({isLoading: true});
        Axios.get(`Users/${this.props.authId}`)
        .then((response) => {
            this.setState({
                request : {...response.data}, isLoading: false
            });
        })
        .catch((err) => {
            this.notify("Failed to load user data");
            this.setState({redirect:true, redirectPath: '/'});
        });  
    }
    onChange = (e) => this.setState({
        request: {...this.state.request,
            [e.target.name]: e.target.value
        }
    });

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({isLoading: true});
        Axios.put(`Users/${this.props.authId}`, this.state.request)
        .then(response => {
            this.props.onAccountUpdate(response.data);
            this.setState({isLoading:false});
            this.notify("Account Updated");
        })
        .catch((err) => {
            this.setState({ ...handleErrors(err.response), isLoading: false });
        });  
    }

    errorInField = (field) => {
        return field in this.state.errors;
    }

    notify = (message) => toast(message);

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirectPath} />
        }
        else
        {
            return (
                <>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={true}
                    closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
                /><ToastContainer />
                <div className="center-holder">
                    <div className="center-holder-item">
                        <h1>Update Account</h1>
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
                                        <label htmlFor="password" className="form-label">Current Password</label>
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
                                        <label htmlFor="newPassword" className="form-label">New Password</label>
                                        <br/><small className="xs-text">*Retype your current password if you do not want to change your password</small>
                                        <input type="password" 
                                        name="newPassword" 
                                        value={this.state.request.newPassword} 
                                        onChange={this.onChange}
                                        className="form-control" 
                                        id="newPassword" 
                                        required
                                        />
                                        {this.errorInField("NewPassword") ? <div className="error">{this.state.errors.NewPassword}</div> : ""}
                                    </div>
                                    {this.state.isLoading ? <Loader /> : 
                                    <input type="submit" value="Update" className="btn-sm btn btn-success"/>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )
        }
    }
}
