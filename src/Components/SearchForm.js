import React, { Component } from 'react'

export default class SearchForm extends Component {
    state = {
        search : "",
    }
    handleChange = (e) => {
        this.setState({
            search: e.target.value
        });
        if(e.target.value == ""){
            this.props.onClearSearch();
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onSearch(this.state.search);
    }
    render() {
        return (
            <div className="searchForm">
                <form>
                    <div className="form-outline">
                        <input id="search" type="search" className="form-control" 
                        value={this.state.search}
                        onChange={this.handleChange}
                        placeholder="Search"/>
                    </div>
                    <button id="search-button" type="button" className="btn btn-black" onClick={this.handleSubmit.bind(this)}>
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div>
        )
    }
}
