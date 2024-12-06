import React, { Component } from 'react';
import DataList from './DataList';
import AdminList from './AdminList';
import WxArticle from './WxArticle';

class ManageData extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataPage: ''
    }
  };

  componentDidMount() {
    if(!this.props.adminwx.super_admin) {
      this.props.changeAction('recent_record');
    };

    this.setState({
      dataPage: 'gift'
    })
  };

  changeDataPage(page) {
    this.setState({
      dataPage: page
    })
  }

  render() {
    return (
      <div>
        <div className = "nav-bar" style = {{backgroundColor: '#888888'}}>
          <div className="nav-btn-group">
            <div className="nav-btn" onClick = {() => this.changeDataPage('gift')}>赠品列表</div>
            <div className="nav-btn" onClick = {() => this.changeDataPage('operator')}>操作人列表</div>
            <div className="nav-btn" onClick = {() => this.changeDataPage('product')}>产品列表</div>
            <div className="nav-btn" onClick = {() => this.changeDataPage('admin')}>管理员列表</div>
            <div className="nav-btn" onClick = {() => this.changeDataPage('wxArticle')}>小程序展示管理</div>
          </div>
        </div>
        { this.state.dataPage === 'gift' ? 
          <DataList
            showAlert = {this.props.showAlert}
            page = {this.state.dataPage} 
            dataList = {this.props.giftData}
            createGiftData = {this.props.createGiftData}
            deleteGiftData = {this.props.deleteGiftData}
            />
        : '' }
        { this.state.dataPage === 'operator' ? 
          <DataList
            showAlert = {this.props.showAlert}
            page = {this.state.dataPage} 
            dataList = {this.props.operatorData}
            createOperatorData = {this.props.createOperatorData}
            deleteOperatorData = {this.props.deleteOperatorData}
            />
        : '' }
        { this.state.dataPage === 'product' ? 
          <DataList
            showAlert = {this.props.showAlert}
            page = {this.state.dataPage} 
            dataList = {this.props.productData}
            createProductData = {this.props.createProductData}
            deleteProductData = {this.props.deleteProductData}
            />
        : '' }
        { this.state.dataPage === 'admin' ? 
          <AdminList
            showAlert = {this.props.showAlert}
          />
        : '' }
        { this.state.dataPage === 'wxArticle' ? 
          <WxArticle
            showAlert = {this.props.showAlert}
          />
        : '' }
      </div>
    )
  }
}
  
export default ManageData;