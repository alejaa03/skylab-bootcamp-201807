import React, { Component } from "react";
import SearchPanel from "./components/SearchPanel";
import ResultList from "./components/ResultList";
import logic from "./logic";
import logo from "./logo.svg";
import "./App.css";

logic.token =
  "BQBy80fVhPGABJcIsGhT8kQH6u5zrkuJ1m78JmjWj8fpKR4KwGW2op2fNhaxl6whgdsFrgfKLQazG1TfXcCFsygttEu8zOFgP0vCwyANFmYNH-VT3p1oW0StGHish-wynKtKSyxLsLpRVwf48UXmdQY3hK4jeaUlNipLC90mHQCVCtm364Jn";

class App extends Component {
  state = {
    data: []
  };

  searchAPI = query => {
    logic.searchArtists(query).then(artists =>
      this.setState({
        data: artists.map(artist => {
          return { id: artist.id, text: artist.name };
        })
      })
    );
  };

  onArtistClick = id => {
    logic.retrieveAlbumsByArtistId(id).then(albums =>
      this.setState({
        data: albums.map(album => {
          return { id: album.id, text: album.name };
        })
      })
    );
  };



  // '<iframe src="https://open.spotify.com/embed?uri=spotify:track:'+ id +'" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <SearchPanel searchAPI={this.searchAPI} />
        <ResultList
          results={this.state.data}
          onItemClick={this.onArtistClick}
        />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
