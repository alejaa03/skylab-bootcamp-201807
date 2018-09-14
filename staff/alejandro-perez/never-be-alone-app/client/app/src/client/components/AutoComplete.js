import React, { Component } from 'react';
import axios from 'axios'
import Autocomplete from "react-autocomplete";
import {withRouter,Redirect} from 'react-router-dom'


class AutoComplete extends Component {

  state = {
    value: "",
    groups: [],
    selected:null
  };

  requestTimer = null;

  render() {
    return <Autocomplete
    wrapperStyle={{ position: "relative", display: "inline-block" }}
    value={this.state.value}
    items={this.state.groups}
    menuStyle={{
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 1)',
      padding: '2px 0',
      fontSize: '90%',
      position: 'fixed',
      overflow: 'auto',
      maxHeight: '10%', // TODO: don't cheat, let it flow to the bottom
    }}
    getItemValue={item => item.name}
    onSelect={(value, item) => {
      this.setState({ value, groups: [item]},() => {
        this.props.history.push(`/group/${item.id}`)
      })
    }}
    onChange={(event, value) => {
      this.setState({ value });
      clearTimeout(this.requestTimer)
      this.requestTimer = setTimeout(() => {
        axios
          .get(`https://neverbealone-api.herokuapp.com/api/groups?name=${value}`)
          .then(res => {
            this.setState({
              groups: res.data.data
            });
          });
      }, 500);

    }}
    renderMenu={children => <div className="menu">{children}</div>}
    renderItem={(item, isHighlighted) => (
      <div
        className={`item ${isHighlighted ? "item-highlighted" : ""}`}
        key={item.abbr}
        style={{cursor:"pointer",backgroundColor:"rgba(0, 0, 0, 0.4)"}}
      >
        <a>{item.name}</a>
      </div>
    )}
  />
  }


}

// function mapStateToProps({ group }) {
//   return { group };
// }

// export default withRouter(connect(
//     mapStateToProps,
//     { fetchGroupById }
//   )(AutoComplete))

export default withRouter(AutoComplete)