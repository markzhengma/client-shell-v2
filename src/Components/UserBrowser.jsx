import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';

class UserBrowser extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  };

  goToTargetRecord(record_num) {
    let confirmed = window.confirm(`查看选中用户，换油证号：${record_num}`);
    if(confirmed){
      this.props.selectFindUserValue('record_num', record_num);
      this.props.changeAction('find_user');
    }
  }

  render() {
    const data = this.props.userListData;
    return (
      <div 
        className = "record-list"
        style={{
          padding: "0 10px",
          maxWidth: "Calc(100vw - 20px)", 
          overflow: "scroll"
        }}
      >
        <Table 
          striped 
          // bordered 
          hover 
          style = {{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          <thead>
            <tr>
              <th>换油证号</th>
              <th>用户姓名</th>
              <th>联系方式</th>
              <th>车型</th>
              <th>车牌号</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map(user => {
              return (
                  <tr key = {user._id} id = {user._id}>
                    <td className = "record-list-column">{user.record_num}</td>
                    <td className = "record-list-column">{user.user_name}</td>
                    <td className = "record-list-column">{user.phone}</td>
                    <td className = "record-list-column">{user.make}</td>
                    <td className = "record-list-column">{user.plate}</td>
                    <td className = "record-list-column">{user.detail}</td>
                    <td className = "record-list-column">
                      <Button variant = "primary" onClick = {() => this.goToTargetRecord(user.record_num)}>查看</Button>
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
  
  export default UserBrowser;