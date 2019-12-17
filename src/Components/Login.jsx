import React, { Component } from 'react';
import axios from 'axios';

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
    e.preventDefault();
    if(this.state.admin_name === "" || this.state.admin_pass === "") {
      alert('请输入管理员账号和密码');
    } else {
      axios.get(`http://123.207.165.116:7001/api/admin/login?admin=${this.state.admin_name}&pass=${this.state.admin_pass}`)
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
      <div>
        <form onSubmit = {this.handleAdminLogin.bind(this)}>
          <input type = "text" name = "admin_name" value = {this.state.admin_name} onChange = {this.handleChange.bind(this)} placeholder = "管理员账号"></input>
          <input type = "password" name = "admin_pass" value = {this.state.admin_pass} onChange = {this.handleChange.bind(this)} placeholder = "管理员密码"></input>
          <button type = "submit">登录</button>
        </form>
      </div>
    )
  }
}

export default Login;