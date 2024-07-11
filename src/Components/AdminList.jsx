import React, { Component } from 'react';
import axios from 'axios';
import { Card, Button, Badge, Modal, Form, ListGroup, Col, Row, Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';

class AdminList extends Component {
  constructor(props){
    super(props);
    this.state = {
      adminwxList: [],
      adminwxWaitList: [],
      adminwxInfoEditing: '',
      newAdminInfoEditing: '',
      editingFormShow: false,
      newAdminFormShow: false,
      isShowDelAlert: false,
      adminDelId: '',
      adminDelName: '',
      adminLocationChar: ''
    }
    this.updateAdminInfo = this.updateAdminInfo.bind(this);
    this.addNewAdmin = this.addNewAdmin.bind(this);
    this.showDelAlert = this.showDelAlert.bind(this);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
  };

  componentDidMount(){
    this.findAdminwxWaitList();
    this.findAdminwxList();
  };

  async findAdminwxWaitList() {
    const domain = 'http://localhost:7001';
    const res = await axios.get(`${domain}/api/admin/wxwaiting`);
    if(!res || res.status !== 200) {
      this.props.showAlert('出错了', res.data, false);
    } else {
      this.setState({
        adminwxWaitList: res.data.data
      })
    }
  }
  async findAdminwxList() {
    const domain = 'http://localhost:7001';
    const res = await axios.get(`${domain}/api/admin/all`);
    if(!res || res.status !== 200) {
      this.props.showAlert('出错了', res.data, false);
    } else {
      this.setState({
        adminwxList: res.data.data
      })
    }
  }

  selectAdminToEdit(isEditing, id) {
    if(isEditing){
      let adminToEdit = this.state.adminwxList.find(e => e.union_id === id);
      if(adminToEdit && adminToEdit.union_id !== ""){
        this.setState({
          adminwxInfoEditing: adminToEdit,
          editingFormShow: true
        });
      }
    } else {
      this.setState({
        adminwxInfoEditing: '',
        editingFormShow: false
      });
    }
  }

  selectAdminFromWaitList(id) {
    let adminData = this.state.adminwxWaitList.find(e => e.union_id === id);
    if(adminData && adminData.union_id !== ""){
      this.setState({
        newAdminInfoEditing: adminData
      });
    }
  }

  startAddingNewAdmin(isStarting) {
    this.setState({
      newAdminFormShow: isStarting
    })
    if(!isStarting) {
      this.setState({
        newAdminInfoEditing: ""
      })
    }
  }

  async updateAdminInfo() {
    console.log(this.state.adminwxInfoEditing)
    if(!this.state.adminwxInfoEditing) {
      this.props.showAlert("出错了", "没有要更新的管理员信息", false);
    } else {
      let adminInfo = this.state.adminwxInfoEditing;

      const domain = 'http://localhost:7001';
      const res = await axios({
        url: `${domain}/api/admin/role/update`,
        method: 'PUT',
        data: {
          unionid: adminInfo.union_id,
          admin_name: adminInfo.admin_name,
          location: adminInfo.location,
          location_char: adminInfo.location_char
          }
      });
      if(res.data.status !== 200) {
        console.log(res);
        this.props.showAlert('出错了', res.data.msg, false);
      } else {
        this.props.showAlert("操作成功", "管理员个人信息更新完成", true);
        await this.findAdminwxList();
        await this.findAdminwxWaitList();
        this.selectAdminToEdit(false);
      }
    }
  }

  async addNewAdmin() {
    if(!this.state.newAdminInfoEditing) {
      this.props.showAlert("出错了", "没有要更新的管理员信息", false);
    } else {
      let adminInfo = this.state.newAdminInfoEditing;

      const domain = 'http://localhost:7001';
      const res = await axios({
        url: `${domain}/api/admin/role/new`,
        method: 'PUT',
        data: {
          unionid: adminInfo.union_id,
          admin_name: adminInfo.admin_name,
          location: adminInfo.location,
          location_char: adminInfo.location_char
        }
      });

      if(res.data.status !== 200) {
        console.log(res);
        this.props.showAlert('出错了', res.data.msg, false);
      } else {
        this.props.showAlert("操作成功", `${adminInfo.admin_name}已成为新的管理员`, true);
        await this.findAdminwxList();
        await this.findAdminwxWaitList();
        this.startAddingNewAdmin(false);
      }
    }
  }

  showDelAlert(bool, e) {
    this.setState({
      isShowDelAlert: bool,
      adminDelId: bool ? e.union_id : '',
      adminDelName: bool ? e.admin_name : ''
    })
  }

  async removeAdmin(id, adminName) {
    const domain = 'http://localhost:7001';
    const res = await axios({
      url: `${domain}/api/admin/role/del`,
      method: "PUT",
      data: {
        unionid: id
      }
    });

    if(res.data.status !== 200) {
      console.log(res);
      this.props.showAlert('出错了', res.data.msg, false);
    } else {
      this.props.showAlert("操作成功", `「${adminName}」已从管理员中移除`, true);
      await this.findAdminwxList();
      await this.findAdminwxWaitList();
      this.showDelAlert(false);
    }
  }

  handleLocationSelect(location) {
    switch(location) {
      case("HD"):
        this.setState({
            adminLocationTxt: "海拉尔河东",
            adminLocationChar: location
        });
        break;
      case("HX"):
        this.setState({
            adminLocationTxt: "海拉尔河西",
            adminLocationChar: location
        });
        break;
      case("MA"):
        this.setState({
            adminLocationTxt: "满洲里一店",
            adminLocationChar: location
        });
        break;
      case("MB"):
        this.setState({
            adminLocationTxt: "满洲里二店",
            adminLocationChar: location
        });
        break;
      case("YA"):
        this.setState({
            adminLocationTxt: "牙克石",
            adminLocationChar: location
        });
        break;
      default:
        this.setState({
          adminLocationTxt: "",
          adminLocationChar: ""
        });
        break;
    }
  }
  
  handleAdminInfoValueChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      adminwxInfoEditing: {
        ...this.state.adminwxInfoEditing,
        [name]: value
      }
    })
    if(name === "location_char") {
      switch(value) {
        case("HD"):
          this.setState({
            adminwxInfoEditing: {
              ...this.state.adminwxInfoEditing,
              location: "河东",
              [name]: value
            }
          });
          break;
        case("HX"):
          this.setState({
            adminwxInfoEditing: {
              ...this.state.adminwxInfoEditing,
              location: "河西",
              [name]: value
            }
          });
          break;
        case("MA"):
          this.setState({
            adminwxInfoEditing: {
              ...this.state.adminwxInfoEditing,
              location: "满洲里",
              [name]: value
            }
          });
          break;
        case("MB"):
          this.setState({
            adminwxInfoEditing: {
              ...this.state.adminwxInfoEditing,
              location: "满洲里二店",
              [name]: value
            }
          });
          break;
        case("YA"):
          this.setState({
            adminwxInfoEditing: {
              ...this.state.adminwxInfoEditing,
              location: "牙克石",
              [name]: value
            }
          });
          break;
        default:
          break;
      }
    } else {
      this.setState({
        adminwxInfoEditing: {
          ...this.state.adminwxInfoEditing,
          [name]: value
        }
      })
    }
  }
  handleNewAdminValueChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if(name === "location_char") {
      switch(value) {
        case("HD"):
          this.setState({
            newAdminInfoEditing: {
              ...this.state.newAdminInfoEditing,
              location: "河东",
              [name]: value
            }
          });
          break;
        case("HX"):
          this.setState({
            newAdminInfoEditing: {
              ...this.state.newAdminInfoEditing,
              location: "河西",
              [name]: value
            }
          });
          break;
        case("MA"):
          this.setState({
            newAdminInfoEditing: {
              ...this.state.newAdminInfoEditing,
              location: "满洲里",
              [name]: value
            }
          });
          break;
        case("MB"):
          this.setState({
            newAdminInfoEditing: {
              ...this.state.newAdminInfoEditing,
              location: "满洲里二店",
              [name]: value
            }
          });
          break;
        case("YA"):
          this.setState({
            newAdminInfoEditing: {
              ...this.state.newAdminInfoEditing,
              location: "牙克石",
              [name]: value
            }
          });
          break;
        default:
          break;
      }
    } else {
      this.setState({
        newAdminInfoEditing: {
          ...this.state.newAdminInfoEditing,
          [name]: value
        }
      })
    }
  };

  render() {
    // info card of each admin
    const AdminCard = (props) => {
      const {e, location_char} = props;
      if(location_char === "" || (location_char !== "" && e.location_char === location_char)) {
        let wxInfo = this.state.adminwxWaitList.find(data => data.union_id === e.union_id);
        return(
          <Card 
            key={e.open_id}
            bg="secondary"
            style={{ 
              width:'18rem', 
              color: '#FFFFFF', 
              margin: "10px",
              boxShadow: "rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px"
            }}
            className="mb-2"
          >
            <Card.Header style={{fontWeight: "600", fontSize: "20px"}}>{e.admin_name}</Card.Header>
            <Card.Body>
              <Card.Text style={{fontSize: '14px', textJustify: "center"}}>
                <Badge variant="warning" style={{fontSize:'12px', marginRight: '6px', lineHeight: '18px'}}>门店</Badge>
                {e.location}
              </Card.Text>

              <Card.Text style={{fontSize: '14px', textJustify: "center"}}>
                <Badge variant="success" style={{fontSize: '12px', marginRight: '6px', lineHeight: '18px'}}>微信</Badge>
                {wxInfo && wxInfo.nickname !== '' ? wxInfo.nickname.length >= 15 ? wxInfo.nickname.slice(0, 14) + "..." : wxInfo.nickname : '无微信昵称' }
              </Card.Text>

            </Card.Body>
            <Card.Footer>
              <Button 
                variant="outline-warning" 
                style = {{marginRight: '4px'}}
                onClick={() => this.selectAdminToEdit(true, e.union_id)}
              >
                编辑信息
              </Button>
              <Button 
                variant="outline-light" 
                onClick={() => this.showDelAlert(true, e)}
              >
                删除
              </Button>
            </Card.Footer>
          </Card>
        )
      } else {
        return ""
      }
    }

    return (
      <div className = "record-list">
        <Navbar style={{padding: "0", marginBottom: "12px"}}>
          <Container style={{justifyContent: "left", margin: "0"}}>
            <Navbar.Brand>
              <h3 style={{margin: "0"}}>管理员列表</h3>
            </Navbar.Brand>
            <Nav>
              <NavDropdown 
                onSelect={this.handleLocationSelect} 
                title={this.state.adminLocationChar === "" ? "全部门店" : this.state.adminLocationTxt}
                style={{minWidth: "110px"}}
              >
                <NavDropdown.Item eventKey="HD">海拉尔河东</NavDropdown.Item>
                <NavDropdown.Item eventKey="HX">海拉尔河西</NavDropdown.Item>
                <NavDropdown.Item eventKey="MA">满洲里一店</NavDropdown.Item>
                <NavDropdown.Item eventKey="MB">满洲里二店</NavDropdown.Item>
                <NavDropdown.Item eventKey="YA">牙克石</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="">全部</NavDropdown.Item>
              </NavDropdown>
              <Nav.Item>
                <Button 
                  variant="warning"
                  onClick={() => this.startAddingNewAdmin(true)}
                >
                  添加新管理员
                </Button>
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>

        {/* remove confirmation pop up */}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.isShowDelAlert}
          onHide={() => this.showDelAlert(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              删除管理员
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            确认要删除管理员{this.state.adminDelName}？
          </Modal.Body>
          <Modal.Footer>
            <Button 
              onClick={() => this.removeAdmin(this.state.adminDelId, this.state.adminDelName)}
              variant="danger"
            >
              确认
            </Button>
            <Button 
              onClick={() => this.showDelAlert(false)}
              variant="secondary"
            >
              取消
            </Button>
          </Modal.Footer>
        </Modal>

        {/* new admin pop up */}
        {this.state.adminwxWaitList.length !== 0 ? 
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.newAdminFormShow}
            onHide={() => this.startAddingNewAdmin(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                授权新管理员
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col style={{ maxHeight: "550px", overflow: "scroll" }}>
                    <ListGroup>
                      {this.state.adminwxWaitList.map(e => {
                        return(
                          <ListGroup.Item 
                            action 
                            variant = {e.union_id !== this.state.newAdminInfoEditing.union_id ? 
                              e.is_admin ? 
                              "warning" 
                              : 
                              "light"
                              :
                              "primary"
                            }
                            key={e.union_id}
                            onClick={() => this.selectAdminFromWaitList(e.union_id)}
                          >
                            {e.nickname ? e.nickname.length >= 10 ? e.nickname.slice(0, 9) + "..." : e.nickname : ""}
                          </ListGroup.Item>
                        )
                      })}
                    </ListGroup>
                  </Col>
                  {this.state.newAdminInfoEditing !== "" ? 
                    <Col>
                      <Card style={{marginBottom: "10px"}}>
                        <Card.Body>
                          <Container>
                            <Row>
                              <Col>
                                <Image 
                                  src={this.state.newAdminInfoEditing !== "" ? this.state.newAdminInfoEditing.headimgurl : ""}
                                  style={{minWidth: "80px", marginTop: "10px"}}
                                  thumbnail 
                                />
                              </Col>
                              <Col style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                {this.state.newAdminInfoEditing.is_admin ?
                                  <Badge variant="warning" style={{fontSize: '14px', marginBottom: '4px', lineHeight: '20px'}}>已授权</Badge>
                                :
                                  <Badge variant="secondary" style={{fontSize: '14px', marginBottom: '4px', lineHeight: '20px'}}>未授权</Badge>
                                }
                                <Card.Text style={{fontSize: "12px", marginBottom: "2px", color: "#28A745"}}>
                                  微信昵称
                                </Card.Text>
                                <Card.Text style={{height: "50px", overflow: "hidden"}}>
                                  {this.state.newAdminInfoEditing !== "" ? this.state.newAdminInfoEditing.nickname : ""}
                                </Card.Text>
                              </Col>
                            </Row>
                          </Container>
                        </Card.Body>
                      </Card>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>管理员姓名</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="admin_name"
                            placeholder="请填写"
                            disabled = {!this.state.newAdminInfoEditing.is_admin ? false : true}
                            defaultValue={this.state.newAdminInfoEditing !== "" ? this.state.newAdminInfoEditing.admin_name : ""} 
                            onChange = {this.handleNewAdminValueChange.bind(this)}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>门店</Form.Label>
                          <Form.Control 
                            as="select" 
                            name="location_char"
                            disabled = {!this.state.newAdminInfoEditing.is_admin ? false : true}
                            defaultValue={this.state.adminwxInfoEditing !== "" ? this.state.adminwxInfoEditing.location_char : ""}
                            onChange = {this.handleNewAdminValueChange.bind(this)}
                          >
                            <option value = "" disabled>--选择门店--</option>
                            <option value="HD">河东</option>
                            <option value="HX">河西</option>
                            <option value="MA">满洲里</option>
                            <option value="MB">满洲里二店</option>
                            <option value="YA">牙克石</option>
                          </Form.Control>
                          <Form.Text className="text-muted">
                            门店影响其创建的换油证号
                          </Form.Text>
                        </Form.Group>
                        <Button 
                          variant='warning' 
                          style={{width: "100%"}}
                          disabled = {!this.state.newAdminInfoEditing.is_admin ? false : true}
                          onClick={this.addNewAdmin}
                        >
                          确认
                        </Button>
                      </Form>
                    </Col>
                  :
                    <Col>
                       <Card style={{height: "100%"}}>
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
          : ''
        }

        {/* admin info edit pop up */}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.editingFormShow}
          onHide={() => this.selectAdminToEdit(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              编辑已授权管理员信息
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="update-admin-info">
              <Form.Group className="mb-3">
                <Form.Label>姓名</Form.Label>
                <Form.Control 
                  type="text" 
                  name="admin_name"
                  defaultValue={this.state.adminwxInfoEditing !== "" ? this.state.adminwxInfoEditing.admin_name : ""} 
                  onChange = {this.handleAdminInfoValueChange.bind(this)}
                />
                <Form.Text className="text-muted">
                  请填入正确的姓名
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label>门店</Form.Label>
                <Form.Control 
                  as="select" 
                  name="location_char"
                  defaultValue={this.state.adminwxInfoEditing !== "" ? this.state.adminwxInfoEditing.location_char : ""}
                  onChange = {this.handleAdminInfoValueChange.bind(this)}
                >
                  <option disabled>--选择门店--</option>
                  <option value="HD">河东</option>
                  <option value="HX">河西</option>
                  <option value="MA">满洲里</option>
                  <option value="MB">满洲里二店</option>
                  <option value="YA">牙克石</option>
                </Form.Control>
                <Form.Text className="text-muted">
                  管理员门店将影响其创建的换油证号
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='success' onClick={this.updateAdminInfo}>确认</Button>
            <Button variant='secondary' onClick={() => this.selectAdminToEdit(false)}>取消</Button>
          </Modal.Footer>
        </Modal>

        {/* generate admin card for every admin depending on the filter */}
        {this.state.adminwxList.length !== 0 && this.state.adminwxWaitList.length !== 0 ? 
          <Row>
            {this.state.adminwxList.map(e => {
              return <AdminCard e = {e} location_char = {this.state.adminLocationChar} key={e.union_id} />
            })}
          </Row>
          : ''
        }
      </div>
    )
  }
}

export default AdminList