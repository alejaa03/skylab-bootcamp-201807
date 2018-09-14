import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import logic from './../../logic/';
import { fetchUser, logout } from './../redux/actions/user';
import AutoComplete from './AutoComplete';
import {Helmet} from 'react-helmet'


class NavBar extends Component {

  componentDidMount() {
    if (logic.isLogged()) {
        this.props.fetchUser();
    }
}

handleLogout = e => {
  e.preventDefault();
  return this.props.logout(this.props.history);
};

  render(){

    const {
      auth:{auth,user:{data}}
    } = this.props

    return <nav className="navbar navbar-transparent navbar-color-on-scroll fixed-top navbar-expand-lg" color-on-scroll="100" id="sectionsNav">
    <Helmet>
      <link href="/assets/css/Autocomplete.css" type="text/css" rel="stylesheet"/>
    </Helmet>
    <div className="container">
        <Link className="navbar-brand" to="/"> {/*TODO ISOMORPHIC*/}
          NeverBeAlone </Link>
      <div className="navbar-translate" style={{width:"75%", textAlign:"center"}}>
        <AutoComplete className="p-5" />
        <button className="navbar-toggler" type="button" data-toggle="collapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="sr-only">Toggle navigation</span>
          <span className="navbar-toggler-icon"></span>
          <span className="navbar-toggler-icon"></span>
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav ml-auto">
        {(auth && data) ? <li className="dropdown nav-item">
          <a href="#" className="nav-link" data-toggle="dropdown">
              <div className="dropdown-toggle"><img className="rounded-circle  mr-2" style={{width:"2rem"}} src={data.photoProfile}/><span className="mr-1">{data.name}</span></div>
            </a>
            <div className="dropdown-menu dropdown-with-icons">
              <Link to={`/profile/${data.id}`} className="dropdown-item"><i className="material-icons">person</i>Profile</Link>
              <a className="dropdown-item text-danger" style={{cursor:"pointer"}} onClick={e => this.handleLogout(e)}>
                <i className="material-icons ">exit_to_app</i> Logout
              </a>
            </div>
          </li>
          : <li className="nav-item">
          <Link className="btn btn-outline-info nav-link" to="/login"><i className="material-icons">input</i>Login</Link>
          </li>}
        </ul>
      </div>
    </div>
  </nav>

  }

}

function mapStateToProps({ auth }) {
  return { auth };
}

export default withRouter(
  connect(
      mapStateToProps,
      { fetchUser, logout }
  )(NavBar)
);
