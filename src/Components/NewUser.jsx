import React, { Component } from 'react';
import axios from 'axios';

import UserSingle from './UserSingle';
import { Form, Button, Card } from 'react-bootstrap';

class NewUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      isManual: false,
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

  changeManualState() {
    this.setState({
      isManual: !this.state.isManual
    })
  }

  handleNewUserSubmit(e) {
    e.preventDefault();
    let confirmed = window.confirm(`请核对新用户信息：\n客户姓名：${this.state.user_name}\n换油证号：${this.state.isManual ? this.state.record_num : '自动生成 - ' + this.props.admin.location}\n联系方式：${this.state.phone}\n车型：${this.state.make}\n车牌号：${this.state.plate}`);
    if(confirmed){
      axios({
        // url: `https://api.hailarshell.cn/api/user/single`,
        url: `https://api.hailarshell.cn/api/user/single${this.state.isManual ? '' : '/' + this.props.admin.location_char}`,
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
          <Card bg="dark" text="white" border="light" className = "user-single">
            <UserSingle userData = {this.state.userData}/>
          </Card>
          <h5>请返回<Button variant = "secondary" onClick = {() => this.props.changeAction('find_user')}>查找老用户</Button>来查找该用户，并添加保养记录。</h5>
        </div>
        : 
        <Form className = "user-form">
          <Form.Label>
            客户姓名：
          </Form.Label>
          <Form.Control type = "text" name = "user_name" onChange = {this.handleChange.bind(this)} value = {this.state.user_name}></Form.Control>
          <Form.Label>
            换油证号：{this.props.admin.location}门店
          </Form.Label>
          <Form.Check onChange = {this.changeManualState.bind(this)} type="checkbox" label="手动输入门店换油证号" />
          <Form.Control type = "text" name = "record_num" onChange = {this.handleChange.bind(this)} value = {this.state.record_num} disabled = {this.state.isManual ? "" : "disabled"}></Form.Control>
          <Form.Label>
            联系方式：
          </Form.Label>
          <Form.Control type = "text" name = "phone" onChange = {this.handleChange.bind(this)} value = {this.state.phone}></Form.Control>
          <Form.Label>
            车牌号：
          </Form.Label>
          <Form.Control type = "text" name = "plate" onChange = {this.handleChange.bind(this)} value = {this.state.plate}></Form.Control>
          <Form.Label>
            车型：
          </Form.Label>
          <Form.Control type = "text" name = "make" onChange = {this.handleChange.bind(this)} value = {this.state.make}></Form.Control>
          <Button variant = "info" onClick = {this.handleNewUserSubmit.bind(this)}>创建</Button>
        </Form>
        }
        
      </div>
    )
  }
}

export default NewUser;