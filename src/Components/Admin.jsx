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
    axios.get('https://api.hulunbuirshell.com/api/gift/all')
      .then(res => {
        this.setState({
          giftData: res.data
        });
      })
      .catch(err => {
        console.log(err);
      })
  };
  createGiftData(data) {
    axios({
      url: 'https://api.hulunbuirshell.com/api/gift/single',
      method: 'POST',
      data: data
    })
      .then(res => {
        console.log(res);
        alert(`创建成功！\n赠品名称：${res.data.gift_name}`)
        this.getGiftData();
      })
      .catch(err => {
        alert(err)
      })
  };
  deleteGiftData(id) {
    axios.delete(`https://api.hulunbuirshell.com/api/gift/single/${id}`)
      .then(res => {
        console.log(res);
        alert('删除成功！');
        this.getGiftData();
      })
      .catch(err => {
        alert(err);
      })
  }
  getOperatorData(){
    axios.get('https://api.hulunbuirshell.com/api/operator/all')
      .then(res => {
        this.setState({
          operatorData: res.data
        });
      })
      .catch(err => {
        console.log(err);
      })
  };
  createOperatorData(data) {
    axios({
      url: 'https://api.hulunbuirshell.com/api/operator/single',
      method: 'POST',
      data: data
    })
      .then(res => {
        console.log(res);
        alert(`创建成功！\n操作人：${res.data.op_name}\n门店地区：${res.data.location}`)
        this.getOperatorData();
      })
      .catch(err => {
        alert(err)
      })
  };
  deleteOperatorData(id) {
    axios.delete(`https://api.hulunbuirshell.com/api/operator/single/${id}`)
      .then(res => {
        console.log(res);
        alert('删除成功！');
        this.getOperatorData();
      })
      .catch(err => {
        alert(err);
      })
  }
  getProductData(){
    axios.get('https://api.hulunbuirshell.com/api/product/all')
      .then(res => {
        this.setState({
          productData: res.data
        });
      })
      .catch(err => {
        console.log(err);
      })
  };
  createProductData(data) {
    axios({
      url: 'https://api.hulunbuirshell.com/api/product/single',
      method: 'POST',
      data: data
    })
      .then(res => {
        console.log(res);
        alert(`创建成功！\n产品名称：${res.data.product_name}\n产品分类：${res.data.product_type}`)
        this.getProductData();
      })
      .catch(err => {
        alert(err)
      })
  };
  deleteProductData(id) {
    axios.delete(`https://api.hulunbuirshell.com/api/product/single/${id}`)
      .then(res => {
        console.log(res);
        alert('删除成功！');
        this.getProductData();
      })
      .catch(err => {
        alert(err);
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
          <ManageData 
            getGiftData = {this.getGiftData.bind(this)}
            getOperatorData = {this.getOperatorData.bind(this)}
            getProductData = {this.getProductData.bind(this)}

            giftData = {this.state.giftData}
            operatorData = {this.state.operatorData}
            productData = {this.state.productData}

            createGiftData = {this.createGiftData.bind(this)}
            deleteGiftData = {this.deleteGiftData.bind(this)}
            
            createProductData = {this.createProductData.bind(this)}
            deleteProductData = {this.deleteProductData.bind(this)}

            createOperatorData = {this.createOperatorData.bind(this)}
            deleteOperatorData = {this.deleteOperatorData.bind(this)}
          /> 
        : '' }
      </div>
    )
  }
}

export default Admin;