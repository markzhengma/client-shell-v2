import React, { Component } from 'react';

import FindUser from './FindUser';
import NewUser from './NewUser';

class Admin extends Component {
  constructor(props){
    super(props);
    this.state = {
      action: 'find_user'
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

  changeAction(action) {
    this.setState({
      action: action
    })
  }

  render() {
    return (
      <div className = "admin">
        <div className = "nav-bar">
          <div className = "nav-btn" onClick = {() => this.changeAction('find_user')}>查找老用户</div>
          <div className = "nav-btn" onClick = {() => this.changeAction('new_user')}>创建新用户</div>
        </div>
        { this.state.action === 'find_user' ? <FindUser/> : '' }
        { this.state.action === 'new_user' ? <NewUser changeAction = {this.changeAction.bind(this)}/> : '' }
      </div>
    )
  }
}

export default Admin;