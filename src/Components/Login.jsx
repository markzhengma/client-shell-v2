import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      admin_name: '',
      admin_pass: ''
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

  handleAdminLogin = (e) => {
    e.persist();
    e.preventDefault();
    if(this.state.admin_name === "" || this.state.admin_pass === "") {
      alert('请输入管理员账号和密码');
    } else {
      axios.get(`https://api.hulunbuirshell.com/api/admin/login?admin=${this.state.admin_name}&pass=${this.state.admin_pass}`)
        .then(res => {
          if(res.data.code !== 200){
            if(res.data.code === 422){
              alert('输入格式有误')
            } else {
              alert('请再次检查账号和密码')
            }
          } else {
            this.props.setAdmin(res.data.data);
            this.props.handlePageChange('admin');
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  };

  render() {
    return (
      <div className = "login">
        <Form className = "login-form" onSubmit = {this.handleAdminLogin.bind(this)}>
          <Form.Group>
            <Form.Label>管理员账号</Form.Label>
            <Form.Control name = "admin_name" value = {this.state.admin_name} onChange = {this.handleChange.bind(this)} type="text" placeholder="管理员账号" />
          </Form.Group>

          <Form.Group>
            <Form.Label>管理员密码</Form.Label>
            <Form.Control name = "admin_pass" value = {this.state.admin_pass} onChange = {this.handleChange.bind(this)} type="password" placeholder="管理员密码" />
          </Form.Group>

          <Button variant="success" type = "submit">登录</Button>
        </Form>
      </div>
    )
  }
}

export default Login;