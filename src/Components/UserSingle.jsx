import React, { Component } from 'react';
import axios from 'axios';

class UserSingle extends Component {
  constructor(props){
    super(props);
    this.state = {
      filter: 'record_num',
      value: '',
      data: {}
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

  render() {
    return (
      <div>
        <div>姓名：{this.props.userData.user_name || ''}</div>
        <div>换油证号：{this.props.userData.record_num || ''}</div>
        <div>联系方式：{this.props.userData.phone || ''}</div>
        <div>车牌号：{this.props.userData.plate || ''}</div>
        <div>车型：{this.props.userData.make || ''}</div>
        <div>备注：{this.props.userData.detail || ''}</div>
      </div>
    )
  }
}

export default UserSingle;