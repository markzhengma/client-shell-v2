import React, { Component } from 'react';
import axios from 'axios';

import UserSingle from './UserSingle';

class NewUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      userData: '',
      user_name: '',
      record_num: '',
      phone: '',
      plate: '',
      make: ''
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

  handleNewUserSubmit(e) {
    e.preventDefault();
    let confirmed = window.confirm(`请核对新用户信息：\n${this.state.user_name}\n${this.state.record_num}\n${this.state.phone}\n${this.state.make}\n${this.state.plate}`);
    if(confirmed){
      axios({
        url: `http://123.207.165.116:7001/api/user/single`,
        method: 'POST',
        data: {
          make: this.state.make,
          phone: this.state.phone,
          plate: this.state.plate,
          record_num: this.state.record_num,
          user_name: this.state.user_name,
        }
      })
        .then(res => {
          if(res.data.code !== 200){
            alert(res.data.code + '\n' + JSON.stringify(res.data.data))
          } else {
            this.setState({
              userData: res.data.data
            });
          }
        })
        .catch(err => {
          alert(err);
        })
    }
  }

  render() {
    return (
      <div>
        {this.state.userData !== '' ? 
        <div>
          <h3>新用户：</h3>
          <UserSingle userData = {this.state.userData}/>
        </div>
        : 
          <div className = "user-box">
            客户姓名：<input className = "input-single" name = "user_name" onChange = {this.handleChange.bind(this)} value = {this.state.user_name}></input>
            换油证号：<input className = "input-single" name = "record_num" onChange = {this.handleChange.bind(this)} value = {this.state.record_num}></input>
            联系方式：<input className = "input-single" name = "phone" onChange = {this.handleChange.bind(this)} value = {this.state.phone}></input>
            车牌号：<input className = "input-single" name = "plate" onChange = {this.handleChange.bind(this)} value = {this.state.plate}></input>
            车型：<input className = "input-single" name = "make" onChange = {this.handleChange.bind(this)} value = {this.state.make}></input>
            <button className = "submit-btn" onClick = {this.handleNewUserSubmit.bind(this)}>创建</button>
          </div>
        }
        
      </div>
    )
  }
}

export default NewUser;