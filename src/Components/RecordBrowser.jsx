import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';

class RecordBrowser extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  };

  goToTargetRecord(record_num) {
    let confirmed = window.confirm(`查看这条保养记录，换油证号：${record_num}`);
    if(confirmed){
      this.props.selectFindUserValue('record_num', record_num);
      this.props.changeAction('find_user');
    }
  }

  render() {
    const data = this.props.recordListData;
    return (
      <div className = "record-list">
        <Table striped bordered hover style = {{ backgroundColor: 'grey', color: 'white' }}>
          <thead>
            <tr>
              <th>日期</th>
              <th>项目名称</th>
              <th>表示里程</th>
              <th>赠品情况</th>
              <th>操作人</th>
              <th>积分/备注</th>
              {/* <th>保养提醒</th> */}
              <th>换油证号</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map(record => {
              return (
                  <tr key = {record._id} id = {record._id}>
                    <td className = "record-list-column">{record.date}</td>
                    <td className = "record-list-column">{record.product_name}</td>
                    <td className = "record-list-column">{record.milage}</td>
                    <td className = "record-list-column">{record.gift}</td>
                    <td className = "record-list-column">{record.operator}</td>
                    <td className = "record-list-column">{record.detail}</td>
                    {/* <td className = "record-list-column">{record.reminder}</td> */}
                    <td className = "record-list-column">{record.record_num}</td>
                    <td className = "record-list-column">
                      <Button variant = "primary" onClick = {() => this.goToTargetRecord(record.record_num)}>查看</Button>
                    </td>
                  </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      )
    }
  }
  
  export default RecordBrowser;