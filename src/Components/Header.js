import {React, Component } from 'react';
import {Link} from 'react-router-dom';

export default class Header extends Component {

    render () {
        const links = [
            this.props.isLoggedIn || {name: "Login", path: "/Login"},
            this.props.isLoggedIn || {name: "Register", path: "/Register"},
            !this.props.isLoggedIn || {name: "Contacts", path: "/Contacts"},
            !this.props.isLoggedIn || {name: "Create Contact", path: "/Contacts/Create"},
            !this.props.isLoggedIn || {name: "My Account", path: "/Account"},
         ]
        const list = links.map( (link, index) => (
            <li className="nav-item" key={index}>
                <Link to={`${link.path}`} className="nav-link">{link.name}</Link>
            </li>
        ));
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link to="/" className="navbar-brand">Phonebook</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-1 mb-2 mb-lg-0">
                            {list}
                            {this.props.isLoggedIn ? 
                            <li className="nav-item"><a href="" className="nav-link" 
                            onClick={this.props.logout.bind(this)}>Logout</a></li> : ""}
                        </ul>
                        </div>
                    </div>
                </nav>
            </>
        )
    }
}
