import React, { Component } from 'react';
import axios from 'axios';

import UserSingle from './UserSingle';

class FindUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      filter: 'record_num',
      value: '',
      data: ''
    }
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  };

  handleFindUserSubmit(e) {
    e.preventDefault();
    axios.get(`http://localhost:7001/api/user/single?filter=${this.state.filter}&value=${this.state.value}`)
        .then(res => {
          if(res.data.code !== 200){
            alert(res.data)
          } else {
            this.setState({
              data: res.data.data
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
  }

  render() {
    return (
      <div>
        <form onSubmit = {this.handleFindUserSubmit.bind(this)}>
          <select name = "filter" value = {this.state.filter} onChange = {this.handleChange.bind(this)}>
            <option value = "record_num">按换油证号查找</option>
            <option value = "phone">按手机号查找</option>
            <option value = "plate">按车牌号查找</option>
          </select>
          <input type = "text" name = "value" value = {this.state.value} onChange = {this.handleChange.bind(this)} placeholder = "内容"></input>
          <button type = "submit">查找</button>
        </form>
        {this.state.data !== '' ? 
          <UserSingle data = {this.state.data}/>
        : ""}
      </div>
    )
  }
}

export default FindUser;