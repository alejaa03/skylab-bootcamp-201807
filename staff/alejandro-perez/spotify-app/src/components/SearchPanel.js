import React, { Component } from "react";


class SearchPanel extends Component {

    state = {
        query:''
    }

    keepQuery = event => {
        const query = event.target.value
        this.setState({
            query
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        this.props.searchAPI(this.state.query)

    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <input type="text" onChange={this.keepQuery} value={this.state.query}/>
                <button type="submit">Search</button>
            </form>
        )
    }
}

export default SearchPanel;
