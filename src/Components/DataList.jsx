import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';

class DataList extends Component {
  constructor(props){
    super(props);
    this.state = {
      newData: null
    }
  };

  deleteData(id) {
    console.log(id);
    switch(this.props.page) {
      case 'gift':
        this.props.deleteGiftData(id);
        return;
      case 'product':
        this.props.deleteProductData(id);
        return;
      case 'operator':
        this.props.deleteOperatorData(id);
        return;
      default:
        return;
    }
  };

  createData() {
    console.log(this.state.newData);
    switch(this.props.page) {
      case 'gift':
        if(this.state.newData && this.state.newData.gift_name !== '') {
          this.props.createGiftData(this.state.newData);
          this.resetData();
          break;
        } else {
          alert('请输入赠品名称');
          break;
        }
      case 'product':
        if(this.state.newData && this.state.newData.product_name !== '' && this.state.newData.product_type && this.state.newData.product_type !== '') {
          this.props.createProductData(this.state.newData);
          this.resetData();
          break;
        } else {
          alert('请输入产品名称和类别');
          break;
        }
      case 'operator':
        if(this.state.newData && this.state.newData.op_name !== '' && this.state.newData.location && this.state.newData.location !== '') {
          this.props.createOperatorData(this.state.newData);
          this.resetData();
          break;
        } else {
          alert('请输入操作人姓名和门店地区');
          break;
        }
      default:
        break;

    };
  };

  resetData(){
    this.setState({
      newData: null
    })
  };

  handleNewDataChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      newData: {
        ...this.state.newData,
        [name]: value
      }
    })
  };

  render() {
    switch(this.props.page) {
      case "gift":
        return (
          <div>
            <div className = "record-list" style = {{width: '50vw'}}> 
              <h3>赠品列表</h3>
              <Table striped bordered hover style = {{ backgroundColor: 'grey', color: 'white' }}>
              <thead>
                <tr>
                  <th>赠品名称</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className = "record-list-column">
                    <input 
                      placeholder = "新的赠品" 
                      name = "gift_name" 
                      value = {this.state.newData ? this.state.newData.gift_name : ''} 
                      onChange = {this.handleNewDataChange.bind(this)}
                    />
                  </td>
                  <td className = "record-list-column">
                    <Button variant = "primary" onClick = {this.createData.bind(this)}>创建</Button>
                  </td>
                </tr>
                {this.props.dataList.map(data => {
                  return (
                    <tr key = {data._id} id = {data._id}>
                      <td className = "record-list-column">{data.gift_name}</td>
                      <td className = "record-list-column">
                        <Button variant = "danger" onClick = {() => this.deleteData(data._id)}>删除</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            </div>
          </div>
          );
      case "operator":
        return (
          <div>
            <div className = "record-list" style = {{width: '50vw'}}> 
              <h3>操作人列表</h3>
              <Table striped bordered hover style = {{ backgroundColor: 'grey', color: 'white' }}>
                <thead>
                  <tr>
                    <th>操作人</th>
                    <th>门店地区</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className = "record-list-column">
                      <input 
                        placeholder = "新操作人" 
                        name = "op_name" 
                        value = {this.state.newData ? this.state.newData.op_name : ''} 
                        onChange = {this.handleNewDataChange.bind(this)}
                      />
                    </td>
                    <td className = "record-list-column">
                      <select 
                        name = "location" 
                        defaultValue = ""
                        value = {this.state.newData ? this.state.newData.location : ''}
                        onChange = {this.handleNewDataChange.bind(this)}
                      >
                        <option value = "" disabled>【请选择门店地区】</option>
                        <option value = "海拉尔">海拉尔</option>
                        <option value = "满洲里">满洲里</option>
                        <option value = "牙克石">牙克石</option>
                        <option value = "其他">其他</option>
                      </select>
                    </td>
                    <td className = "record-list-column">
                      <Button variant = "primary" onClick = {this.createData.bind(this)}>创建</Button>
                    </td>
                  </tr>
                  {this.props.dataList.map(data => {
                    return (
                      <tr key = {data._id} id = {data._id}>
                        <td className = "record-list-column">{data.op_name}</td>
                        <td className = "record-list-column">{data.location}</td>
                        <td className = "record-list-column">
                          <Button variant = "danger" onClick = {() => this.deleteData(data._id)}>删除</Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          </div>
          );
      case "product":
        return (
          <div>
            <div className = "record-list" style = {{width: '50vw'}}> 
              <h3>产品列表</h3>
              <Table striped bordered hover style = {{ backgroundColor: 'grey', color: 'white' }}>
                <thead>
                  <tr>
                    <th>产品名称</th>
                    <th>类别</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className = "record-list-column">
                      <input 
                        placeholder = "新产品" 
                        name = "product_name" 
                        value = {this.state.newData ? this.state.newData.product_name : ''} 
                        onChange = {this.handleNewDataChange.bind(this)}
                      />
                    </td>
                    <td className = "record-list-column">
                      <select 
                        name = "product_type" 
                        defaultValue = ""
                        value = {this.state.newData ? this.state.newData.product_type : ''}
                        onChange = {this.handleNewDataChange.bind(this)}
                      >
                        <option value = "" disabled>【请选择产品类别】</option>
                        <option value = "汽机油">汽机油</option>
                        <option value = "中华汽机油">中华汽机油</option>
                        <option value = "柴机油">柴机油</option>
                        <option value = "中华柴机油">中华柴机油</option>
                        <option value = "防冻液">防冻液</option>
                        <option value = "刹车油">刹车油</option>
                        <option value = "变速箱油">变速箱油</option>
                        {/* <option value = "附属品">附属品</option>
                        <option value = "中华产品">中华产品</option> */}
                      </select>
                    </td>
                    <td className = "record-list-column">
                      <Button variant = "primary" onClick = {this.createData.bind(this)}>创建</Button>
                    </td>
                  </tr>
                  {this.props.dataList.map(data => {
                    return (
                      <tr key = {data._id} id = {data._id}>
                        <td className = "record-list-column">{data.product_name}</td>
                        <td className = "record-list-column">{data.product_type}</td>
                        <td className = "record-list-column">
                          <Button variant = "danger" onClick = {() => this.deleteData(data._id)}>删除</Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          </div>
          );
      default:
        return;
      }
    }
  }
  
  export default DataList;