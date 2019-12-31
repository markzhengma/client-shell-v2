import React, { Component } from 'react';
import axios from 'axios';
import { Table, Form, Row, Col } from 'react-bootstrap';

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
        detail: ''
      },
      updateRecord: {
        date: '',
        product_name: '',
        milage: '',
        gift: '',
        operator: '',
        detail: ''
      },
      selectUpdateId: '',
      currDate: ''
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
      currDate: [year, month, day].join('-')
    });
  }

  resetInput(){
    this.setState({
      newRecord: {
        date: '',
        product_name: '',
        milage: '',
        gift: '',
        operator: '',
        detail: ''
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

  handleNewRecordSubmit(e){
    e.preventDefault();
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
        detail: this.state.newRecord.detail
      }
    })
      .then(res => {
        if(res.data.code !== 200){
          alert(res.data.code + '\n' + JSON.stringify(res.data.data));
          console.log(res.data.data);
        } else {
          console.log(res)
          this.resetInput();
          this.props.handleFindUserSubmit(e)
        }
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
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

  selectUpdateRecord(id){
    this.setState({
      selectUpdateId: id
    })
  };

  render() {
    const data = this.props.recordListData;
    return (
      <div className = "record-list">
        <div>
          <h5>新保养记录</h5>
          <Form style={{ margin: '20px' }} onSubmit = {this.handleNewRecordSubmit.bind(this)}>
            <Row>
              <Col>
                <Form.Control type="date" defaultValue={this.state.currDate} name = "date" onChange = {this.handleNewRecordChange.bind(this)} placeholder = "日期"></Form.Control>
              </Col>
              <Col>
                <Form.Control name = "product_name" onChange = {this.handleNewRecordChange.bind(this)} placeholder = "项目名称"></Form.Control>
              </Col>
              <Col>
                <Form.Control name = "milage" onChange = {this.handleNewRecordChange.bind(this)} placeholder = "表示里程"></Form.Control>
              </Col>
              <Col>
                <Form.Control name = "gift" onChange = {this.handleNewRecordChange.bind(this)} placeholder = "赠品情况"></Form.Control>
              </Col>
              <Col>
                <Form.Control name = "operator" onChange = {this.handleNewRecordChange.bind(this)} placeholder = "操作人"></Form.Control>
              </Col>
              <Col>
                <Form.Control name = "detail" onChange = {this.handleNewRecordChange.bind(this)} placeholder = "备注"></Form.Control>
              </Col>
              <Col>
                <button type = "submit">保存</button>
              </Col>
            </Row>
          </Form>
        </div>
        {data ? 
          <div>
          <h5>保养记录历史</h5>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>日期</th>
                <th>项目名称</th>
                <th>表示里程</th>
                <th>赠品情况</th>
                <th>操作人</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.map(record => {
                return (
                  this.state.selectUpdateId !== record._id ? 
                    <tr key = {record._id} id = {record._id}>
                      <td>{record.date}</td>
                      <td>{record.product_name}</td>
                      <td>{record.milage}</td>
                      <td>{record.gift}</td>
                      <td>{record.operator}</td>
                      <td>{record.detail}</td>
                      <td>
                        <button onClick = {(e) => this.selectUpdateRecord(record._id)}>编辑</button>
                        <button onClick = {(e) => this.handleDeleteRecord(e, record._id)}>删除</button>
                      </td>
                    </tr>
                  :
                  <tr key = {record._id} id = {record._id}>
                    <td><input defaultValue = {record.date} name = "date" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    <td><input defaultValue = {record.product_name} name = "product_name" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    <td><input defaultValue = {record.milage} name = "milage" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    <td><input defaultValue = {record.gift} name = "gift" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    <td><input defaultValue = {record.operator} name = "operator" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    <td><input defaultValue = {record.detail} name = "detail" onChange = {this.handleUpdateRecordChange.bind(this)}/></td>
                    <td>
                      <button onClick = {(e) => this.selectUpdateRecord('')}>保存</button>
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