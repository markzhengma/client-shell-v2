import React, { Component } from 'react';

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
      selectedValue: '',
      selectedFilter: ''
    }
  };

  componentDidMount(){
    // if(this.props.admin === ''){
    //   this.props.handlePageChange('login');
    // }else {
      this.getGiftData();
      this.getOperatorData();
      this.getProductData();
      this.setState({
        action: 'recent_record'
      })
    // }
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
        this.props.showAlert('操作成功',`成功创建赠品！\n赠品名称：${res.data.gift_name}`, true);
        this.getGiftData();
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false)
      })
  };
  deleteGiftData(id) {
    axios.delete(`https://api.hulunbuirshell.com/api/gift/single/${id}`)
      .then(res => {
        console.log(res);
        this.props.showAlert('操作成功', '成功删除赠品！', true);
        this.getGiftData();
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false)
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
        this.props.showAlert('出错了', err, false)
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
        this.props.showAlert('操作成功', `创建成功！\n操作人：${res.data.op_name}\n，门店地区：${res.data.location}`, true);
        this.getOperatorData();
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false)
      })
  };
  deleteOperatorData(id) {
    axios.delete(`https://api.hulunbuirshell.com/api/operator/single/${id}`)
      .then(res => {
        console.log(res);
        this.props.showAlert('操作成功', '成功删除操作人', true);
        this.getOperatorData();
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false)
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
        this.props.showAlert('出错了', err, false)
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
        this.props.showAlert('操作成功', `成功创建产品！\n产品名称：${res.data.product_name}\n产品分类：${res.data.product_type}`, true);
        this.getProductData();
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false)
      })
  };
  deleteProductData(id) {
    axios.delete(`https://api.hulunbuirshell.com/api/product/single/${id}`)
      .then(res => {
        console.log(res);
        this.props.showAlert('操作成功', '成功删除产品信息', true);
        this.getProductData();
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false)
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

  selectFindUserValue(filter, value){
    this.setState({
      selectedFilter: filter,
      selectedValue: value
    })
  };

  render() {
    return (
      <div className = "admin">
        <div className = "nav-bar">
          <div className="nav-btn-group">
            <div className="nav-btn" onClick = {() => this.changeAction('find_user')}>查找用户</div>
            <div className="nav-btn" onClick = {() => this.changeAction('new_user')}>创建用户</div>
            <div className="nav-btn" onClick = {() => this.changeAction('recent_record')}>浏览记录</div>
            <div className="nav-btn" onClick = {() => this.changeAction('recent_user')}>浏览用户</div>
            {this.props.adminwx.super_admin ? 
              <div className="nav-btn" onClick = {() => this.changeAction('manage_data')}>编辑基本信息</div>
            : ''}
          </div>
        </div>
        { this.state.action === 'find_user' ? 
          <FindUser 
            giftData = {this.state.giftData}
            productData = {this.state.productData}
            operatorData = {this.state.operatorData}
            selectedValue = {this.state.selectedValue}
            selectedFilter = {this.state.selectedFilter}
            showAlert = {this.props.showAlert}
          /> 
          : 
          '' 
        }
        { this.state.action === 'new_user' ? 
          <NewUser 
            showAlert = {this.props.showAlert}  
            changeAction = {this.changeAction.bind(this)}
            admin = {this.props.admin}
            adminwx = {this.props.adminwx}
            selectFindUserValue = {this.selectFindUserValue.bind(this)}
          /> 
        : '' }
        { this.state.action === 'recent_record' ? 
          <RecentRecord 
            showAlert = {this.props.showAlert}
            changeAction = {this.changeAction.bind(this)}
            admin = {this.props.admin}
            adminwx = {this.props.adminwx}
            selectFindUserValue = {this.selectFindUserValue.bind(this)}
          /> 
        : '' }
        { this.state.action === 'recent_user' ? 
          <RecentUser 
            showAlert = {this.props.showAlert}
            changeAction = {this.changeAction.bind(this)}
            admin = {this.props.admin}
            adminwx = {this.props.adminwx}
            selectFindUserValue = {this.selectFindUserValue.bind(this)}
          /> 
        : '' }
        { this.state.action === 'manage_data' ? 
          <ManageData 
            showAlert = {this.props.showAlert}

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