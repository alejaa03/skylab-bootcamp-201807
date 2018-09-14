import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchGroupById, fetchUser,joinGroup,leaveGroup, createEvent, acceptUser, rejectUser,kickUser,updateRole } from "./../redux/actions/user";
import logic from "../../logic";
import moment from 'moment'
import {Helmet} from 'react-helmet'
import DatePicker from 'react-datepicker';
import 'moment-duration-format';
import List from 'react-virtualized/dist/commonjs/List'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import swal from 'sweetalert';
import Geosuggest from 'react-geosuggest';
import {Link} from 'react-router-dom'
import {Modal,ModalBody,ModalFooter,ModalHeader,Button} from 'reactstrap'
import {alertActions} from '../redux/actions/alert'
import store from '../redux/store'


const initialState = {
  modal:false,
  date:moment(),
  addressSuggest: undefined,
  description:null,
  duration:null,
  name:null,
  category:null,
  UserModal:false,
}

class Group2 extends Component {

  state = initialState

  toggle = () => {
    this.setState({...initialState,modal:!this.state.modal}, () => {
      return store.dispatch(alertActions.clear())
    })
  }

  toggleUser = () => {
    this.setState({UserModal:!this.state.UserModal})
  }

  
  componentDidMount() {

    const {
      group: {
        group: { data }
      }
    } = this.props

    return Promise.resolve()
    .then(() => {
      if(logic.isLogged()) this.props.fetchUser()
      return this.props.fetchGroupById(this.props.match.params.id)
        .then(() => {
          if(this.EventsList) return this.EventsList.forceUpdateGrid()
        })
    })
  }

  rowRenderer= ({ style, key, index }) => (
    <li style={style} key={key} className="list-group-item mb-2 list-group-item-light border-bottom border-dark" > {(this.props.auth.auth && this.checkIfPower('owner')) && (!this.checkIfPower('owner',this.props.group.group.data.users[index]._id) && <div><i style={{cursor:"pointer"}} onClick={() => this.updateRole(this.props.group.group.data.users[index]._id)} class="fas fa-arrows-alt-v"></i><i style={{cursor:"pointer"}} onClick={() => this.kickUser(this.props.group.group.data.users[index]._id)} class="fas fa-user-minus"></i></div>)} <img src={this.props.group.group.data.users[index].photoProfile} style={{width:'5rem'}} className="rounded-circle img-thumbnail "/> <Link to={`/profile/${this.props.group.group.data.users[index]._id}`}>  {`${this.props.group.group.data.users[index].name} ${this.props.group.group.data.users[index].surname}`}</Link> <div className="ml-auto">{this.props.group.group.data.users[index].groups.find(elem => elem.group === this.props.group.group.data.id).role === 'owner' ? "OWNER" : (this.props.group.group.data.users[index].groups.find(elem => elem.group === this.props.group.group.data.id).role === 'admin' ? "ADMIN" : "") }</div> </li>
  )
  EventRowRenderer = ({ style, key, index }) => (
    <li style={style} key={key} className="list-group-item mb-2 list-group-item-light border-bottom border-dark" > <i class="fas fa-user-check">  {`  ${this.props.group.group.data.events[index].attendees.length}`}</i> <Link to={`/event/${this.props.group.group.data.events[index]._id}`} >  {`${this.props.group.group.data.events[index].name}`}</Link> <i class="fas fa-clock ml-auto">{moment.duration(this.props.group.group.data.events[index].duration,'minutes').format('h:mm')}</i> </li>
  )
  UserRowRenderer= ({ style, key, index }) => (
    <li style={style} key={key} className="list-group-item mb-2 list-group-item-light border-bottom border-dark"> <img src={this.props.group.group.data.pendings[index].photoProfile} className="rounded-circle img-thumbnail" style={{width:"2.5rem",height:"auto"}}/> <Link to={`/profile/${this.props.group.group.data.pendings[index]._id}`}>{this.props.group.group.data.pendings[index].name}</Link> <div className="ml-auto"><i style={{cursor:"pointer"}} onClick={() => this.handleAcceptUser(this.props.group.group.data.pendings[index]._id)} class="material-icons">check</i> <i style={{cursor:"pointer"}} onClick={() => this.handleRejectUser(this.props.group.group.data.pendings[index]._id)} class="material-icons">clear</i></div>  </li>
  )
  handleJoin = () => {
    const {auth:{ auth,user }} = this.props;
    const id = this.props.match.params.id;

    auth
      ? this.props.joinGroup(id,user.data.id)
      : this.props.history.push(`/login?ref=group&id=${id}`)
  }

  handleLeave = () => {
    const {auth:{ auth,user }} = this.props;
    const id = this.props.match.params.id;

    auth
      && this.props.leaveGroup(id,user.data.id).then(() => this.props.fetchUser())
  }

  checkIfPower = (role = 'owner',id=this.props.auth.user.data.id) => {
    const {
      group: {
        group: { data }
      },
      auth:{auth,user:{data:UserData}}
    }
    = this.props
    const tempData = data.users.find(elem => (elem.groups.find(elem => elem.group === data.id).role === role))
    if(tempData) return tempData._id === id
    else false
  }

