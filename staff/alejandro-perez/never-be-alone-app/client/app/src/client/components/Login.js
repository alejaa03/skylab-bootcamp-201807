import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {fetchUser} from '../redux/actions/user'
import {alertActions} from '../redux/actions/alert'
import store from '../redux/store'

import LoginForm  from './forms/Login';

class LoginPage extends Component {

    componentDidMount() {
      store.dispatch(alertActions.clear())
    }

    render() {
        const {
          auth:{auth,user:{data}},
          alert,
        } = this.props

        if(auth && data) return <Redirect to={`/profile/${data.id}`}/>
        else return (
          <div class="page-header header-filter" style={{"background-image": "url('../assets/img/bg7.jpg')", "background-size": "cover", "background-position": "top center"}}>
          <div class="container">
            <div class="row">
              <div class="col-md-6 mr-auto ml-auto" style={{marginTop:"200px"}}>
              {alert && alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div> : ""}
                <div class="card card-login">
                  <div className="card-body">
                    <LoginForm/>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
        );
    }
}

function mapStateToProps({ auth,alert }) {
  return { auth,alert };
}
    
export default connect(
  mapStateToProps,
  { fetchUser, alertActions }
)(LoginPage)