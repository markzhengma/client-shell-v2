import React, { Component } from 'react';
import DataList from './DataList';

class ManageData extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataPage: ''
    }
  };

  componentDidMount() {
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
          </div>
        </div>
        { this.state.dataPage === 'gift' ? 
          <DataList
            page = {this.state.dataPage} 
            dataList = {this.props.giftData}
            createGiftData = {this.props.createGiftData}
            deleteGiftData = {this.props.deleteGiftData}
            />
        : '' }
        { this.state.dataPage === 'operator' ? 
          <DataList
            page = {this.state.dataPage} 
            dataList = {this.props.operatorData}
            createOperatorData = {this.props.createOperatorData}
            deleteOperatorData = {this.props.deleteOperatorData}
            />
        : '' }
        { this.state.dataPage === 'product' ? 
          <DataList
            page = {this.state.dataPage} 
            dataList = {this.props.productData}
            createProductData = {this.props.createProductData}
            deleteProductData = {this.props.deleteProductData}
            />
        : '' }
      </div>
    )
  }
}
  
export default ManageData;