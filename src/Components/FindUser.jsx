import React, { Component } from 'react';
import axios from 'axios';
import { Card, Form, Button, ButtonGroup, Spinner, Row, Col, Nav } from 'react-bootstrap'; 

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
      currentTab: 'record'
    }
  };

  componentDidMount(){
    let receivedFilterAndValue = this.props.selectedFilter !== "" && this.props.selectedValue !== "";
    let findUserInput = JSON.parse(window.localStorage.getItem('find_user_input')) || {filter: "plate", value: ""};
    this.setState({
      filter: !receivedFilterAndValue ? findUserInput.filter : this.props.selectedFilter,
      value: !receivedFilterAndValue ? findUserInput.value : this.props.selectedValue
    }, () => {
      if(receivedFilterAndValue) {
        this.findUser();
      } else {
        let findUserRecord = JSON.parse(window.localStorage.getItem('find_user_record')) || {recordNum: "", hasReturn: false};
        if(findUserRecord.hasReturn) {
          this.findUserRecords(findUserRecord.recordNum);
        };
      }
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
      };
    });
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
    }, () => {
      window.localStorage.removeItem('find_user_input');
      window.localStorage.removeItem('find_user_record');
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
      this.props.showAlert('出错了', '请重新检查输入的姓名', false);
    } else if((phone.length !== 7 && phone.length !== 11) || !phone.match(/^\d+$/)) {
      this.props.showAlert('出错了', '请重新检查输入的联系方式', false);
    } else if(!make.match(REGEX_CHINESE) && !make.match(/[0-9]/)) {
      this.props.showAlert('出错了', '请重新检查输入的车型', false);
    } else if((plate.length !== 7 && plate.length !== 8) || !plate.match(REGEX_CHINESE)) {
      this.props.showAlert('出错了', '请重新检查输入的车牌号', false);
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
                  this.props.showAlert('出错了', userList.data.code + '\n' + JSON.stringify(userList.data.data), false);
                } else {
                  if(userList.data.data.length === 0){
                    this.props.showAlert('出错了', '未找到用户~', false);
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
      this.props.showAlert('出错了', '亲，要『清除』该用户『全部保养记录』之后才能『删除用户』哟！', false);
    } else if (this.state.reminderListData.length > 0){
      this.props.showAlert('出错了', '亲，要『清除』该用户『全部提醒记录』之后才能『删除用户』哟！', false);
    } else {
      let confirm = window.confirm(`确定删除用户${this.state.userData.user_name}？`);
      if(confirm){
        axios.delete(`https://api.hulunbuirshell.com/api/user/single/${this.state.userData.record_num}`)
          .then(res => {
            if(res.data.code !== 200){
              this.props.showAlert('出错了', res.data.code + '\n' + JSON.stringify(res.data.data), false);
            } else {
              this.resetStates();
            }
          })
          .catch(err => {
            this.props.showAlert('出错了', err, false);
            console.log(err)
          })
      }
    }
  }

  handleFindUserSubmit(e) {
    e.preventDefault();

    const REGEX_CHINESE = /^[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;

    if(this.state.filter === 'record_num' && this.state.value.length < 7) {
      this.props.showAlert('出错了', '亲，换油证号格式错误，请检查一下哟！', false);
    } else {
      this.setState({
        isFetching: true,
      });
      this.findUser();
    }
  }

  findUser(){
    window.localStorage.setItem('find_user_input', JSON.stringify({filter: this.state.filter, value: this.state.value}));
    window.localStorage.removeItem('find_user_record');
    // window.localStorage.setItem('find_user_return', JSON.stringify({hasReturn: false}));
    axios.get(`https://api.hulunbuirshell.com/api/user/all?filter=${this.state.filter}&value=${this.state.value}`)
      .then(userList => {
        this.setState({
          isFetching: false,
        });
        if(userList.data.code !== 200) {
          if(userList.data.code === 401) {
            this.props.showAlert('出错了', '未找到用户~', false);
          } else {
            this.props.showAlert('出错了', userList.data.code + '\n' + JSON.stringify(userList.data.data), false);
          }
        } else {
          if(userList.data.data.length === 0){
            this.props.showAlert('出错了', '未找到用户', false);
          } else if(userList.data.data.length > 1){
            // window.localStorage.setItem('find_user_return', JSON.stringify({hasReturn: true}));
            this.setState({
              userData: '',
              recordListData: '',
              reminderListData: '',
              userListData: userList.data.data
            });
          } else {
            // window.localStorage.setItem('find_user_return', JSON.stringify({hasReturn: true}));
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

  findUserRecords(record_num) {
    window.localStorage.setItem('find_user_record', JSON.stringify({recordNum: record_num, hasReturn: false}));
    axios.get(`https://api.hulunbuirshell.com/api/user/single?filter=record_num&value=${record_num}`)
      .then(user => {
        if(user.data.code !== 200){
          this.props.showAlert('出错了', user.data.code + '\n' + JSON.stringify(user.data.data), false);
        } else {
          this.setState({
            userData: user.data.data
          });
          const record_num = user.data.data.record_num;
          axios.get(`https://api.hulunbuirshell.com/api/record/user/${record_num}`)
            .then(records => {
              if(records.data.code !== 200){
                this.props.showAlert('出错了', records.data, false);
                console.log(records.data)
              } else {
                window.localStorage.setItem('find_user_record', JSON.stringify({recordNum: record_num, hasReturn: true}));
                this.setState({
                  recordListData: records.data.data
                });
                this.findUserReminders(record_num);
              }
            })
            .catch(err => {
              this.props.showAlert('出错了', err, false);
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
        this.props.showAlert('出错了', reminder.data, false);
        console.log(reminder.data)
      } else {
        this.setState({
          reminderListData: reminder.data.data
        })
      }
    })
    .catch(err => {
      this.props.showAlert('出错了', err, false);
      console.log(err);
    })
  }

  changeTab (tab) {
    this.setState({
      currentTab: tab
    })
  }

  render() {
    return (
      <div>
        <h3 style = {{ margin: '20px' }}>查询用户记录</h3>
        <Form 
          onSubmit = {this.handleFindUserSubmit.bind(this)}
          style = {{ padding: "20px" }}
        >
          <Form.Row>
            <Col xs="auto">
              <Form.Control as="select" name = "filter" value = {this.state.filter} onChange = {this.handleChange.bind(this)}>
                <option value = "plate">按车牌号查找</option>
                <option value = "record_num">按换油证号查找</option>
                <option value = "phone">按手机号查找</option>
              </Form.Control>
            </Col>
            <Col xs="auto">
              <Form.Control 
                type = "text" 
                name = "value" 
                value = {this.state.value} 
                onChange = {this.handleChange.bind(this)} 
                placeholder = {this.state.placeholder} 
              />
            </Col>
            <Col xs="auto">
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
              <Button 
                variant = "warning" 
                disabled = {this.state.isFetching}
                onClick = {this.resetStates.bind(this)}
                style = {{ marginLeft: "10px" }}
              >
                清空查询
              </Button>
            </Col>
          </Form.Row>
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
        <br/>
        <Row
          style={{
            margin: "20px 0 0 0",
            padding: "5px"
          }}
        >
          <Col sm={12} md={3} lg={2} style={{padding: "0"}}>
            {this.state.userData !== '' ? this.state.isUserUpdating ? 
              <div>
                <div style={{padding: "10px", fontSize: "16px", color: "#212529"}}>
                  编辑客户信息
                </div>
                <Card style={{backgroundColor: "#F9D148", border: "1px solid #dee2e6", marginBottom: "10px"}}>
                  <UserUpdate 
                    userData = {this.state.userData} 
                    cancelUserUpdate = {this.cancelUserUpdate.bind(this)}
                    confirmUserUpdate = {this.confirmUserUpdate.bind(this)}
                    handleUserUpdateChange = {this.handleUserUpdateChange.bind(this)}
                  />
                </Card>
              </div>
            :
              <div>
                <div style={{padding: "10px", fontSize: "16px", color: "#212529"}}>
                  客户信息
                </div>
                <Card style={{backgroundColor: "#F9D148", border: "1px solid #dee2e6", marginBottom: "10px"}}>
                  <UserSingle userData = {this.state.userData}/>
                  <Button 
                    variant="primary" 
                    onClick = {this.selectUserUpdate.bind(this)}
                    style = {{
                      margin: "6px 10px 0 10px"
                    }}
                  >
                    编辑客户信息
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick = {this.confirmUserDelete.bind(this)}
                    style = {{
                      margin: "10px"
                    }}
                  >
                    删除客户信息
                  </Button>
                </Card>
              </div>
            : ""}
          </Col>
          {this.state.userData !== '' ?
            <Col sm={12} md={9} lg={10} style={{padding: "0"}}>
              <Nav 
                variant="tabs" 
                defaultActiveKey="record" 
                onSelect={(selectedKey) => this.changeTab(selectedKey)}
              >
                <Nav.Item>
                  <Nav.Link 
                    as="div"
                    eventKey="record"
                    disabled = {this.state.userData === ""}
                    style={{
                      cursor: "pointer",
                      color: "grey"
                    }}
                  >
                    保养记录
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    as="div"
                    eventKey="reminder"
                    disabled = {this.state.userData === ""}
                    style={{
                      cursor: "pointer",
                      color: "grey"
                    }}
                  >
                    保养提醒
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <div style={{maxHeight: "Calc(100vh - 340px)", overflow: "scroll", padding: "0 6px", border: "1px solid #dee2e6", borderTop: "none"}}>
                {this.state.currentTab === 'record' ?
                  <RecordList 
                    productData = {this.props.productData}
                    giftData = {this.props.giftData}
                    operatorData = {this.props.operatorData}
                    recordListData = {this.state.recordListData}
                    record_num = {this.state.userData.record_num}
                    handleFindUserSubmit = {this.handleFindUserSubmit.bind(this)}
                    showAlert = {this.props.showAlert}
                  />
                : ""}
                {this.state.currentTab === 'reminder' ?
                  <ReminderList 
                    reminderListData = {this.state.reminderListData}
                    record_num = {this.state.userData.record_num}
                    handleFindUserSubmit = {this.handleFindUserSubmit.bind(this)}
                    showAlert = {this.props.showAlert}
                  />
                : ""}
              </div>
            </Col>
          : ""}
        </Row>
      </div>
    )
  }
}

export default FindUser;