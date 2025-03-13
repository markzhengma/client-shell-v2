import React, { Component } from 'react';
import axios from 'axios';
import { Card, Form, Button, Modal, Container, ListGroup, Spinner, Row, Col, Nav, ButtonGroup } from 'react-bootstrap'; 

import UserSingle from './UserSingle';
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
      isShowUserList: false,
      userData: '',
      recordListData: '',
      reminderListData: '',
      isFetching: false,
      currentTab: 'record',
      userSelectedFromList: "",
      isUpdatingUser: false,
      updatingUserField: "",
      updatingUserInput: ""
    }
  };

  componentDidMount(){
    window.localStorage.removeItem('find_user_record');
    let receivedFilterAndValue = this.props.selectedFilter !== "" && this.props.selectedValue !== "";
    let findUserInput = JSON.parse(window.localStorage.getItem('find_user_input')) || {filter: "plate", value: ""};
    this.setState({
      filter: !receivedFilterAndValue ? findUserInput.filter : this.props.selectedFilter,
      value: !receivedFilterAndValue ? findUserInput.value : this.props.selectedValue
    }, () => {
      if(receivedFilterAndValue) {
        this.props.selectFindUserValue("", "");
        this.findUser();
      } else {
        let findUserRecord = JSON.parse(window.localStorage.getItem('find_user_record')) || {recordNum: "", hasReturn: false};
        // let findUserRecord = {recordNum: "", hasReturn: false};
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

  resetStates(){
    this.setState({
      filter: 'plate',
      placeholder: "请输入车牌号",
      value: '',
      userData: '',
      recordListData: '',
      reminderListData: '',
      userListData: '',
      isShowUserList: false
    }, () => {
      window.localStorage.removeItem('find_user_input');
      window.localStorage.removeItem('find_user_record');
    })
  };

  hideUserList() {
    this.setState({
      userListData: '',
      isShowUserList: false
    })
  }

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
    e.persist();
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
            this.setState({
              userData: '',
              recordListData: '',
              reminderListData: '',
              userListData: userList.data.data,
              isShowUserList: true
            });
          } else {
            this.setState({
              userData: '',
              recordListData: '',
              reminderListData: '',
              userListData: '',
              isShowUserList: false
            }, this.findUserRecords(userList.data.data[0].record_num))
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
    // window.localStorage.setItem('find_user_record', JSON.stringify({recordNum: record_num, hasReturn: false}));
    this.resetUpdateUser();
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
                // window.localStorage.setItem('find_user_record', JSON.stringify({recordNum: record_num, hasReturn: true}));
                // ! note that this might cause a problem because of the async set state
                // keep an eye on this...
                this.setState({
                  recordListData: records.data.data
                });
                this.findUserReminders(record_num);
                this.hideUserList();
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

  selectUserFromUserList(recordNum) {
    let userData = this.state.userListData.find(e => e.record_num === recordNum);
    if(userData && userData.record_num !== ""){
      this.setState({
        userSelectedFromList: userData
      });
    } else {
      this.props.showAlert('出错了', "用户信息错误");
      console.log(userData);
    }
  }

  setFindUserInputAndFetchSelectedUserData(recordNum) {
    if(recordNum && recordNum !== "") {
      window.localStorage.setItem('find_user_input', JSON.stringify({filter: "record_num", value: recordNum}));
      this.setState({
        filter: "record_num",
        value: recordNum
      }, this.findUserRecords(recordNum));
    }
  }

  resetUpdateUser() {
    this.setState({
      isUpdatingUser: false,
      updatingUserField: "",
      updatingUserInput: ""
    })
  }

  selectUserFieldToUpdate(field) {
    if(field && field !== "") {
      this.setState({
        isUpdatingUser: true,
        updatingUserField: field,
        updatingUserInput: ""
      })
    } 
  }

  handleUserUpdatingFieldChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      updatingUserInput: value
    })
  };

  updateUserSingleFieldValue() {
    const REGEX_CHINESE = /^[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
    const field = this.state.updatingUserField;
    const input = this.state.updatingUserInput;
    if(!this.state.isUpdatingUser) {
      console.log("Error: not updating");
    } else if(field === "") {
      console.log("Error: no field selected");
    } else if(this.state.userData.record_num === "") {
      console.log("Error: no record num")
    } else if(field === "user_name" && !input.match(REGEX_CHINESE)) {
      this.props.showAlert('出错了', '请重新检查输入的姓名', false);
    } else if (field === "phone" && ((input.length !== 7 && input.length !== 11) || !input.match(/^\d+$/))){
      this.props.showAlert('出错了', '请重新检查输入的联系方式', false);
    } else if (field === "make" && !input.match(REGEX_CHINESE) && !input.match(/[0-9]/)){
      this.props.showAlert('出错了', '请重新检查输入的车型', false);
    } else if (field === "plate" && ((input.length !== 7 && input.length !== 8) || !input.match(REGEX_CHINESE))){
      this.props.showAlert('出错了', '请重新检查输入的车牌号', false);
    } else {
      let fieldChinese = "";
      switch(field) {
        case "user_name" :
          fieldChinese = "客户姓名";
          break;
        case "phone" :
          fieldChinese = "电话号码";
          break;
        case "plate" :
          fieldChinese = "车牌号";
          break;
        case "make" :
          fieldChinese = "车型";
          break;
        case "detail" :
          fieldChinese = "备注";
          break;
        default:
          break;
      }
      let confirm = window.confirm(`确定更新换油证号为${this.state.userData.record_num}的客户信息？\n${fieldChinese}: ${this.state.userData[field]} -> ${input}？`);
      if(confirm){
        this.setState({
          isFetching: true,
        });
        axios({
          url: `https://api.hulunbuirshell.com/api/user/single-field-update/${this.state.userData.record_num}`,
          method: "PUT",
          data: {
            field: this.state.updatingUserField,
            value: this.state.updatingUserInput
          }
        })
          .then(res => {
            this.setState({
              isFetching: false,
            });
            this.resetUpdateUser();
            if(res.data.code !== 200) {
              console.log("update failed");
              console.log(res.data);
            } else {
              this.findUserRecords(this.state.userData.record_num);
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
  }

  render() {
    return (
      <div style={{padding: "20px"}}>
        <Row>
          <Col xs="auto">
            <h3>查询用户记录</h3>
          </Col>
          <Col xs="auto">
            <Form onSubmit = {this.handleFindUserSubmit.bind(this)}>
              <Form.Row>
                <Col xs="auto" style={{marginBottom: "10px"}}>
                  <Form.Control as="select" name = "filter" value = {this.state.filter} onChange = {this.handleChange.bind(this)}>
                    <option value = "plate">按车牌号查找</option>
                    <option value = "record_num">按换油证号查找</option>
                    <option value = "phone">按手机号查找</option>
                  </Form.Control>
                </Col>
                <Col xs="auto" style={{marginBottom: "10px"}}>
                  <Form.Control 
                    type = "text" 
                    name = "value" 
                    value = {this.state.value} 
                    onChange = {this.handleChange.bind(this)} 
                    placeholder = {this.state.placeholder} 
                  />
                </Col>
                <Col xs="auto" style={{marginBottom: "10px"}}>
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
          </Col>
        </Row>
        {this.state.userListData !== "" ?
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.isShowUserList}
            onHide={this.hideUserList.bind(this)}
          >
            <Modal.Header 
              style={{backgroundColor: "#F9D148"}}
              closeButton
            >
              <Modal.Title id="contained-modal-title-vcenter">
                找到多个用户，请选择要查看的用户
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: "#656565"}}>
              <Container>
                <Row>
                  <Col sm={6} md={6} lg={4} style={{ height: "300px", overflow: "scroll" }}>
                    <ListGroup>
                      {this.state.userListData.map(user => {
                        return (
                          <ListGroup.Item 
                            variant='warning'
                            action
                            onClick={() => this.selectUserFromUserList(user.record_num)}
                            key={user.record_num}
                            style={{ cursor: "pointer" }}
                          >
                            {user.user_name} {user.record_num || ''}
                            {/* <Button variant="primary" style = {{ margin: '10px' }} onClick = {() => this.findUserRecords(user.record_num)}>查看</Button> */}
                          </ListGroup.Item>
                        )
                      })}
                    </ListGroup>
                  </Col>
                  {this.state.userSelectedFromList !== "" ? 
                    <Col sm={6} md={6} lg={8}>
                      <Card 
                        bg="dark" 
                        text='light'
                        style={{height: "100%"}}
                      >
                        <UserSingle userData = {this.state.userSelectedFromList}/>
                        <Button 
                          variant="success" 
                          style = {{ margin: '10px' }} 
                          onClick = {() => this.setFindUserInputAndFetchSelectedUserData(this.state.userSelectedFromList.record_num)}
                        >
                          查看
                        </Button>
                      </Card>
                    </Col>
                  :
                    <Col sm={6} md={6} lg={8}>
                      <Card 
                        bg="dark" 
                        text='light'
                        style={{height: "100%"}}
                      >
                        <Card.Body>
                          <Card.Text>
                            *请从列表中选择
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  }
                </Row>
              </Container>
            </Modal.Body>
          </Modal>
        : "" }

        <Row
          style={{
            margin: "20px 0 0 0",
            padding: "5px"
          }}
        >
          <Col sm={12} md={3} lg={2} style={{padding: "0"}}>
            {this.state.userData !== '' ? 
              <div style={{paddingRight: "4px"}}>
                <div style={{padding: "8px 12px", fontSize: "16px", color: "#393939", fontWeight: "500"}}>
                  客户信息
                </div>
                <Card style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', border: "1px solid #dee2e6", marginBottom: "10px"}}>
                  <Card.Body>
                    <Row>
                      <Col 
                        className='user-info-block'
                        sm={6} md={12} lg={12} style={{minWidth: "140px", marginBottom: "2px"}}
                      >
                        <Row className = "user-info-field">
                          <Card.Text className="mb-2 text-secondary">
                            客户姓名
                          </Card.Text>
                          {this.state.updatingUserField !== "user_name" ? 
                            <Button 
                              className="user-info-btn"
                              variant='outline-secondary' size="sm"
                              onClick={() => this.selectUserFieldToUpdate("user_name")}
                              style={{position: "absolute", right: "15px"}}
                            >
                              编辑
                            </Button>
                          :
                            <ButtonGroup style={{position: "absolute", right: "15px"}}>
                              <Button variant="success" size="sm" onClick={this.updateUserSingleFieldValue.bind(this)}>确认</Button>
                              <Button variant="warning" size="sm" onClick={() => this.resetUpdateUser()}>取消</Button>
                            </ButtonGroup>
                          }
                        </Row>
                        {this.state.isUpdatingUser && this.state.updatingUserField === "user_name" ?
                          <Form.Control defaultValue={this.state.userData.user_name || ""} onChange={this.handleUserUpdatingFieldChange.bind(this)}/>
                        :
                          <Card.Title>
                            {this.state.userData.user_name || ''}
                          </Card.Title>
                        }
                      </Col>
                      <Col sm={6} md={12} lg={12} style={{minWidth: "140px", marginBottom: "15px"}}>
                        <Card.Text className="mb-2 text-secondary">
                          换油证号
                        </Card.Text>
                        <Card.Text>
                          {this.state.userData.record_num || ''}
                        </Card.Text>
                      </Col>
                      <Col sm={6} md={12} lg={12} style={{minWidth: "140px", marginBottom: "15px"}}>
                        <Row className = "user-info-field">
                          <Card.Text className="mb-2 text-secondary">
                            联系方式
                          </Card.Text>
                          {this.state.updatingUserField !== "phone" ? 
                            <Button 
                              variant='outline-secondary' size="sm"
                              onClick={() => this.selectUserFieldToUpdate("phone")}
                              style={{position: "absolute", right: "15px"}}
                            >
                              编辑
                            </Button>
                          :
                            <ButtonGroup style={{position: "absolute", right: "15px"}}>
                              <Button variant="success" size="sm" onClick={this.updateUserSingleFieldValue.bind(this)}>确认</Button>
                              <Button variant="warning" size="sm" onClick={() => this.resetUpdateUser()}>取消</Button>
                            </ButtonGroup>
                          }
                        </Row>
                        {this.state.isUpdatingUser && this.state.updatingUserField === "phone" ?
                          <Form.Control defaultValue={this.state.userData.phone || ""} onChange={this.handleUserUpdatingFieldChange.bind(this)}/>
                        :
                          <Card.Text>
                            {this.state.userData.phone || ''}
                          </Card.Text>
                        }
                      </Col>
                      <Col sm={6} md={12} lg={12} style={{minWidth: "140px", marginBottom: "15px"}}>
                        <Row className = "user-info-field">
                          <Card.Text className="mb-2 text-secondary">
                            车牌号
                          </Card.Text>
                          {this.state.updatingUserField !== "plate" ? 
                            <Button 
                              variant='outline-secondary' size="sm"
                              onClick={() => this.selectUserFieldToUpdate("plate")}
                              style={{position: "absolute", right: "15px"}}
                            >
                              编辑
                            </Button>
                          :
                            <ButtonGroup style={{position: "absolute", right: "15px"}}>
                              <Button variant="success" size="sm" onClick={this.updateUserSingleFieldValue.bind(this)}>确认</Button>
                              <Button variant="warning" size="sm" onClick={() => this.resetUpdateUser()}>取消</Button>
                            </ButtonGroup>
                          }
                        </Row>
                        {this.state.isUpdatingUser && this.state.updatingUserField === "plate" ?
                          <Form.Control defaultValue={this.state.userData.plate || ""} onChange={this.handleUserUpdatingFieldChange.bind(this)}/>
                        :
                          <Card.Text>
                            {this.state.userData.plate || ''}
                          </Card.Text>
                        }
                      </Col>
                      <Col sm={6} md={12} lg={12} style={{minWidth: "140px", marginBottom: "15px"}}>
                        <Row className = "user-info-field">
                          <Card.Text className="mb-2 text-secondary">
                            车型
                          </Card.Text>
                          {this.state.updatingUserField !== "make" ? 
                            <Button 
                              variant='outline-secondary' size="sm"
                              onClick={() => this.selectUserFieldToUpdate("make")}
                              style={{position: "absolute", right: "15px"}}
                            >
                              编辑
                            </Button>
                          :
                            <ButtonGroup style={{position: "absolute", right: "15px"}}>
                              <Button variant="success" size="sm" onClick={this.updateUserSingleFieldValue.bind(this)}>确认</Button>
                              <Button variant="warning" size="sm" onClick={() => this.resetUpdateUser()}>取消</Button>
                            </ButtonGroup>
                          }
                        </Row>
                        {this.state.isUpdatingUser && this.state.updatingUserField === "make" ?
                          <Form.Control defaultValue={this.state.userData.make || ""} onChange={this.handleUserUpdatingFieldChange.bind(this)}/>
                        :
                          <Card.Text>
                            {this.state.userData.make || ''}
                          </Card.Text>
                        }
                      </Col>
                      <Col sm={6} md={12} lg={12} style={{minWidth: "140px", marginBottom: "15px"}}>
                        <Row className = "user-info-field">
                          <Card.Text className="mb-2 text-secondary">
                            备注
                          </Card.Text>
                          {this.state.updatingUserField !== "detail" ? 
                            <Button 
                              variant='outline-secondary' size="sm"
                              onClick={() => this.selectUserFieldToUpdate("detail")}
                              style={{position: "absolute", right: "15px"}}
                            >
                              编辑
                            </Button>
                          :
                            <ButtonGroup style={{position: "absolute", right: "15px"}}>
                              <Button variant="success" size="sm" onClick={this.updateUserSingleFieldValue.bind(this)}>确认</Button>
                              <Button variant="warning" size="sm" onClick={() => this.resetUpdateUser()}>取消</Button>
                            </ButtonGroup>
                          }
                        </Row>
                        {this.state.isUpdatingUser && this.state.updatingUserField === "detail" ?
                          <Form.Control as="textarea" rows={2} defaultValue={this.state.userData.detail || ""} onChange={this.handleUserUpdatingFieldChange.bind(this)}/>
                        :
                          <Card.Text>
                            {this.state.userData.detail || ''}
                          </Card.Text>
                        }
                      </Col>
                    </Row>
                  </Card.Body>
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
            : "请输入用户信息查询"}
          </Col>
          {this.state.userData !== '' ?
            <Col sm={12} md={9} lg={10} style={{padding: "0 4px 0 0"}}>
              <Nav 
                variant="tabs" 
                
                defaultActiveKey="record" 
                onSelect={(selectedKey) => this.changeTab(selectedKey)}
              >
                <Nav.Item>
                  <Nav.Link 
                    as="div"
                    className="find_user_navs"
                    eventKey="record"
                    disabled = {this.state.userData === ""}
                    style={{
                      cursor: "pointer",
                      color: "#656565"
                    }}
                  >
                    保养记录
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    as="div"
                    className="find_user_navs"
                    eventKey="reminder"
                    disabled = {this.state.userData === ""}
                    style={{
                      cursor: "pointer",
                      color: "#656565"
                    }}
                  >
                    保养提醒
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <div style={{padding: "0 6px"}}>
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