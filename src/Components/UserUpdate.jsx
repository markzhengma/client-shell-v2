import React, { Component } from 'react';
import axios from 'axios';

class UserUpdate extends Component {
  constructor(){
    super();
    this.state = {
      filter: 'record_num',
      value: '',
      user_input: {
        user_name: '',
        phone: '',
        plate: '',
        make: '',
        detail: '',
      }
    };
  };

  componentWillMount(){
    this.setState({
      user_input: {
        user_name: this.props.userData.user_name,
        phone: this.props.userData.phone,
        plate: this.props.userData.plate,
        make: this.props.userData.make,
        detail: this.props.userData.detail,
      }
    })
  }

  handleUserUpdateChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      user_input: {
        ...this.state.user_input,
        [name]: value
      }
    })
  };

  render() {
    return (
      <div>
        {/* <div>姓名：{this.props.userData.user_name || ''}</div>
        <div>换油证号：{this.props.userData.record_num || ''}</div>
        <div>联系方式：{this.props.userData.phone || ''}</div>
        <div>车牌号：{this.props.userData.plate || ''}</div>
        <div>车型：{this.props.userData.make || ''}</div>
        <div>备注：{this.props.userData.detail || ''}</div> */}
        <form onSubmit = {(e) => this.props.confirmUserUpdate(e, this.state.user_input)}>
          <input value = {this.props.userData.record_num} disabled></input>
          <input name = "user_name" defaultValue = {this.props.userData.user_name} onChange = {this.handleUserUpdateChange.bind(this)}></input>
          <input name = "phone" defaultValue = {this.props.userData.phone} onChange = {this.handleUserUpdateChange.bind(this)}></input>
          <input name = "plate" defaultValue = {this.props.userData.plate} onChange = {this.handleUserUpdateChange.bind(this)}></input>
          <input name = "make" defaultValue = {this.props.userData.make} onChange = {this.handleUserUpdateChange.bind(this)}></input>
          <input name = "detail" defaultValue = {this.props.userData.detail} onChange = {this.handleUserUpdateChange.bind(this)}></input>
          <button type = "submit">保存</button>
        </form>
      </div>
    )
  }
}

export default UserUpdate;