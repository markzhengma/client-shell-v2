import React, { Component } from 'react';
import axios from 'axios';
import { Card, Form, Button, ButtonGroup, Spinner } from 'react-bootstrap'; 

import UserSingle from './UserSingle';
import UserUpdate from './UserUpdate';
import RecordList from './RecordList';
import ReminderList from './ReminderList';

class FindUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      filter: 'plate',
      placeholder: '请输入车牌号',
      value: '',
      userListData: '',
      userData: '',
      recordListData: '',
      reminderListData: '',
      isUserUpdating: '',
      updateUser: {
        user_name: '',
        phone: '',
        plate: '',
        make: '',
        detail: '',
        union_id: ''
      },
      isFetching: false,
    }
  };

  componentDidMount(){
    this.setState({
      filter: this.props.selectedFilter === '' ? 'plate' : this.props.selectedFilter,
      value: this.props.selectedValue
    });
    switch(this.props.selectedFilter) {
      case 'record_num':
        this.setState({
          placeholder: '请输入换油证号',
        });
        break;
      case 'phone':
        this.setState({
          placeholder: '请输入手机号',
        });
        break;
      case 'plate':
        this.setState({
          placeholder: '请输入车牌号',
        });
        break;
      default:
        break;
    }
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
    if(name === 'filter') {
      this.setState({
        value: ''
      });
      switch(value) {
        case 'record_num':
          this.setState({
            placeholder: '请输入换油证号',
          });
          break;
        case 'phone':
          this.setState({
            placeholder: '请输入手机号',
          });
          break;
        case 'plate':
          this.setState({
            placeholder: '请输入车牌号',
          });
          break;
        default:
          break;
      }
    }
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
      reminderListData: '',
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
        union_id: ''
      }
    })
  }

  confirmUserUpdate(e) {
    e.preventDefault();

    const { make, phone, plate, user_name, union_id } = this.state.updateUser;
    const detail = this.state.updateUser.detail !== '' ? this.state.updateUser.detail : '无备注';
    const REGEX_CHINESE = /^[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;

    if(!user_name.match(REGEX_CHINESE)) {
      alert('请重新检查输入的姓名');
    } else if((phone.length !== 7 && phone.length !== 11) || !phone.match(/^\d+$/)) {
      alert('请重新检查输入的联系方式');
    } else if(!make.match(REGEX_CHINESE) && !make.match(/[0-9]/)) {
      alert('请重新检查输入的车型');
    } else if((plate.length !== 7 && plate.length !== 8) || !plate.match(REGEX_CHINESE)) {
      alert('请重新检查输入的车牌号');
    } else {
      axios({
        url: `https://api.hulunbuirshell.com/api/user/single/${this.state.userData.record_num}`,
        method: 'PUT',
        data: {
          make,
          phone,
          plate,
          user_name,
          detail,
          union_id,
        }
      })
        .then(res => {
          if(res.data.code === 200){
            this.cancelUserUpdate();
            // this.handleFindUserSubmit(e);
  
            this.setState({
              isFetching: true,
            });
            axios.get(`https://api.hulunbuirshell.com/api/user/all?filter=record_num&value=${res.data.data.record_num}`)
              .then(userList => {
                this.setState({
                  isFetching: false,
                });
                if(userList.data.code !== 200) {
                  alert(userList.data.code + '\n' + JSON.stringify(userList.data.data));
                } else {
                  if(userList.data.data.length === 0){
                    alert('未找到用户~');
                  } else if(userList.data.data.length > 1){
                    this.setState({
                      userData: '',
                      recordListData: '',
                      reminderListData: '',
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
                this.setState({
                  isFetching: false,
                });
                console.log(err);
              })
  
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  };

  confirmUserDelete() {
    if (this.state.recordListData.length > 0){
      alert('亲，要『清除』该用户『全部保养记录』之后才能『删除用户』哟！');
    } else if (this.state.reminderListData.length > 0){
      alert('亲，要『清除』该用户『全部提醒记录』之后才能『删除用户』哟！');
    } else {
      let confirm = window.confirm(`确定删除用户${this.state.userData.user_name}？`);
      if(confirm){
        axios.delete(`https://api.hulunbuirshell.com/api/user/single/${this.state.userData.record_num}`)
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
  }

  handleFindUserSubmit(e) {
    e.preventDefault();
    if(this.state.filter === 'record_num' && this.state.value.length < 7) {
      alert('亲，换油证号格式错误，请检查一下哟！')
    } else {
      this.setState({
        isFetching: true,
      });
      axios.get(`https://api.hulunbuirshell.com/api/user/all?filter=${this.state.filter}&value=${this.state.value}`)
        .then(userList => {
          this.setState({
            isFetching: false,
          });
          if(userList.data.code !== 200) {
            alert(userList.data.code + '\n' + JSON.stringify(userList.data.data));
          } else {
            if(userList.data.data.length === 0){
              alert('未找到用户~');
            } else if(userList.data.data.length > 1){
              this.setState({
                userData: '',
                recordListData: '',
                reminderListData: '',
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
          this.setState({
            isFetching: false,
          });
          console.log(err);
        })
    }
  }

  findUserRecords(record_num) {
    axios.get(`https://api.hulunbuirshell.com/api/user/single?filter=record_num&value=${record_num}`)
      .then(user => {
        if(user.data.code !== 200){
          alert(user.data.code + '\n' + JSON.stringify(user.data.data))
        } else {
          this.setState({
            userData: user.data.data
          });
          const record_num = user.data.data.record_num;
          axios.get(`https://api.hulunbuirshell.com/api/record/user/${record_num}`)
            .then(records => {
              if(records.data.code !== 200){
                alert(records.data);
                console.log(records.data)
              } else {
                this.setState({
                  recordListData: records.data.data
                });
                this.findUserReminders(record_num);
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

  findUserReminders (record_num) {
    axios.get(`https://api.hulunbuirshell.com/api/reminder/user/${record_num}`)
    .then(reminder => {
      if(reminder.data.code !== 200){
        alert(reminder.data);
        console.log(reminder.data)
      } else {
        this.setState({
          reminderListData: reminder.data.data
        })
      }
    })
    .catch(err => {
      alert(err);
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <h3 style = {{ margin: '20px' }}>查找用户</h3>
        <Form className = "search-form" onSubmit = {this.handleFindUserSubmit.bind(this)}>
          <Form.Group>
            <Form.Label>查询条件</Form.Label>
            <Form.Control as="select" name = "filter" value = {this.state.filter} onChange = {this.handleChange.bind(this)}>
              <option value = "plate">按车牌号查找</option>
              <option value = "record_num">按换油证号查找</option>
              <option value = "phone">按手机号查找</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>查询内容</Form.Label>
            <Form.Control 
              type = "text" 
              name = "value" 
              value = {this.state.value} 
              onChange = {this.handleChange.bind(this)} 
              placeholder = {this.state.placeholder} 
            />
          </Form.Group>
          <Button variant="success" type = "submit" disabled = {this.state.isFetching}>
            {this.state.isFetching ? 
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            : ''}
            查找
          </Button>
        </Form>
        {this.state.userListData !== '' ? 
          <div className="user-list-scroller">
          <h5>找到多个用户，请选择要查看的用户。</h5>
            <div className = "user-list">
              { this.state.userListData.map(user => {
                return (
                  <Card className = "user-list-single" bg="secondary" text="white" style={{ minWidth: '200px'}} key = {user._id}>
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
        {this.state.userData !== '' ? 
          <ReminderList 
            reminderListData = {this.state.reminderListData}
            record_num = {this.state.userData.record_num}
            handleFindUserSubmit = {this.handleFindUserSubmit.bind(this)}
          />
        : ""}
      </div>
    )
  }
}

export default FindUser;