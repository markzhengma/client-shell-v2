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
        <div>姓名：{this.props.data.record_num || ''}</div>
        <div>换油证号：{this.props.data.record_num || ''}</div>
        <div>联系方式：{this.props.data.phone || ''}</div>
        <div>车牌号：{this.props.data.plate || ''}</div>
        <div>车型：{this.props.data.make || ''}</div>
        <div>备注：{this.props.data.detail || ''}</div>
      </div>
    )
  }
}

export default UserSingle;