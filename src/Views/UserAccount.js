import React, { Component } from 'react';
import Loader from '../Components/Loader';
import Axios from '../Axios';
import { handleErrors } from '../ErrorHandler';
import { Redirect, Link } from 'react-router-dom';

export default class UserAccount extends Component {
    state = {
        user: {},
        redirect : false,
        redirectPath: '',
        isLoading : false
    }
    componentDidMount(){
        this.getUserAccountData();
    }

    getUserAccountData = () => {
        this.setState({isLoading: true});
        Axios.get(`Users/${this.props.authId}`)
        .then((response) => {
            this.setState({
                user : {...response.data}, isLoading: false
            });
        })
        .catch((err) => {
            this.setState({ ...handleErrors(err.response), isLoading: false, redirect:true, redirectPath: '/'}); 
        });  
    }

    deleteUser = () => {
        this.setState({isLoading: true});
        Axios.delete(`Users/${this.props.authId}`)
        .then( async response => {
            await this.props.onDeleteAccount();
            this.setState({
                user : {}, isLoading: false, redirect:true
            });  
        })
        .catch((err) => {
            console.log(err);
        });  
    }

    render() {
        if(this.state.redirectPath != '')
        {
            return <Redirect to={this.state.redirectPath} /> 
        }
        else 
        {
            return (
                <>
                    <div className="item-holder">
                        <h1>My Account</h1>
                        { this.state.isLoading ? <Loader/> :
                        <>
                            <div className="contact-row">
                                <div className="contact-data">  
                                    <div>
                                        <div>{this.state.user.firstName} {this.state.user.lastName} </div>
                                        <div><small>{this.state.user.email}</small></div>
                                    </div>
                                    <div>
                                        <Link to={`/Account/Update`} 
                                            className="btn btn-sm btn-azure mr-2"><i className="fas fa-pen"></i>
                                        </Link>
                                        <button className="btn btn-sm btn-black" 
                                            onClick={this.deleteUser.bind(this)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button></div>
                                </div> 
                            </div>
                        </>
                        }
                    </div>
                </>
            )
        }
    }
}
