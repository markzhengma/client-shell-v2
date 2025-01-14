import React, { Component } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Card, Badge, Spinner, Navbar, Nav } from 'react-bootstrap';

class ReminderList extends Component {
  constructor(props){
    super(props);
    this.state = {
      currDate: '',
      newReminder: {
        reminder_cat: "",
        time_span: "",
      },
      updateReminder: {
        reminder_cat: "",
        time_span: 0,
      },
      selectUpdateId: '',
      randomKey: 0,
      isShowReminderList: true,
      isLoading: false
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
    });
  }

  resetInput(){
    this.setState({
      newReminder: {
        reminder_cat: "",
        time_span: 0
      }
    })
  };

  handleNewReminderChange(e) {
    const target = e.target;
    const value = target.name === 'time_span' ? parseInt(target.value) : target.value;
    const name = target.name;
    this.setState({
      newReminder: {
        ...this.state.newReminder,
        [name]: value
      }
    })
  };

  handleUpdateReminderChange(e) {
    const target = e.target;
    const value = target.name === 'time_span' ? parseInt(target.value) : target.value;
    const name = target.name;
    this.setState({
      updateReminder: {
        ...this.state.updateReminder,
        [name]: value
      }
    })
  }

  resetNewReminderForm(){
    this.setState({ randomKey: Math.random() });
  }

  handleNewReminderSubmit(e){
    e.persist();
    e.preventDefault();
    if(this.state.newReminder.reminder_cat === "" || this.state.newReminder.time_span === 0) {
      this.props.showAlert('出错了', '亲，请将提醒内容填写完整哟~', false);
    } else {
      let confirmed = window.confirm(`亲，您确定要为换油证号${this.props.record_num}的客户创建保养提醒嘛？`);
      if (confirmed) {
        const record_num = this.props.record_num;
        this.setState({
          isLoading: true
        });
        axios({
          url: `https://api.hulunbuirshell.com/api/reminder/user/${record_num}`,
          method: 'POST',
          data: {
            reminder_cat: this.state.newReminder.reminder_cat,
            time_span: this.state.newReminder.time_span
          }
        })
          .then(res => {
            this.setState({
              isLoading: false
            });
            if(res.data.code !== 200 ){
              if(res.data.code === 401) {
                this.props.showAlert('出错了', `未找到换油证号为${record_num}的用户`, false);
              } else if (res.data.code === 403){
                this.props.showAlert('出错了', `该用户（${record_num}）未关注公众号，无法发送提醒`, false);
              }else if (res.data.code === 404){
                this.props.showAlert('出错了', '还有相同的保养提醒未发送，无法创建', false);
              } else {
                this.props.showAlert('出错了', res.data.code + '\n' + JSON.stringify(res.data.data), false);
              }
              console.log(res.data);
            } else {
              this.resetNewReminderForm();
              this.resetInput();
              this.props.handleFindUserSubmit(e);
              this.props.showAlert('操作成功', '保养提醒创建成功', true);
            }
          })
          .catch(err => {
            this.setState({
              isLoading: false
            });
            this.props.showAlert('出错了', err, false);
            console.log(err);
          })
      }
    }
  };

  handleDeleteReminder(e, id){
    e.persist();
    let confirmed = window.confirm('亲，您确认删除这条提醒记录吗？')
    if(confirmed){
      this.setState({
        isLoading: true
      });
      axios.delete(`https://api.hulunbuirshell.com/api/reminder/single/${id}`)
        .then(res => {
          this.setState({
            isLoading: false
          });
          if(res.data.code !== 200){
            this.props.showAlert('出错了', res.data.code + '\n' + JSON.stringify(res.data.data), false);
            console.log(res.data.data);
          } else {
            console.log(res)
            this.props.handleFindUserSubmit(e);
            this.props.showAlert('操作成功', '已删除', true);
          }
        })
        .catch(err => {
          this.setState({
            isLoading: false
          });
          this.props.showAlert('出错了', err, false);
          console.log(err);
        })
    }
  };

  selectUpdateReminder(data){
    this.setState({
      updateReminder: {
        reminder_cat: data.reminder_cat,
        time_span: data.time_span
      },
      selectUpdateId: data._id
    })
  };

  confirmUpdateReminder(e){
    e.persist();
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    axios({
      url: `https://api.hulunbuirshell.com/api/reminder/single/${this.state.selectUpdateId}`,
      method: 'PUT',
      data: this.state.updateReminder
    })
      .then(res => {
        this.setState({
          isLoading: false
        });
        if(res.data.code === 200){
          this.resetUpdateReminder();
          this.props.handleFindUserSubmit(e);
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        console.log(err)
      })
  };

  resetUpdateReminder(){
    this.setState({
      updateReminder: {
        reminder_cat: "",
        time_span: 0
      },
      selectUpdateId: ''
    })
  };

  changeReminderListShow() {
    this.setState({
      isShowReminderList: !this.state.isShowReminderList
    })
  };


  render() {
    const data = this.props.reminderListData;
    return (
      <div className = "record-list">
        <div>
          <Form className = "new-record-form" onSubmit = {(e) => this.handleNewReminderSubmit(e)} key={this.state.randomKey}>
            <Navbar style={{padding: "0", marginBottom: "10px"}}>
            <Navbar.Brand>新保养提醒</Navbar.Brand>
              <Nav className="mr-auto">
                <Button 
                  variant="success" 
                  style = {{ marginRight: '10px' }} 
                  type = "submit"
                  disabled = {this.state.isLoading}
                >
                  添加
                  {this.state.isLoading ? <Spinner animation="border" size="sm" /> : ""}
                </Button>
                <Button 
                  variant="warning" 
                  style = {{ marginRight: '10px' }} 
                  onClick = {this.resetNewReminderForm.bind(this)}
                >
                  重置
                </Button>
              </Nav>
            </Navbar>
            <Row>
              <Col sm={6} md={4} lg={3} style={{maxWidth: "300px"}}>
                <Form.Group>
                  <Form.Label>保养类目</Form.Label>
                  <Form.Control 
                    as = "select" 
                    name = "reminder_cat" 
                    defaultValue = "" 
                    onChange = {this.handleNewReminderChange.bind(this)}
                  >
                    <option value="" disabled>【请选择】</option>
                    <option value="0">1.更换机油</option>
                    <option value="1">2.更换防冻液</option>
                    <option value="2">3.更换刹车油</option>
                    <option value="3">4.更换火花塞</option>
                    <option value="4">5.更换刹车片</option>
                    <option value="5">6.更换正时皮带</option>
                    <option value="6">7.更换变速箱油</option>
                    <option value="7">8.更换车桥油</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col sm={6} md={4} lg={3} style={{maxWidth: "300px"}}>
                <Form.Group>
                  <Form.Label>提醒时间</Form.Label>
                  <Form.Control 
                    as = "select" 
                    name = "time_span" 
                    defaultValue = "" 
                    onChange = {this.handleNewReminderChange.bind(this)}
                  >
                    <option value="" disabled>【请选择】</option>
                    <option value="10">10天后</option>
                    <option value="20">20天后</option>
                    <option value="30">1个月后</option>
                    <option value="60">2个月后</option>
                    <option value="91">3个月后</option>
                    <option value="121">4个月后</option>
                    <option value="152">5个月后</option>
                    <option value="182">6个月后</option>
                    <option value="213">7个月后</option>
                    <option value="243">8个月后</option>
                    <option value="274">9个月后</option>
                    <option value="304">10个月后</option>
                    <option value="335">11个月后</option>
                    <option value="365">12个月后</option>
                    <option value="730">24个月后</option>
                    <option value="1095">36个月后</option>
                    <option value="1460">48个月后</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
        {data ? 
          data.length > 0 ? 
            <div style={{padding: "4px 10px"}}>
                <Navbar style={{padding: "0", marginBottom: "10px"}}>
                  <Navbar.Brand>保养提醒队列</Navbar.Brand>
                </Navbar>
              <div 
                className = "reminder-card-list"
                style = {
                  this.state.isShowReminderList
                  ? { height: 'fit-content', marginLeft: "-10px" }
                  : { height: '0', marginLeft: "-10px" }
                }
              >
                {data.map(reminder => {
                  return (
                    <Card 
                      key={reminder.reminder_id} 
                      className = "reminder-card"
                      style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}}
                    >
                      <Card.Header>提醒时间：<b>{reminder.schedule}</b></Card.Header>
                      <Card.Body>
                        <Card.Text>
                          保养项目：<b>{reminder.content}</b>
                        </Card.Text>
                        <Card.Text>
                          发送状态：
                          { 
                            reminder.send_time === "" 
                            ? <Badge variant="warning" style={{fontSize: "100%"}}>未发送</Badge>
                            : <Badge variant="success" style={{fontSize: "100%"}}>已发送</Badge>
                          }
                        </Card.Text>
                        <Button
                          variant="danger"
                          onClick={(e) => this.handleDeleteReminder(e, reminder.reminder_id)}
                          disabled = {this.state.isLoading}
                        >
                          删除
                          {this.state.isLoading ? <Spinner animation="border" size="sm" /> : ""}
                        </Button>
                      </Card.Body>
                    </Card>
                  )
                })}
              </div>
            </div>
          : ""
        : ""}
      </div>
    )
  }
}

export default ReminderList;