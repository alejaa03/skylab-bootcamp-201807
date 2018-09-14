import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    const {
      event
    } = this.props
    return (
      <Map google={this.props.google}
          onClick={this.onMapClicked}
          initialCenter={{
            lat: event.location.coords[0],
            lng: event.location.coords[1]
          }}
          center={{
            lat: event.location.coords[0],
            lng: event.location.coords[1]
          }}
          style={{width:'100%',height:'350px'}}
          >
        <Marker onClick={this.onMarkerClick}
                name={event.name} 
                position={{lat: event.location.coords[0],lng: event.location.coords[1]}}
        />

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCZkOG7gybArplUzsN8NXLh2St13LjpbH4')
})(MapContainer)