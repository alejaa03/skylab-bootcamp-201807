import React, { Component } from "react";
import MapContainer from './MapContainer'
import logic from "../../logic";
import { connect } from "react-redux";
import { fetchUser,fetchEventById,attendEvent } from "./../redux/actions/user";
import moment from 'moment'
import 'moment-duration-format';
import List from 'react-virtualized/dist/commonjs/List'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import {Link} from 'react-router-dom'

class Event extends Component {

  componentDidMount() {


    const {
      singleEvent: {
        event
      }
    } = this.props

    return Promise.resolve()
    .then(() => {
      if(logic.isLogged()) this.props.fetchUser()
      return this.props.fetchEventById(this.props.match.params.id)
    })

  }

  attendeesRowRenderer = ({ style, key, index }) => (
    <li style={style} key={key} className="list-group-item mb-2 list-group-item-light border-bottom border-dark" > <i class="fas fa-user-check"></i> <Link to={`/profile/${this.props.singleEvent.event.attendees[index]._id}`}>{`${this.props.singleEvent.event.attendees[index].name} ${this.props.singleEvent.event.attendees[index].surname}`}</Link> </li>
  )

  handleAttendEvent = () => {
    const {
      singleEvent: { event },
      auth: { auth }
    } = this.props;
    auth
      ? this.props.attendEvent(event.id)
      : this.props.history.push(`/login?ref=event&id=${event.id}`)
  }


  render(){

    const {
      singleEvent: {
        event
      },
        auth:{auth,user:{data:UserData}}
    } = this.props

    return event.attendees ? <div>
    <div className="page-header header-filter" data-parallax="true" style={{"backgroundImage": 'url(../assets/img/parallax.jpg)'}}></div>
            <div className="main main-raised" style={{minHeight: '800px'}}>
              <div className="profile-content">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-10 ml-auto mr-auto">
                      <div className="profile">
                      <div className="avatar text-center">
                        <h3 className="title">{event.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 ml-auto mr-auto mb-auto mt-auto">
                    {UserData ? (event.attendees.find(elem => elem._id === UserData.id) ? <button onClick={this.handleAttendEvent} disabled className="btn disabled rounded btn-outline-success"><i class="far fa-hand-point-right"></i> You are in!</button> : <button onClick={this.handleAttendEvent} className="btn rounded btn-outline-primary"><i class="far fa-hand-point-right"></i> Join event!</button>) : <button onClick={this.handleAttendEvent} className="btn rounded btn-outline-primary"><i class="far fa-hand-point-right"></i> Join event!</button>}
                  </div>
                </div>
                    <div className="row">
                      <div className="col-md-6 text-center">
                        <div className="main main-raised mt-5">
                          <ul className="list-group" style={{minHeight:'28rem',padding:'20'}}>
                            <h5 className="title border-bottom border-light">ATTENDEES</h5>
                            <a><i class="material-icons">group</i>{event.attendees.length}</a>
                            <AutoSizer defaultHeight={250} defaultWidth={480}>
                            {({ height, width }) => (
                              <List
                                height={250}
                                rowCount={event.attendees.length}
                                rowHeight={50}
                                rowRenderer={this.attendeesRowRenderer}
                                width={width}
                              />
                            )}
                          </AutoSizer>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-6 text-center">
                        <div className="main main-raised mt-5">
                          <ul className="list-group" style={{minHeight:'28rem',padding:'20'}}>
                            <h5 className="title border-bottom border-light">Information</h5>
                            <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"><div className="mr-auto text-primary">Name:</div><div className="ml-auto">{event.name}</div></li>
                            <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"><div className="mr-auto text-primary">Description:</div><div className="ml-auto">{event.description}</div></li>
                            <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"><div className="mr-auto text-primary">Date:</div><div className="ml-auto">{moment(event.date).format("DD-MM-YY HH:mm")}</div></li>
                            <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"><div className="mr-auto text-primary">Duration:</div><div className="ml-auto">{moment.duration(event.duration,'minutes').format("hh:mm")}</div></li>
                            <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"><div className="mr-auto text-primary">Category:</div><div className="ml-auto">{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div></li>
                            <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"><div className="mr-auto text-primary">Organizer:</div><div className="ml-auto"> <img className="rounded-circle img-thumbnail" style={{width:'3.5rem'}} src={event.organizer.photoProfile}></img> <Link to={`/profile/${event.organizer._id}`}>{`${event.organizer.name} ${event.organizer.surname}`}</Link></div></li>
                            <li className="list-group-item mb-2 list-group-item-light border-bottom border-dark"><div className="mr-auto text-primary" style={{minHeight:"400px"}}>Location:<div className="mt-4"><MapContainer className="mr-auto" event={event}/></div></div></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> : ""
  }
  
}

function loadData(store, params) {
  return store.dispatch(fetchEventById(params.id))
}

function mapStateToProps({ singleEvent,auth }) {
  return { singleEvent, auth };
}

export default {
  loadData,
  component: connect(
    mapStateToProps,
    { fetchUser,fetchEventById,attendEvent }
  )(Event)
};