import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import FindUser from './FindUser';
import NewUser from './NewUser';
import RecentRecord from './RecentRecord';
import axios from 'axios';

class Admin extends Component {
  constructor(props){
    super(props);
    this.state = {
      action: 'recent_record',
      giftData: [],
      operatorData: [],
      productData: [],
    }
  };

  componentDidMount(){
    this.getGiftData();
    this.getOperatorData();
    this.getProductData();
  };

  getGiftData(){
    axios.get('https://api.hailarshell.cn/api/gift/all')
      .then(res => {
        this.setState({
          giftData: res.data
        });
      })
      .catch(err => {
        console.log(err);
      })
  }
  getOperatorData(){
    axios.get('https://api.hailarshell.cn/api/operator/all')
      .then(res => {
        this.setState({
          operatorData: res.data
        });
      })
      .catch(err => {
        console.log(err);
      })
  }
  getProductData(){
    axios.get('https://api.hailarshell.cn/api/product/all')
      .then(res => {
        this.setState({
          productData: res.data
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

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
          <ButtonGroup style = {{ width: '600px', margin: '20px' }}>
            <Button variant = "secondary" onClick = {() => this.changeAction('find_user')}>查找老用户</Button>
            <Button variant = "secondary" onClick = {() => this.changeAction('new_user')}>创建新用户</Button>
            <Button variant = "secondary" onClick = {() => this.changeAction('recent_record')}>浏览记录</Button>
          </ButtonGroup>
        </div>
        { this.state.action === 'find_user' ? 
          <FindUser 
            giftData = {this.state.giftData}
            productData = {this.state.productData}
            operatorData = {this.state.operatorData}
          /> 
          : 
          '' 
        }
        { this.state.action === 'new_user' ? 
          <NewUser 
            changeAction = {this.changeAction.bind(this)}
            admin = {this.props.admin}
          /> 
        : '' }
        { this.state.action === 'recent_record' ? 
          <RecentRecord 
            admin = {this.props.admin}
          /> 
        : '' }
      </div>
    )
  }
}

export default Admin;