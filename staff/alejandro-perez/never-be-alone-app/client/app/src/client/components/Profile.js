import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUserById, fetchUser, listEventsByDate,createGroup } from "./../redux/actions/user";
import logic from "../../logic";
import moment from 'moment'
import DatePicker from 'react-datepicker';
import {Modal,ModalBody,ModalFooter,ModalHeader,Button} from 'reactstrap'
import store from '../redux/store'
import {alertActions} from '../redux/actions/alert'






const initialState = {
  startDate : moment(),
  modal: false,
  groupname:null,
  groupdescription:null
}

class Profile extends Component {

  state = initialState

  toggle = () => {
    this.setState({...initialState,modal:!this.state.modal})
    store.dispatch(alertActions.clear())
  }

  componentDidMount() {
    const {
      user: {
        user: { data }
      }
    } = this.props

    return Promise.resolve()
      .then(() => {
        if(logic.isLogged()) this.props.fetchUser()
        return this.props.fetchUserById(this.props.match.params.id)
          .then(() => this.props.listEventsByDate(undefined,moment().startOf('day'),this.props.match.params.id))
      })
  }

  handleFieldChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleGroupSubmit = e => {
    e.preventDefault()
    const {groupname,groupdescription} = this.state
    return this.props.createGroup(groupname,groupdescription,this.props.history)
  }

  handleChange = (date) => {
    const {
      user: {
        user: { data }
      }
    } = this.props
    this.setState({
      startDate: date
    },() => {
      return this.props.listEventsByDate(undefined,moment(date).format('MM-DD-YYYY'),data.id)
    })
  }

  render() {
    const {
      user: {
        user: { data },
      },
      event:{events},
      auth:{auth,user:UserData},
      alert
    }
       = this.props
    return (
      Object.keys(data || {}).length ? <div className="profile-page" style={{minHeight: '1200px'}}> 
  <div className="page-header header-filter" data-parallax="true" style={{"backgroundImage": 'url(../assets/img/parallax.jpg)'}}></div>
  <div className="main main-raised" style={{minHeight: '800px'}}>
    <div className="profile-content">
      <div className="container">
        <div className="row">
          <div className="col-md-6 ml-auto mr-auto">
            <div className="profile">
              <div className="avatar">
                <img src={data.photoProfile} alt="Circle Image" className="img-raised rounded-circle img-fluid"/>
              </div>
              <div className="name">
                <h3 className="title">{data.name} {data.surname}</h3>
                {( (data && UserData.data) && UserData.data.id === data.id) && <button onClick={this.toggle} className="btn btn-outline-success"><i class="fas fa-plus"></i> CREATE A GROUP</button>}
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Create a group!</ModalHeader>
                    <form onSubmit={this.handleGroupSubmit}>
                    <ModalBody>
                    {alert && alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div> : ""}
                    <div class="form-group">
                      <label htmlFor="groupname" class="col-form-label">Name:</label>
                      <input type="text" autoComplete="off" onChange={this.handleFieldChange} name="groupname" class="form-control"/>
                    </div>
                    <div class="form-group">
                      <label htmlFor="groupdescription" class="col-form-label">Description:</label>
                      <textarea class="form-control" onChange={this.handleFieldChange} name="groupdescription"></textarea>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary">Submit</Button>{' '}
                    <Button color="secondary" type="button" onClick={this.toggle}>Cancel</Button>
                  </ModalFooter>
                    </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
        <div className="description text-center">
          <p>Contact mail: {data.email}</p>
        </div>
        <div className="row">
          <div className="col-md-6 ml-auto mr-auto">
            <div className="profile-tabs">
              <ul className="nav nav-pills nav-pills-icons justify-content-center" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" href="#groups" role="tab" data-toggle="tab">
                  <i className="material-icons">group</i> Groups
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#events" role="tab" data-toggle="tab">
                    <i className="material-icons">event</i> Events
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="tab-content tab-space">
          <div className="tab-pane active text-center gallery" id="groups">
            <div className="row">
              <div className="col-md-6 mr-auto ml-auto">
                <ul className="list-group main-raised mt-2 p-4">
                  {data.groups.map(elem => {
                      return <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"> <a style={{cursor:"pointer"}} className="text-primary" onClick={() => this.props.history.push(`/group/${elem.group.id}`)}>{elem.group.name}</a>  {elem.role === "owner" && <i className="material-icons">star</i>}</li>
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className="tab-pane gallery" id="events">
            <div className="row just">
                  <div class="col-md-4 form-group">
                  <label class="label-control">Datetime Picker</label>
                  <DatePicker
                      className="form-control"
                      selected={this.state.startDate}
                      onChange={this.handleChange}
                      locale="es-ES"
                  />
              </div>
              <div className="col-md-6 mr-auto">
              <ul className="list-group main-raised mt-2 p-4">
                  {events.map(elem => {
                    return <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"> <a style={{cursor:"pointer"}} className="text-primary" onClick={() => this.props.history.push(`/event/${elem.id}`)}>{elem.name}</a></li>
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div> : "NOT FOUND"
    );
  }
}

function loadData(store, params) {
  return store.dispatch(fetchUserById(params.id))
    .then(() => {
      let state = store.getState()
      state.user.user.data && store.dispatch(listEventsByDate(undefined,moment().startOf('day'),state.user.user.data.id))
    })
}

function mapStateToProps({ user,auth, event,alert }) {
  return { user, auth, event,alert };
}

export default {
  loadData,
  component: connect(
    mapStateToProps,
    { fetchUserById, fetchUser, listEventsByDate,createGroup }
  )(Profile)
};
