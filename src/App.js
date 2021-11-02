import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import './App.css';
import Axios from './Axios';
import jwtDecode from 'jwt-decode';
import Header from './Components/Header';
import Login from './Views/Auth/Login';
import Register from './Views/Auth/Register';
import Contacts from './Views/Contacts';
import Contact from './Views/Contact';
import ContactForm from './Views/ContactForm';
import NotFound from './Views/404';
import Unauthorized from './Views/403';
import Error from './Components/Error';
import UserAccount from './Views/UserAccount';
import AccountUpdateForm from './Views/AccountUpdateForm';

export default class App extends Component {
  state = {
    isLoggedIn: false,
    loggedInUser: {},
    redirect : false,
    redirectPath : '',
    contacts: [],
  }
  componentDidMount(){
    if(this.state.isLoggedIn || this.authenticate()){
      this.loadContacts();
      this.setState({redirectPath: '/Contacts'});
    }else 
    {
      this.setState({redirectPath: '/Login'});
    }
  }

  authenticate = () => {
    const token = localStorage.getItem("phnbToken");
    if(token == null){
      return false;
    }
    else if(this.isTokenExpired(token)){
      return false;
    }else{
      this.login(token);
      return true;
    }
  }

  isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const expDate = decoded.exp * 1000;
    return new Date(expDate) < new Date();
  }

  login = (token) => {
    this.setState({
      isLoggedIn : true,
      loggedInUser : {...jwtDecode(token)},
      redirectPath: '/Contacts', 
    });
    Axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
    this.loadContacts();
    localStorage.setItem("phnbToken", token);
  }

  logout = () => {
    localStorage.removeItem("phnbToken");
    this.setState({
      isLoggedIn : false,
      loggedInUser : {},
      redirectPath : '/Login', 
      redirect : true,
    });
    Axios.defaults.headers.common = {}
  }

  loadContacts = () => {
    this.setState({isLoading: true});
    Axios.get('Contacts')
    .then((response) => {
        this.setState({isLoading: false, contacts : [...response.data]});  
    })
    .catch((err) => {
        this.setState({isLoading: false});
    });
  }

  create = (contact) => {
    this.setState({
      contacts: [contact, ...this.state.contacts]
    })
  }

  update = (contact) => {
    const modifiedIndex = this.state.contacts.findIndex((obj => obj.id == contact.id));
    this.setState({
      contacts: [...this.state.contacts.map(c => (c.id === contact.id ? contact : c) )]
    })
  }

  delete=(id) => {
    this.setState({ contacts: [...this.state.contacts.filter(c => c.id !== id)]});
  }

  onClearSearch = () => {
    this.loadContacts();
  }

  onSearch = (searchInput) => {
    if(searchInput == ""){
       this.loadContacts();
    }else{
       this.searchContacts(searchInput);
    } 
  }
  
  searchContacts = (searchInput) => {
    this.setState({isLoading: true});
    const search = encodeURI(searchInput);
    Axios.get(`Contacts/Search?search=${search}`)
    .then(response => {
      this.setState({
        contacts : [...response.data],
        isLoading : false
      })
    })
    .catch(err => {
      this.setState({isLoading: false});
    })
  }

  onAccountUpdate = (user) => {
    console.log(user);
    this.setState({
      loggedInUser: {...this.state.loggedInUser, email : user.email}
    });
  }
  render() {
    return (
      <Router>
        <div className="App">
            <Header isLoggedIn={this.state.isLoggedIn} logout={this.logout}/>
            <div className="container body-container">
                <Route exact path="/" render={props => (
                   (this.state.redirectPath != '') 
                   ? <Redirect to={this.state.redirectPath} /> :
                    <h1>Phonebook</h1>
                )} />
                <Route exact path="/Login" render={props => (
                   <Login isLoggedIn={this.state.isLoggedIn} login={this.login}/>
                )} />
                <Route exact path="/Register" render={props => (
                   <Register isLoggedIn={this.state.isLoggedIn} login={this.login}/>
                )} />
                 <Route exact path="/Contacts" render={props => (
                   <Contacts 
                   isLoggedIn={this.state.isLoggedIn} 
                   isLoading={this.state.isLoading}
                   contacts={this.state.contacts} 
                   onSearch={this.onSearch}
                   onClearSearch={this.onClearSearch}
                   />
                )} />
                 <Route exact path="/Contacts/create" render={props => (
                   <ContactForm title="Create Contact" id={null} onCreate={this.create}/>
                )} />
                <Route exact path="/Contacts/:id(\d+)" render={props => (
                   <Contact 
                   id={props.match.params.id} 
                   authId={this.state.loggedInUser.Id} 
                   onDelete={this.delete}
                  />
                )}/>
                <Route exact path="/Contacts/:id(\d+)/update" render={props => (
                   <ContactForm title="Update Contact" id={props.match.params.id} onUpdate={this.update}/>
                )} />
                <Route exact path="/Account" component={() => 
                    <UserAccount authId={this.state.loggedInUser.Id} onDeleteAccount={this.logout}/>} />
                
                <Route exact path="/Account/Update" component={() => 
                    <AccountUpdateForm authId={this.state.loggedInUser.Id} 
                    onAccountUpdate={this.onAccountUpdate}/>} />
                <Route path="/NotFound" render={props => (
                   <NotFound />
                )}/>
                <Route path="/Unauthorized" render={props => (
                   <Unauthorized />
                )}/>
                <Route path="/Error" render={props => (
                   <Error />
                )}/>
            </div>
        </div>
      </Router>
      
    )
  }
}
