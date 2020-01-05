import React, { Component } from 'react';
import axios from 'axios';
import { Table, Form, Row, Col, Button } from 'react-bootstrap';

class RecordList extends Component {
  constructor(props){
    super(props);
    this.state = {
      newRecord: {
        date: '',
        product_name: '',
        milage: '',
        gift: '',
        operator: '',
        detail: '无',
        reminder: '无'
      },
      updateRecord: {
        date: '',
        product_name: '',
        milage: '',
        gift: '',
        operator: '',
        detail: '',
        reminder: ''
      },
      selectUpdateId: '',
      currDate: '',
      randomKey: 0
    }
  };

  componentDidMount(){
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    this.setState({
      currDate: [year, month, day].join('-'),
      newRecord: {
        ...this.state.newRecord,
        date: [year, month, day].join('-')
      }
    });
  }

  resetInput(){
    this.setState({
      newRecord: {
        date: this.state.currDate,
        product_name: '',
        milage: '',
        gift: '',
        operator: '',
        detail: '无',
        reminder: '无'
      }
    })
  };

  handleNewRecordChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      newRecord: {
        ...this.state.newRecord,
        [name]: value
      }
    })
  };

  handleUpdateRecordChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      updateRecord: {
        ...this.state.updateRecord,
        [name]: value
      }
    })
  }

  resetNewRecordForm(){
    this.setState({ randomKey: Math.random() });
  }

  handleNewRecordSubmit(e){
    e.preventDefault();
    if(this.state.newRecord.date === "" || this.state.newRecord.gift === "" || this.state.newRecord.milage === "" || this.state.newRecord.operator === "" || this.state.newRecord.product_name === "" || this.state.newRecord.detail === "" || this.state.newRecord.reminder === "") {
      alert("亲，请将保养记录填写完整哟~");
    } else {
      const record_num = this.props.record_num;
      axios({
        url: `https://api.hailarshell.cn/api/record/user/${record_num}`,
        method: 'POST',
        data: {
          date: this.state.newRecord.date,
          gift: this.state.newRecord.gift,
          milage: this.state.newRecord.milage,
          operator: this.state.newRecord.operator,
          product_name: this.state.newRecord.product_name,
          detail: this.state.newRecord.detail,
          reminder: this.state.newRecord.reminder
        }
      })
        .then(res => {
          if(res.data.code !== 200){
            alert(res.data.code + '\n' + JSON.stringify(res.data.data));
            console.log(res.data.data);
          } else {
            console.log(res)
            this.resetNewRecordForm();
            this.resetInput();
            this.props.handleFindUserSubmit(e)
          }
        })
        .catch(err => {
          alert(err);
          console.log(err);
        })
    }
  };

  handleDeleteRecord(e, id){
    axios.delete(`https://api.hailarshell.cn/api/record/single/${id}`)
      .then(res => {
        if(res.data.code !== 200){
          alert(res.data.code + '\n' + JSON.stringify(res.data.data));
          console.log(res.data.data);
        } else {
          console.log(res)
          this.props.handleFindUserSubmit(e)
        }
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  };

  selectUpdateRecord(data){
    this.setState({
      updateRecord: {
        date: data.date,
        product_name: data.product_name,
        milage: data.milage,
        gift: data.gift,
        operator: data.operator,
        detail: data.detail,
        reminder: data.reminder
      },
      selectUpdateId: data._id
    })
  };

  confirmUpdateRecord(e){
    e.preventDefault();
    axios({
      url: `https://api.hailarshell.cn/api/record/single/${this.state.selectUpdateId}`,
      method: 'PUT',
      data: this.state.updateRecord
    })
      .then(res => {
        if(res.data.code === 200){
          this.resetUpdateRecord();
          this.props.handleFindUserSubmit(e);
        }
      })
      .catch(err => {
        console.log(err)
      })
  };

  resetUpdateRecord(){
    this.setState({
      updateRecord: {
        date: '',
        product_name: '',
        milage: '',
        gift: '',
        operator: '',
        detail: '',
        reminder: ''
      },
      selectUpdateId: ''
    })
  };

  render() {
    const data = this.props.recordListData;
    return (
      <div className = "record-list">
        <div>
          <h5>新保养记录</h5>
          <Form className = "new-record-form" onSubmit = {this.handleNewRecordSubmit.bind(this)} key={this.state.randomKey}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>日期</Form.Label>
                  <Form.Control type="date" name = "date" value = {this.state.newRecord.date} onChange = {this.handleNewRecordChange.bind(this)} placeholder = "日期"></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>项目名称</Form.Label>
                  <Form.Control as="select" name = "product_name" defaultValue = "" onChange = {this.handleNewRecordChange.bind(this)}>
                    <option value = "" disabled>【请选择】</option>
                    <option value = "" disabled>【汽机油】</option>
                    {this.props.productData.map(product => {
                      if(product.product_type === '汽机油')
                      return <option value = {product.product_name} key = {product._id}>{product.product_name}</option>
                    })}
                    <option value = "" disabled>【柴机油】</option>
                    {this.props.productData.map(product => {
                      if(product.product_type === '柴机油')
                      return <option value = {product.product_name} key = {product._id}>{product.product_name}</option>
                    })}
                    <option value = "" disabled>【中华产品】</option>
                    {this.props.productData.map(product => {
                      if(product.product_type === '中华产品')
                      return <option value = {product.product_name} key = {product._id}>{product.product_name}</option>
                    })}
                    <option value = "" disabled>【附属品】</option>
                    {this.props.productData.map(product => {
                      if(product.product_type === '附属品')
                      return <option value = {product.product_name} key = {product._id}>{product.product_name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>表示里程</Form.Label>
                  <Form.Control name = "milage" onChange = {this.handleNewRecordChange.bind(this)} placeholder = "表示里程"></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>赠品情况</Form.Label>
                  <Form.Control as="select" name = "gift" defaultValue = "" onChange = {this.handleNewRecordChange.bind(this)}>
                    <option value = "" disabled>【请选择】</option>
                    <option value = "(赠品未领)">(赠品未领)</option>
                    {this.props.giftData.map(gift => {
                      if(gift.gift_name !== "(赠品未领)")
                      return <option value = {gift.gift_name} key = {gift._id}>{gift.gift_name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>操作人</Form.Label>
                  <Form.Control as="select" name = "operator" defaultValue = "" onChange = {this.handleNewRecordChange.bind(this)}>
                    <option value = "" disabled>【请选择】</option>
                    <option value = "" disabled>【海拉尔】</option>
                    {this.props.operatorData.map(operator => {
                      if(operator.location === '海拉尔')
                      return <option value = {operator.op_name} key = {operator._id}>{operator.op_name}</option>
                    })}
                    <option value = "" disabled>【满洲里】</option>
                    {this.props.operatorData.map(operator => {
                      if(operator.location === '满洲里')
                      return <option value = {operator.op_name} key = {operator._id}>{operator.op_name}</option>
                    })}
                    <option value = "" disabled>【牙克石】</option>
                    {this.props.operatorData.map(operator => {
                      if(operator.location === '牙克石')
                      return <option value = {operator.op_name} key = {operator._id}>{operator.op_name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>积分/备注</Form.Label>
                  <Form.Control name = "detail" value = {this.state.newRecord.detail} onChange = {this.handleNewRecordChange.bind(this)} placeholder = "积分/备注"></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>保养提醒</Form.Label>
                  <Form.Control name = "reminder" value = {this.state.newRecord.reminder} onChange = {this.handleNewRecordChange.bind(this)} placeholder = "保养提醒"></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <div style = {{ margin: '0 0 8px 0' }}>操作</div>
                <Button variant="primary" style = {{ margin: '5px' }} type = "submit">保存</Button>
                <Button variant="warning" style = {{ margin: '5px' }} onClick = {this.resetNewRecordForm.bind(this)}>重置</Button>
              </Col>
            </Row>
          </Form>
        </div>
        {data ? 
          <div>
          <h5>保养记录历史</h5>
          <Table striped bordered hover style = {{ backgroundColor: 'grey', color: 'white' }}>
            <thead>
              <tr>
                <th>日期</th>
                <th>项目名称</th>
                <th>表示里程</th>
                <th>赠品情况</th>
                <th>操作人</th>
                <th>积分/备注</th>
                <th>保养提醒</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.map(record => {
                return (
                  this.state.selectUpdateId !== record._id ? 
                    <tr key = {record._id} id = {record._id}>
                      <td className = "record-list-column">{record.date}</td>
                      <td className = "record-list-column">{record.product_name}</td>
                      <td className = "record-list-column">{record.milage}</td>
                      <td className = "record-list-column">{record.gift}</td>
                      <td className = "record-list-column">{record.operator}</td>
                      <td className = "record-list-column">{record.detail}</td>
                      <td className = "record-list-column">{record.reminder}</td>
                      <td className = "record-list-column">
                        <Button variant = "primary" onClick = {(e) => this.selectUpdateRecord(record)}>编辑</Button>
                        <Button variant = "danger" onClick = {(e) => this.handleDeleteRecord(e, record._id)}>删除</Button>
                      </td>
                    </tr>
                  :
                  <tr key = {record._id} id = {record._id}>
                    <td className = "record-list-column"><input className = "edit-input" type = "date" defaultValue = {record.date} name = "date" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    {/* <td className = "record-list-column"><input defaultValue = {record.product_name} name = "product_name" onChange = {this.handleUpdateRecordChange.bind(this)}/></td> */}
                    <td className = "record-list-column">
                      <select className = "edit-select" name = "product_name" defaultValue = {record.product_name} onChange = {this.handleUpdateRecordChange.bind(this)}>
                        {/* <option value = {record.product_name} selected>{record.product_name}</option> */}
                        <option value = "" disabled>【项目名称】</option>
                        <option value = "" disabled>【汽机油】</option>
                        {this.props.productData.map(product => {
                          if(product.product_type === '汽机油')
                          return <option value = {product.product_name} key = {product._id}>{product.product_name}</option>
                        })}
                        <option value = "" disabled>【柴机油】</option>
                        {this.props.productData.map(product => {
                          if(product.product_type === '柴机油')
                          return <option value = {product.product_name} key = {product._id}>{product.product_name}</option>
                        })}
                        <option value = "" disabled>【中华产品】</option>
                        {this.props.productData.map(product => {
                          if(product.product_type === '中华产品')
                          return <option value = {product.product_name} key = {product._id}>{product.product_name}</option>
                        })}
                        <option value = "" disabled>【附属品】</option>
                        {this.props.productData.map(product => {
                          if(product.product_type === '附属品')
                          return <option value = {product.product_name} key = {product._id}>{product.product_name}</option>
                        })}
                        
                      </select>
                    </td>
                    <td className = "record-list-column"><input className = "edit-input" defaultValue = {record.milage} name = "milage" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    {/* <td className = "record-list-column"><input defaultValue = {record.gift} name = "gift" onChange = {this.handleUpdateRecordChange.bind(this)}/></td> */}
                    <td className = "record-list-column">
                      <select className = "edit-select" name = "gift" defaultValue = {record.gift} onChange = {this.handleUpdateRecordChange.bind(this)}>
                        {/* <option value = {record.gift} selected>{record.gift}</option> */}
                        <option value = "" disabled>【赠品情况】</option>
                        <option value = "(赠品未领)">(赠品未领)</option>
                        {this.props.giftData.map(gift => {
                          if(gift.gift_name !== "(赠品未领)")
                          return <option value = {gift.gift_name} key = {gift._id}>{gift.gift_name}</option>
                        })}
                      </select>
                    </td>
                    {/* <td className = "record-list-column"><input defaultValue = {record.operator} name = "operator" onChange = {this.handleUpdateRecordChange.bind(this)}/></td> */}
                    <td className = "record-list-column">
                      <select className = "edit-select" name = "operator" defaultValue = {record.operator} onChange = {this.handleUpdateRecordChange.bind(this)}>
                        {/* <option value = {record.operator} selected>{record.operator}</option> */}
                        <option value = "" disabled>【操作人】</option>
                        <option value = "" disabled>【海拉尔】</option>
                        {this.props.operatorData.map(operator => {
                          if(operator.location === '海拉尔')
                          return <option value = {operator.op_name} key = {operator._id}>{operator.op_name}</option>
                        })}
                        <option value = "" disabled>【满洲里】</option>
                        {this.props.operatorData.map(operator => {
                          if(operator.location === '满洲里')
                          return <option value = {operator.op_name} key = {operator._id}>{operator.op_name}</option>
                        })}
                        <option value = "" disabled>【牙克石】</option>
                        {this.props.operatorData.map(operator => {
                          if(operator.location === '牙克石')
                          return <option value = {operator.op_name} key = {operator._id}>{operator.op_name}</option>
                        })}
                      </select>
                    </td>
                    <td className = "record-list-column"><input defaultValue = {record.detail} name = "detail" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    <td className = "record-list-column"><input defaultValue = {record.reminder} name = "reminder" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    <td className = "record-list-column">
                      <Button variant = "success" onClick = {(e) => this.confirmUpdateRecord(e)}>保存</Button>
                      <Button variant = "warning" onClick = {this.resetUpdateRecord.bind(this)}>取消</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
        : ""}
        
      </div>
    )
  }
}

export default RecordList;