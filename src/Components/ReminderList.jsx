import React, { Component } from 'react';
import axios from 'axios';
import { Table, Form, Row, Col, Button, Card, Badge } from 'react-bootstrap';

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
      isShowReminderList: true
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
      newRecord: {
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
    e.preventDefault();
    if(this.state.newReminder.reminder_cat === "" || this.state.newReminder.time_span === 0) {
      alert("亲，请将提醒内容填写完整哟~");
    } else {
      let confirmed = window.confirm(`亲，您确定要为换油证号${this.props.record_num}的客户创建保养提醒嘛？`);
      if (confirmed) {
        const record_num = this.props.record_num;
        axios({
          url: `https://api.hulunbuirshell.com/api/reminder/user/${record_num}`,
          method: 'POST',
          data: {
            reminder_cat: this.state.newReminder.reminder_cat,
            time_span: this.state.newReminder.time_span
          }
        })
          .then(res => {
            if(res.data.code !== 200){
              alert(res.data.code + '\n' + JSON.stringify(res.data.data));
              console.log(res.data.data);
            } else {
              this.resetNewReminderForm();
              this.resetInput();
              this.props.handleFindUserSubmit(e);
              alert("保养提醒创建成功");
            }
          })
          .catch(err => {
            alert(err);
            console.log(err);
          })
      }
    }
  };

  handleDeleteReminder(e, id){
    let confirmed = window.confirm('亲，您确认删除这条提醒记录吗？')
    if(confirmed){
      axios.delete(`https://api.hulunbuirshell.com/api/reminder/single/${id}`)
        .then(res => {
          if(res.data.code !== 200){
            alert(res.data.code + '\n' + JSON.stringify(res.data.data));
            console.log(res.data.data);
          } else {
            console.log(res)
            this.props.handleFindUserSubmit(e);
            alert('删除成功');
          }
        })
        .catch(err => {
          alert(err);
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
    e.preventDefault();
    axios({
      url: `https://api.hulunbuirshell.com/api/reminder/single/${this.state.selectUpdateId}`,
      method: 'PUT',
      data: this.state.updateReminder
    })
      .then(res => {
        if(res.data.code === 200){
          this.resetUpdateReminder();
          this.props.handleFindUserSubmit(e);
        }
      })
      .catch(err => {
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
          <h5>新保养提醒</h5>
          <Form className = "new-record-form" onSubmit = {this.handleNewReminderSubmit.bind(this)} key={this.state.randomKey}>
            <Row>
              <Col>
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
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>提醒时间</Form.Label>
                  <Form.Control 
                    as = "select" 
                    name = "time_span" 
                    defaultValue = "" 
                    onChange = {this.handleNewReminderChange.bind(this)}
                  >
                    <option value="" disabled>【请选择】</option>
                    <option value="30">1个月后</option>
                    <option value="60">2个月后</option>
                    <option value="90">3个月后</option>
                    <option value="120">4个月后</option>
                    <option value="150">5个月后</option>
                    <option value="180">6个月后</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <div style = {{ margin: '0 0 8px 0' }}>操作</div>
                <Button variant="success" style = {{ margin: '5px' }} type = "submit">保存</Button>
                <Button variant="warning" style = {{ margin: '5px' }} onClick = {this.resetNewReminderForm.bind(this)}>重置</Button>
              </Col>
            </Row>
          </Form>
        </div>
        {data ? 
          data.length > 0 ? 
            <div>
              <h5>
                保养提醒历史  
                {
                  this.state.isShowReminderList 
                  ? <Button
                      variant="dark"
                      onClick={this.changeReminderListShow.bind(this)}
                    >
                      收起
                    </Button>
                  : <Button
                      variant="success"
                      onClick={this.changeReminderListShow.bind(this)}
                    >
                      展开
                    </Button>
                }
              </h5>
              <div 
                className = "reminder-card-list"
                style = {
                          this.state.isShowReminderList
                          ? { height: 'fit-content' }
                          : { height: '0' }
                        }
              >
                {data.map(reminder => {
                  return (
                    <Card 
                      bg="secondary"
                      text="white"
                      key={reminder.reminder_id} 
                      className = "reminder-card"
                    >
                      <Card.Header>提醒时间：{reminder.schedule}</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          保养项目：{reminder.content}
                        </Card.Text>
                        <Card.Text>
                          发送状态：
                          { 
                            reminder.send_time === "" 
                            ? <Badge variant="warning">未发送</Badge>
                            : <Badge variant="success">已发送</Badge>
                          }
                        </Card.Text>
                        <Button
                          variant="danger"
                          onClick={(e) => this.handleDeleteReminder(e, reminder.reminder_id)}
                        >
                          删除
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