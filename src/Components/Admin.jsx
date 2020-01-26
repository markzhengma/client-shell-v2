import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import FindUser from './FindUser';
import NewUser from './NewUser';
import RecentRecord from './RecentRecord';
import RecentUser from './RecentUser';
import ManageData from './ManageData';
import axios from 'axios';

class Admin extends Component {
  constructor(props){
    super(props);
    this.state = {
      action: '',
      giftData: [],
      operatorData: [],
      productData: [],
      selectedRecordNum: ''
    }
  };

  componentDidMount(){
    if(this.props.admin === ''){
      this.props.handlePageChange('login');
    }else {
      this.getGiftData();
      this.getOperatorData();
      this.getProductData();
      this.setState({
        action: 'recent_record'
      })
    }
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
  };

  selectRecordNum(record_num){
    this.setState({
      selectedRecordNum: record_num
    })
  };

  render() {
    return (
      <div className = "admin">
        <div className = "nav-bar">
          {/* <ButtonGroup style = {{ width: 'fit-content', margin: '20px' }}>
            <Button variant = "secondary" style = {{ width: '160px' }} onClick = {() => this.changeAction('find_user')}>查找老用户</Button>
            <Button variant = "secondary" style = {{ width: '160px' }} onClick = {() => this.changeAction('new_user')}>创建新用户</Button>
            <Button variant = "secondary" style = {{ width: '160px' }} onClick = {() => this.changeAction('recent_record')}>浏览记录</Button>
            <Button variant = "secondary" style = {{ width: '160px' }} onClick = {() => this.changeAction('find_user')}>查找老用户</Button>
            <Button variant = "secondary" style = {{ width: '160px' }} onClick = {() => this.changeAction('new_user')}>创建新用户</Button>
          </ButtonGroup> */}
          <div className="nav-btn-group">
            <div className="nav-btn" onClick = {() => this.changeAction('find_user')}>查找用户</div>
            <div className="nav-btn" onClick = {() => this.changeAction('new_user')}>创建用户</div>
            <div className="nav-btn" onClick = {() => this.changeAction('recent_record')}>浏览记录</div>
            <div className="nav-btn" onClick = {() => this.changeAction('recent_user')}>浏览用户</div>
            {this.props.admin.super_admin ? 
              <div className="nav-btn" onClick = {() => this.changeAction('manage_data')}>编辑基本信息</div>
            : ''}
          </div>
        </div>
        { this.state.action === 'find_user' ? 
          <FindUser 
            giftData = {this.state.giftData}
            productData = {this.state.productData}
            operatorData = {this.state.operatorData}
            selectedRecordNum = {this.state.selectedRecordNum}
          /> 
          : 
          '' 
        }
        { this.state.action === 'new_user' ? 
          <NewUser 
            changeAction = {this.changeAction.bind(this)}
            admin = {this.props.admin}
            selectRecordNum = {this.selectRecordNum.bind(this)}
          /> 
        : '' }
        { this.state.action === 'recent_record' ? 
          <RecentRecord 
            changeAction = {this.changeAction.bind(this)}
            admin = {this.props.admin}
            selectRecordNum = {this.selectRecordNum.bind(this)}
          /> 
        : '' }
        { this.state.action === 'recent_user' ? 
          <RecentUser 
            changeAction = {this.changeAction.bind(this)}
            admin = {this.props.admin}
            selectRecordNum = {this.selectRecordNum.bind(this)}
          /> 
        : '' }
        { this.state.action === 'manage_data' ? 
          <ManageData/> 
        : '' }
      </div>
    )
  }
}

export default Admin;