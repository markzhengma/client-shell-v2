import React, { Component } from 'react';
import axios from 'axios';
import { Card, Button, Badge, Modal, Form, ListGroup, Col, Row, Container, Image } from 'react-bootstrap';

class AdminList extends Component {
  constructor(props){
    super(props);
    this.state = {
      adminwxList: [],
      adminwxWaitList: [],
      adminwxInfoEditing: '',
      newAdminInfoEditing: '',
      editingFormShow: false,
      newAdminFormShow: true
    }
    this.updateAdminInfo = this.updateAdminInfo.bind(this);
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
  }

  async updateAdminInfo() {
    console.log(this.state.adminwxInfoEditing)
    if(!this.state.adminwxInfoEditing) {
      this.props.showAlert("出错了", "没有要更新的管理员信息", false);
    } else {
      switch(this.state.adminwxInfoEditing.location_char) {
        case("HD"):
          this.setState({
            ...this.state.adminwxInfoEditing,
            location: "河东"
          });
          break;
        case("HX"):
          this.setState({
            ...this.state.adminwxInfoEditing,
            location: "河西"
          });
          break;
        case("MA"):
          this.setState({
            ...this.state.adminwxInfoEditing,
            location: "满洲里"
          });
          break;
        case("MB"):
          this.setState({
            ...this.state.adminwxInfoEditing,
            location: "满洲里二店"
          });
          break;
        case("YA"):
          this.setState({
            ...this.state.adminwxInfoEditing,
            location: "牙克石"
          });
          break;
        default:
          break;
      }

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
  }
  handleNewAdminValueChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      newAdminInfoEditing: {
        ...this.state.newAdminInfoEditing,
        [name]: value
      }
    })
  }

  render() {
    return (
      <div className = "record-list">
        <h3>管理员列表</h3>
        {this.state.adminwxWaitList.length !== 0 ? 
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.newAdminFormShow}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                授权新管理员
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col style={{ maxHeight: "50vh", overflow: "scroll" }}>
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
                            {e.nickname}
                          </ListGroup.Item>
                        )
                      })}
                    </ListGroup>
                  </Col>
                  {this.state.newAdminInfoEditing !== "" ? 
                    <Col>
                      <Card style={{marginBottom: "20px"}}>
                        <Card.Body>
                          <Container>
                            <Row>
                              <Col>
                                {this.state.newAdminInfoEditing.is_admin ?
                                  <Badge variant="warning" style={{fontSize: '14px', marginBottom: '4px', lineHeight: '20px'}}>已授权</Badge>
                                :
                                  <Badge variant="secondary" style={{fontSize: '14px', marginBottom: '4px', lineHeight: '20px'}}>未授权</Badge>
                                }
                                <Card.Text
                                  style={{height: "80px", overflow: "hidden"}}
                                >
                                  微信昵称：<br/>{this.state.newAdminInfoEditing !== "" ? this.state.newAdminInfoEditing.nickname : ""}
                                </Card.Text>
                              </Col>
                              <Col>
                                <Image 
                                  src={this.state.newAdminInfoEditing !== "" ? this.state.newAdminInfoEditing.headimgurl : ""}
                                  style={{minWidth: "100px", marginTop: "10px"}}
                                  thumbnail 
                                />
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
                            管理员门店将影响其创建的换油证号
                          </Form.Text>
                        </Form.Group>
                        <Button 
                          variant='success' 
                          style={{width: "100%"}}
                          disabled = {!this.state.newAdminInfoEditing.is_admin ? false : true}
                        >
                          确认
                        </Button>
                      </Form>
                    </Col>
                  : ""}
                </Row>
              </Container>
            </Modal.Body>
          </Modal>
          : ''
        }
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.editingFormShow}
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
        
        {this.state.adminwxList.length !== 0 && this.state.adminwxWaitList.length !== 0 ? 
          <div>
            {this.state.adminwxList.map(e => {
              let wxInfo = this.state.adminwxWaitList.find(data => data.union_id === e.union_id);
              return(
                <Card 
                  key={e.open_id}
                  bg="secondary"
                  style={{ width:'18rem', color: '#FFFFFF' }}
                  className="mb-2"
                >
                  <Card.Header>
                    <Badge variant="warning" style={{fontSize:'16px', marginRight: '4px'}}>门店</Badge>
                    {e.location}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{e.admin_name}</Card.Title>
                    <Badge variant="success" style={{fontSize: '14px', marginBottom: '4px', lineHeight: '20px'}}>微信昵称</Badge>
                    <Card.Text style={{fontSize: '12px'}}>
                      {wxInfo && wxInfo.nickname !== '' ? wxInfo.nickname : '无微信昵称' }
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button 
                      variant="primary" 
                      style = {{marginRight: '4px'}}
                      onClick={() => this.selectAdminToEdit(true, e.union_id)}
                    >
                      编辑信息
                    </Button>
                    <Button variant="outline-danger" style={{marginBottom: "-2px"}}>删除</Button>
                  </Card.Footer>
                </Card>)
            })}
          </div>
          : ''
        }
      </div>
    )
  }
}

export default AdminList