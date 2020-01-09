import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardGroup, Form, Button, ButtonGroup } from 'react-bootstrap'; 

import UserSingle from './UserSingle';
import UserUpdate from './UserUpdate';
import RecordList from './RecordList';

class FindUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      filter: 'record_num',
      value: '',
      userListData: '',
      userData: '',
      recordListData: '',
      isUserUpdating: '',
      updateUser: {
        user_name: '',
        phone: '',
        plate: '',
        make: '',
        detail: '',
      }
    }
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  };

  handleUserUpdateChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      updateUser: {
        ...this.state.updateUser,
        [name]: value
      }
    })
  };

  resetStates(){
    this.setState({
      filter: 'record_num',
      value: '',
      userData: '',
      recordListData: '',
      userListData: ''
    })
  };

  changeUserUpdateStatus() {
    this.setState({
      isUserUpdating: !this.state.isUserUpdating
    })
  };

  selectUserUpdate(){
    this.setState({
      isUserUpdating: true,
      updateUser: this.state.userData
    })
  };

  cancelUserUpdate(){
    this.setState({
      isUserUpdating: false,
      updateUser: {
        user_name: '',
        phone: '',
        plate: '',
        make: '',
        detail: '',
      }
    })
  }

  confirmUserUpdate(e) {
    e.preventDefault();
    console.log(this.state.updateUser);
    axios({
      url: `https://api.hailarshell.cn/api/user/single/${this.state.userData.record_num}`,
      method: 'PUT',
      data: {
        make: this.state.updateUser.make,
        phone: this.state.updateUser.phone,
        plate: this.state.updateUser.plate,
        user_name: this.state.updateUser.user_name,
        detail: this.state.updateUser.detail,
      }
    })
      .then(res => {
        if(res.data.code === 200){
          this.cancelUserUpdate();
          this.handleFindUserSubmit(e);
        }
      })
      .catch(err => {
        console.log(err)
      })
  };

  confirmUserDelete() {
    let confirm = window.confirm(`确定删除用户${this.state.userData.user_name}？`);
    if(confirm){
      axios.delete(`https://api.hailarshell.cn/api/user/single/${this.state.userData.record_num}`)
        .then(res => {
          if(res.data.code !== 200){
            alert(res.data.code + '\n' + JSON.stringify(res.data.data))
          } else {
            this.resetStates();
          }
        })
        .catch(err => {
          alert(err);
          console.log(err)
        })
    }
  }

  handleFindUserSubmit(e) {
    e.preventDefault();
    axios.get(`https://api.hailarshell.cn/api/user/all?filter=${this.state.filter}&value=${this.state.value}`)
      .then(userList => {
        if(userList.data.code !== 200) {
          alert(userList.data.code + '\n' + JSON.stringify(userList.data.data));
        } else {
          if(userList.data.data.length === 0){
            alert('未找到用户~');
          } else if(userList.data.data.length > 1){
            this.setState({
              userData: '',
              recordListData: '',
              userListData: userList.data.data
            });
          } else {
            this.setState({
              userListData: ''
            })
            this.findUserRecords(userList.data.data[0].record_num);
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  findUserRecords(record_num) {
    axios.get(`https://api.hailarshell.cn/api/user/single?filter=record_num&value=${record_num}`)
      .then(user => {
        if(user.data.code !== 200){
          alert(user.data.code + '\n' + JSON.stringify(user.data.data))
        } else {
          this.setState({
            userData: user.data.data
          });
          const record_num = user.data.data.record_num;
          axios.get(`https://api.hailarshell.cn/api/record/user/${record_num}`)
            .then(records => {
              if(records.data.code !== 200){
                alert(records.data);
                console.log(records.data)
              } else {
                this.setState({
                  recordListData: records.data.data
                })
              }
            })
            .catch(err => {
              alert(err);
              console.log(err);
            })
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div>
        <Form className = "search-form" onSubmit = {this.handleFindUserSubmit.bind(this)}>
          <Form.Group>
            <Form.Label>查询条件</Form.Label>
            <Form.Control as="select" name = "filter" value = {this.state.filter} onChange = {this.handleChange.bind(this)}>
              <option value = "record_num">按换油证号查找</option>
              <option value = "phone">按手机号查找</option>
              <option value = "plate">按车牌号查找</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>查询内容</Form.Label>
            <Form.Control type = "text" name = "value" value = {this.state.value} onChange = {this.handleChange.bind(this)} placeholder = "内容" />
          </Form.Group>
          <Button variant="success" type = "submit">查找</Button>
        </Form>
        {this.state.userListData !== '' ? 
          <div style = {{ margin: '20px' }}>
            <h5>找到多个用户，请选择要查看的用户。</h5>
            <div className = "user-list">
              { this.state.userListData.map(user => {
                return (
                  <Card className = "user-list-single" bg="secondary" text="white"  key = {user._id}>
                    <Card.Title className="mb-2 text-warning">
                      {user.user_name}
                    </Card.Title>
                    <Card.Text>
                      换油证号: {user.record_num || ''}
                    </Card.Text>
                    <Button variant="primary" style = {{ margin: '10px' }} onClick = {() => this.findUserRecords(user.record_num)}>查看</Button>
                  </Card>
                )
              })}
            </div>
          </div>
        : ""}
        {this.state.userData !== '' ? this.state.isUserUpdating ? 
          <Card bg="secondary" text="white" border="light" className = "user-form">
            <UserUpdate 
              userData = {this.state.userData} 
              cancelUserUpdate = {this.cancelUserUpdate.bind(this)}
              confirmUserUpdate = {this.confirmUserUpdate.bind(this)}
              handleUserUpdateChange = {this.handleUserUpdateChange.bind(this)}
            />
          </Card>
        :
          <div>
            <Card bg="secondary" text="white" border="light" className = "user-single">
              <UserSingle userData = {this.state.userData}/>
              <ButtonGroup style = {{ margin: '10px' }}>
                <Button variant="primary" onClick = {this.selectUserUpdate.bind(this)}>编辑客户信息</Button>
                <Button variant="danger" onClick = {this.confirmUserDelete.bind(this)}>删除客户信息</Button>
              </ButtonGroup>
            </Card>
          </div>
        : ""}
        {this.state.userData !== '' ? 
          <RecordList 
            productData = {this.props.productData}
            giftData = {this.props.giftData}
            operatorData = {this.props.operatorData}
            recordListData = {this.state.recordListData}
            record_num = {this.state.userData.record_num}
            handleFindUserSubmit = {this.handleFindUserSubmit.bind(this)}
          />
        : ""}
      </div>
    )
  }
}

export default FindUser;