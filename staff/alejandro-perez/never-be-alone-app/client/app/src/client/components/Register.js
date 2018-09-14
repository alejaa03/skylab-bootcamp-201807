import React, { Component } from 'react';
import FileBase64 from 'react-file-base64'
import Cropper from 'react-cropper'
import {Helmet} from 'react-helmet'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUser,registerUser} from '../redux/actions/user'

class Register extends Component{


  state = {
    name:null,
    surname:null,
    email:null,
    password:null,
    photoProfile:undefined,
    base64:null
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  canSubmit = () => {
    const {name,surname,email,password} = this.state
    return !!(name && surname && email && password)
  }

  handleRegister = e => {
    e.preventDefault()
    this.props.registerUser({...this.state,history:this.props.history})
  }

  _crop(){
    this.setState({
      photoProfile:this.refs.cropper.getCroppedCanvas({width:300,height:300}).toDataURL()
    }) 
  }

    render() {
      const {
        auth:{auth,user:{data}},
        alert
      } = this.props

      if(auth) return <Redirect to={`/profile/${data.id}`}/>
      else return <div class="page-header header-filter" style={{"background-image": "url('../assets/img/bg7.jpg')", "background-size": "cover", "background-position": "top center"}}>
    <div class="container">
     <Helmet>
      <link rel="stylesheet" href="/assets/css/cropper.min.css" type="text/css"/>
     </Helmet>
      <div class="row mt-25 pt-5">
        <div class="col-md-6 mt-5 mr-auto">
          <div class="card card-login">
        {alert && alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div> : ""}
            <form class="form" method="" action="">
              <div class="card-body">
                <div>
                {this.state.photoProfile && <div className="d-flex justify-content-between p-4"><span className="input-group-text">Preview:</span><img className="rounded-circle" style={{width:"100px",height:"100px"}} src={this.state.photoProfile} alt=""/></div>}
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="material-icons">face</i>
                    </span>
                  </div>
                  <input type="text" name="name" onChange={this.handleChange} class="form-control" placeholder="First Name..."/>
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="material-icons">face</i>
                    </span>
                  </div>
                  <input type="text" name="surname" onChange={this.handleChange} class="form-control" placeholder="Surname"/>
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="material-icons">mail</i>
                    </span>
                  </div>
                  <input type="email" name="email" onChange={this.handleChange} class="form-control" placeholder="Email..."/>
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="material-icons">lock_outline</i>
                    </span>
                  </div>
                  <input name="password" onChange={this.handleChange} type="password" class="form-control" placeholder="Password..."/>
                </div>
              </div>
              <div class="footer text-center">
                <button onClick={this.handleRegister} disabled={!this.canSubmit()} class="btn btn-primary btn-link btn-wd btn-lg">Get Started</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 mt-5">
          <div class="card card-login p-4 text-center" style={{minHeight:"420px"}}>
              <FileBase64 multiple={false} onDone={data => this.setState({base64:data.base64})}/>
              <div className="card-body pt-4" >
                {this.state.base64 ? <Cropper
                  ref='cropper'
                  src={this.state.base64}
                  style={{height: "300px", width: '100%'}}
                  aspectRatio={1}
                  guides={false}
                  dragMode="move"
                  crop={this._crop.bind(this)} /> : ""}
              </div>
          </div>
        </div>
      </div>
    </div>
</div>
        }
    }


function mapStateToProps({ auth,alert }) {
  return { auth,alert };
}
    
export default connect(
  mapStateToProps,
  { fetchUser, registerUser }
)(Register)
