import React, { Component } from 'react';
import axios from 'axios';

import { Form, Button, Card, Spinner } from 'react-bootstrap';

class NewUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      isManual: false,
      userData: '',
      user_name: '',
      location_char:'',
      record_num: '',
      phone: '',
      plate: '',
      make: '',
      isFetching: false
    }
  };

  componentDidMount() {
    if(this.props.adminwx.location_char && this.props.adminwx.location_char !== '') {
      this.setState({
        location_char: this.props.adminwx.location_char
      })
    } else {
      this.setState({
        location_char: 'HD'
      })
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

  changeManualState() {
    this.setState({
      isManual: !this.state.isManual
    })
  }

  handleNewUserSubmit(e) {
    e.persist();
    e.preventDefault();

    const { make, phone, plate, record_num, user_name } = this.state;
    const REGEX_CHINESE = /^[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;

    if(!user_name.match(REGEX_CHINESE)) {
      this.props.showAlert('出错了', '请重新检查输入的姓名', false);
    } else if((phone.length !== 7 && phone.length !== 11) || !phone.match(/^\d+$/)) {
      this.props.showAlert('出错了', '请重新检查输入的联系方式', false);
    } else if(!make.match(REGEX_CHINESE)) {
      this.props.showAlert('出错了', '请重新检查输入的车型', false);
    } else if((plate.length !== 7 && plate.length !== 8) || !plate.match(REGEX_CHINESE)) {
      this.props.showAlert('出错了', '请重新检查输入的车牌号', false);
    } else if(this.state.isManual && (record_num.length !== 7 || !record_num.match(/^[A-Z]/) || !record_num.match(/[0-9]$/))) {
      this.props.showAlert('出错了', '请重新检查输入的换油证号', false);
    } else {
      let confirmed = window.confirm(
        `请核对新用户信息：
        \n客户姓名：${this.state.user_name}
        \n换油证号：${this.state.isManual ? 
          this.state.record_num : 
          '自动生成 - ' + this.state.location_char}
          \n联系方式：${this.state.phone}
          \n车型：${this.state.make}
          \n车牌号：${this.state.plate}`
        );
      if(confirmed){
        this.setState({
          isFetching: true
        });
        axios({
          url: `https://api.hulunbuirshell.com/api/user/single${this.state.isManual ? '' : '/' + this.state.location_char}`,
          method: 'POST',
          data: {
            make,
            phone,
            plate,
            record_num,
            user_name: user_name.length === 1 ? user_name + '先生/女士' : user_name,
          }
        })
          .then(res => {
            this.setState({
              isFetching: false
            });
            if(res.data.code !== 200){
              if(res.data.code === 404) {
                console.log(res.data);
                this.props.showAlert(
                  '出错了', 
                  `【车牌号】${this.state.isManual ? '或【换油证号】' : ''}已经存在，请检查输入是否正确。\n可以搜索【车牌号】${this.state.isManual ? '或【换油证号】' : ''}查看此用户是否已经创建`, 
                  false
                );
              } else {
                this.props.showAlert('出错了', res.data.code + '\n' + JSON.stringify(res.data.data), false);
              }
            } else {
              this.props.showAlert('操作成功', '创建成功！新用户换油证号为：' + res.data.data.record_num, true);
              this.props.selectFindUserValue('record_num', res.data.data.record_num);
              this.props.changeAction('find_user');
            }
          })
          .catch(err => {
            this.setState({
              isFetching: false
            });
            this.props.showAlert('出错了', err, false);
          })
      }
    }

  }

  render() {
    return (
      <div>
        <h3 style = {{ margin: '20px' }}>创建用户</h3>
        {this.state.userData !== '' ? 
        <div>
          <h3>新用户：</h3>
          <Card bg="secondary" text="white" border="light" className = "user-single">
            <Card.Body>
              <Row>
                <Col sm={6} md={12} lg={12} style={{minWidth: "140px", marginBottom: "2px"}}>
                  <Card.Text className="mb-2 text-secondary">
                    客户姓名
                  </Card.Text>
                  <Card.Title>
                    {this.state.userData.user_name || ''}
                  </Card.Title>
                </Col>
                <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
                  <Card.Text className="mb-2 text-secondary">
                    换油证号
                  </Card.Text>
                  <Card.Text>
                    {this.state.userData.record_num || ''}
                  </Card.Text>
                </Col>
                <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
                  <Card.Text className="mb-2 text-secondary">
                    联系方式
                  </Card.Text>
                  <Card.Text>
                    {this.state.userData.phone || ''}
                  </Card.Text>
                </Col>
                <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
                  <Card.Text className="mb-2 text-secondary">
                    车牌号
                  </Card.Text>
                  <Card.Text>
                    {this.state.userData.plate || ''}
                  </Card.Text>
                </Col>
                <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
                  <Card.Text className="mb-2 text-secondary">
                    车型
                  </Card.Text>
                  <Card.Text>
                    {this.state.userData.make || ''}
                  </Card.Text>
                </Col>
                <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
                  <Card.Text className="mb-2 text-secondary">
                    备注
                  </Card.Text>
                <Card.Text>
                  {this.state.userData.detail || ''}
                </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <h5>请返回<Button variant = "secondary" onClick = {() => this.props.changeAction('find_user')}>查找老用户</Button>来查找该用户，并添加保养记录。</h5>
        </div>
        : 
        <Form className = "user-form">
          <Form.Label>
            客户姓名：
          </Form.Label>
          <Form.Control type = "text" name = "user_name" onChange = {this.handleChange.bind(this)} value = {this.state.user_name}></Form.Control>
          
          { !this.state.isManual ? 
            <div>
              <Form.Label>
                所属门店：
              </Form.Label>
          
              <Form.Control as = "select" name = "location_char" defaultValue = {this.props.adminwx.location_char} onChange = {this.handleChange.bind(this)} disabled = {this.state.isManual}>
                <option value = "" disabled>【请选择】</option>
                <option value = "HD">海拉尔河东</option>
                <option value = "HX">海拉尔河西</option>
                <option value = "MA">满洲里</option>
                <option value = "MB">满洲里二店</option>
                <option value = "YA">牙克石</option>
                <option value = "YB">牙克石二店</option>
              </Form.Control>
            </div>
            : ''
          }
          
          <Form.Check onChange = {this.changeManualState.bind(this)} type="checkbox" label="手动输入门店换油证号" />
          { this.state.isManual ? 
            <Form.Control type = "text" name = "record_num" 
              onChange = {this.handleChange.bind(this)} 
              value = {this.state.record_num} 
              disabled = {this.state.isManual ? "" : "disabled"}
            >
            </Form.Control>
            : ''
          }
          <Form.Label>
            联系方式：
          </Form.Label>
          <Form.Control type = "text" name = "phone" onChange = {this.handleChange.bind(this)} value = {this.state.phone}></Form.Control>
          <Form.Label>
            车牌号：
          </Form.Label>
          <Form.Control type = "text" name = "plate" onChange = {this.handleChange.bind(this)} value = {this.state.plate}></Form.Control>
          <Form.Label>
            车型：
          </Form.Label>
          <Form.Control type = "text" name = "make" onChange = {this.handleChange.bind(this)} value = {this.state.make}></Form.Control>
          <Button 
            className = "admin-btn" 
            variant = "success" 
            onClick = {this.handleNewUserSubmit.bind(this)}
            disabled = {this.state.isFetching}
          >
            创建
            {this.state.isFetching ? <Spinner animation="border" size="sm" /> : ""}
          </Button>
        </Form>
        }
        
      </div>
    )
  }
}

export default NewUser;