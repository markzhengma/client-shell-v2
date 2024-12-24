import React, { Component } from 'react';
import { Nav } from 'react-bootstrap'; 
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
        <Nav
          variant="pills" 
          defaultActiveKey="gift"
          onSelect={(selectedKey) => this.changeDataPage(selectedKey)}
          style={{
            backgroundColor: "#393939",
            padding: "8px 0"
          }}
        >
          <Nav.Item>
            <Nav.Link
              as="div"
              eventKey="gift"
              className="data_navs"
              style={{
                cursor: "pointer",
                color: "#F9D148"
              }}
            >
              赠品列表
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as="div"
              eventKey="operator"
              className="data_navs"
              style={{
                cursor: "pointer",
                color: "#F9D148"
              }}
            >
              操作人列表
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as="div"
              eventKey="product"
              className="data_navs"
              style={{
                cursor: "pointer",
                color: "#F9D148"
              }}
            >
              产品列表
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as="div"
              eventKey="admin"
              className="data_navs"
              style={{
                cursor: "pointer",
                color: "#F9D148"
              }}
            >
              管理员列表
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as="div"
              eventKey="wxArticle"
              className="data_navs"
              style={{
                cursor: "pointer",
                color: "#F9D148"
              }}
            >
              小程序展示管理
            </Nav.Link>
          </Nav.Item>
        </Nav>
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