  kickUser = (targetId) => {
    const {
      group: {
        group: { data }
      }
    }
    = this.props
    return this.props.kickUser(targetId,data.id) //TODO HANDLING
  }

  deleteGroup = () => {
    const {
      group: {
        group: { data },
      },
      auth:{auth,user:{data:UserData}}
    }
    = this.props
    return swal({
      title: "Are you sure?",
      text: "Once deleted, you won't be able to recover data from this group!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        return logic.deleteGroup(data.id)
          .then(() => {
            swal(`Poof! Group ${data.name} has been deleted :(` , {
              icon: "success",
            }).then(() => this.props.history.push(`/profile/${UserData.id}`))
          })
        }
    });
  }

  redirectProfile = () =>{
    const {
      group: {
        group: { data },
      },
      auth:{auth,user:{data:UserData}}
    } = this.props
  }

  updateRole = targetId => {
    const {
      group: {
        group: { data }
      },
      auth:{auth,user:{data:UserData}}
    }
    = this.props

    return this.props.updateRole(targetId,data.id)
      .then(() => this.listRef.forceUpdateGrid())
  }

  handleSuggest = addressSuggest => {
    return this.setState({addressSuggest})
  }

  handleEventDateChange = date => {
    return this.setState({date})
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }
  handleEventSubmit = e => {
    e.preventDefault()

    let formatted_address
    
    this.state.addressSuggest ? formatted_address = this.state.addressSuggest.gmaps.formatted_address : formatted_address = undefined

    const { 
      category,
      duration,
      name,
      description,
      date
      } = this.state

      const { 
      group: {
        group: { data },
      }
    } = this.props
    return this.props.createEvent(data.id,name,description,date,category,moment.duration(duration).asMinutes(),{name:formatted_address})
      .then(() => {
        (!this.props.alert || !Object.keys(this.props.alert).length) && this.toggle() 
      })
  }

  handleAcceptUser = id => {
    const {
      group: {
        group: { data }
      },
      auth:{auth,user:{data:UserData}}
    }
    = this.props
    return this.props.acceptUser(id,data.id)
      .then(() => console.log("ACCEPTED") ) // TODO FEEDBACK
  }

  handleRejectUser = id => {
    const {
      group: {
        group: { data }
      },
      auth:{auth,user:{data:UserData}}
    }
    = this.props
    return this.props.rejectUser(id,data.id)
      .then(() => console.log("Rejected") ) //TODO FEEDBACK
  }

  render() {
    const {
      group: {
        group: { data }
      },
      auth:{auth,user:{data:UserData}},
      alert
    }
    = this.props
    return (
          data ? <div className="profile-page" style={{minHeight: '1200px'}}> 
          <Helmet>
            <link href="/assets/css/Autosuggest.css" type="text/css" rel="stylesheet"/>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCZkOG7gybArplUzsN8NXLh2St13LjpbH4&libraries=places"></script>
          </Helmet>
            <div className="page-header header-filter" data-parallax="true" style={{"backgroundImage": 'url(../assets/img/parallax.jpg)'}}></div>
            <div className="main main-raised" style={{minHeight: '800px'}}>
              <div className="profile-content">
                <div className="container">
                  <div className="row">
                    <div className="col-md-6 ml-auto mr-auto">
                      <div className="profile">
                      <div className="avatar">
                        <h3 className="title">{data.name}</h3>
                        <div className="mr-auto">
                        {(auth && (data.pendings.find(elem => elem._id === UserData.id))) ? <button className="btn btn-primary btn-round" disabled onClick={this.handleJoin}><i class="material-icons">group_add</i>
                              JOIN GROUP
                          </button> :((auth && this.checkIfPower('owner') ? <button className="btn btn-danger btn-round" onClick={this.deleteGroup}>                   <i class="material-icons">exit_to_app</i>
                              DELETE GROUP
                          </button>  : ((auth && (UserData.groups.find(elem =>  elem.group.id === data.id))) ? <button className="btn btn-outline-danger btn-round" onClick={this.handleLeave}>                   <i class="material-icons">exit_to_app</i>
                              ABANDON GROUP
                          </button> : (<button className="btn btn-primary btn-round" onClick={this.handleJoin}>                   <i class="material-icons">group_add</i>
                              JOIN GROUP
                          </button>))))}
                          </div>
                          <a><i class="material-icons">group</i>{data.users.length}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="description text-center">
                    <p>{data.description}</p>
                  </div>
                    <div className="row">
                      <div className="col-md-6 text-center">
                        <div className="main main-raised mt-5">
                          <ul className="list-group" style={{minHeight:'28rem',padding:'20'}}>
                          {(auth && (this.checkIfPower('admin') || this.checkIfPower('owner'))) ? <div className="d-flex flex-row-reverse">
                                <Button className="btn btn-outline-success btn-round" onClick={this.toggle}>ADD EVENT!</Button>
                                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                                  <ModalHeader toggle={this.toggle}>Add Event!</ModalHeader>
                                  {alert && alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div> : ""}
                                    <form onSubmit={this.handleEventSubmit}>
                                    <ModalBody>
                                    <div class="form-group">
                                      <label htmlFor="name" class="col-form-label">Name:</label>
                                      <input type="text" autoComplete="off" onChange={this.handleChange} name="name" class="form-control" id="event-name"/>
                                    </div>
                                    <div class="form-group">
                                      <label htmlFor="description" class="col-form-label">Description:</label>
                                      <textarea class="form-control" onChange={this.handleChange} name="description" id="event-description"></textarea>
                                    </div>
                                    <div class="form-group">
                                      <label htmlFor="date" class="col-form-label">Date:</label>
                                      <DatePicker
                                              name="date"
                                              className="form-control"
                                              selected={this.state.date}
                                              onChange={this.handleEventDateChange}
                                              locale="es-ES"
                                              showTimeSelect
                                              timeFormat="HH:mm"
                                              timeIntervals={15}
                                              dateFormat="LLL"
                                              timeCaption="time"
                                          />
                                    </div>
                                    <div class="form-group">
                                      <label htmlFor="category" class="col-form-label">Category:</label>
                                      <select class="custom-select"  onChange={this.handleChange} name="category" id="event-category">
                                        <option defaultValue>Select a category</option>
                                        <option value="gastronomy">Gastronomy</option>
                                        <option value="sport">Sport</option>
                                        <option value="culture">Culture</option>
                                        <option value="music">Music</option>
                                        <option value="tecnologic">Tecnology</option>
                                        <option value="party">Party</option>
                                      </select>
                                    </div>
                                    <div class="form-group">
                                      <label htmlFor="duration" class="col-form-label">Duration:</label>
                                      <input type="time" name="duration" onChange={this.handleChange} class="form-control" id="event-duration"></input>
                                    </div>
                                    <div class="form-group">
                                      <label htmlFor="address" class="col-form-label">Address:</label>
                                    <div>
                                <Geosuggest
                                  name="location"
                                  ref={el=>this._geoSuggest=el}
                                  placeholder="Start typing!"
                                  initialValue=""
                                  onSuggestSelect={this.handleSuggest}
                                  className="geosuggest__input"
                                  autoComplete="off"
                                  />
                              </div>
                              </div>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="primary" type="submit">Submit</Button>{' '}
                              <Button color="secondary" type="button" onClick={this.toggle}>Cancel</Button>
                            </ModalFooter>
                              </form>
                          </Modal>
                        </div> : ""}
                            <h5 className="title border-bottom border-light">EVENTS</h5>
                            <AutoSizer defaultHeight={250} defaultWidth={480}>
                            {({ height, width }) => (
                              <List
                                height={250}
                                rowCount={data.events.length}
                                rowHeight={50}
                                rowRenderer={this.EventRowRenderer}
                                width={width}
                                ref={c => this.EventsList = c}
                              />
                            )}
                          </AutoSizer>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-6 text-center">
                        <div className="main main-raised mt-5">
                          <ul className="list-group" style={{minHeight:'28rem',padding:'20'}}>
                          {(auth && (this.checkIfPower('admin') || this.checkIfPower('owner'))) ? <div className="d-flex flex-row-reverse">
                                <Button className="btn btn-outline-warning btn-round" onClick={this.toggleUser}>MANAGE REQUESTS <span class="badge badge-pill badge-danger">{data.pendings.length}</span></Button>
                                <Modal  isOpen={this.state.UserModal} toggle={this.toggleUser} className={this.props.className}>
                                  <ModalHeader toggle={this.toggleUser}>Requests</ModalHeader>
                                    <ModalBody style={{minHeight:'28rem',padding:'20'}}>
                                    <AutoSizer defaultHeight={250} defaultWidth={480}>
                                    {({ height, width }) => (
                                      <List
                                        height={height}
                                        rowCount={data.pendings.length}
                                        rowHeight={50}
                                        rowRenderer={this.UserRowRenderer}
                                        width={width}
                                      />
                                    )}
                                  </AutoSizer>
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button color="primary" onClick={this.toggleUser}>Done</Button>{' '}
                                    </ModalFooter>
                                  </Modal>
                          </div> : ""}
                            <h5 className="title border-bottom border-light">USERS</h5>
                              <AutoSizer defaultHeight={250} defaultWidth={480}>
                                {({ height, width }) => (
                                  <List
                                    ref={ref => this.listRef = ref}
                                    height={250}
                                    rowCount={data.users.length}
                                    rowHeight={100}
                                    rowRenderer={this.rowRenderer}
                                    width={width}
                                  />
                                )}
                            </AutoSizer>
                          </ul>
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
  return store.dispatch(fetchGroupById(params.id))
}

function mapStateToProps({ group,auth,alert }) {
  return { group, auth, alert };
}

export default {
  loadData,
  component: connect(
    mapStateToProps,
    { fetchGroupById, fetchUser,joinGroup,leaveGroup, createEvent, acceptUser,rejectUser,kickUser,updateRole }
  )(Group2)
};
