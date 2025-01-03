import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Pagination, Spinner, Row, Col } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

import UserBrowser from './UserBrowser';

class RecentUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      location_char: '',
      userListData: '',
      pn: 1,
      totalPn: 1,
      isFetching: false,
      totalData: '',
      isFetchingTotal: false
    }
  };

  componentDidMount(){
    this.findUserList(this.props.adminwx.location_char, 1, 20);
    // this.findUserList(this.props.admin.location_char, 1, 20);
    this.setState({
      location_char: this.props.adminwx.location_char
    });
    // this.setState({
    //   location_char: this.props.admin.location_char
    // });
  };

  findUserList(location_char, pn, rn){
    this.setState({
      isFetching: true
    })
    axios.get(`https://api.hulunbuirshell.com/api/user/all/${location_char}?pn=${pn}&rn=${rn}`)
      .then(res => {
        this.setState({
          isFetching: false
        })
        if(res.data.code !== 200) {
          console.log(res.data);
          this.props.showAlert('出错了', res.data.code + '\n' + JSON.stringify(res.data.data), false);
        } else {
          this.setState({
            userListData: res.data.data.list,
            pn: pn,
            totalPn: Math.floor(res.data.data.count / 20) || 1
          });
        }
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false);
        console.log(err);
      })
  };

  getTotalData(){
    this.setState({
      isFetchingTotal: true
    });
    axios.get(`https://api.hulunbuirshell.com/api/user/all/${this.state.location_char}`)
      .then(res => {
        this.setState({
          isFetchingTotal: false
        });
        if(res.data.code !== 200) {
          console.log(res.data);
          this.props.showAlert('出错了', res.data.code + '\n' + JSON.stringify(res.data.data), false);
        } else {
          this.setState({
            totalData: res.data.data.list
          })
        }
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false);
        console.log(err);
      })
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if(name === "location_char"){
      this.setState({
        totalData: ''
      })
    };
    this.setState({
      [name]: value
    })
  };

  render() {
    const headers = [
      {label: 'record_num', key: 'record_num'},
      {label: 'user_name', key: 'user_name'},
      {label: 'make', key: 'make'},
      {label: 'plate', key: 'plate'},
      {label: 'phone', key: 'phone'},
      {label: 'detail', key: 'detail'}
    ];
    return (
      <div>
        <div style = {{padding: "20px"}}>
          <h3>浏览近期用户</h3>
          <Row>
            <Col xs="auto">
              <Form.Group as={Row}>
                <Form.Label column style={{paddingRight: "0"}}>查看门店：</Form.Label>
                <Col xs="auto" style={{paddingLeft: "0"}}>
                  <Form.Control as = "select" name = "location_char" defaultValue = "" onChange = {this.handleChange.bind(this)}>
                    <option value = "" disabled>【请选择】</option>
                    <option value = "HD">海拉尔河东</option>
                    <option value = "HX">海拉尔河西</option>
                    <option value = "MA">满洲里</option>
                    <option value = "MB">满洲里二店</option>
                    <option value = "YA">牙克石</option>
                    <option value = "YB">牙克石二店</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Col>
            <Col xs="auto">
              <Button variant = "success" onClick = {() => this.findUserList(this.state.location_char, 1, 20)}>
                {this.state.isFetching ? 
                  <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  />
                : ''}
                查看选中门店用户
              </Button>
            </Col>
            <Col xs="auto">
              {this.props.adminwx.super_admin ? 
                this.state.totalData === '' ?
                  <Button variant = "primary" disabled = {this.state.isFetchingTotal} onClick = {() => this.getTotalData()}>
                    {this.state.isFetchingTotal ? 
                      <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      />
                    : ''}
                    获取选中门店全部
                  </Button>
                :
                  <CSVLink data = {this.state.totalData} headers = {headers} style = {{ textDecoration: 'none' }}><Button variant = "success">下载选中门店全部</Button></CSVLink>
              : ''}
            </Col>
          </Row>
          <Pagination style = {{ margin: '20px 0' }}>
            <Pagination.First onClick = {() => this.findUserList(this.state.location_char, 1, 20)}/>
            <Pagination.Prev disabled={this.state.pn === 1} onClick = {() => this.findUserList(this.state.location_char, this.state.pn - 1 > 0 ? this.state.pn - 1 : 1, 20)}/>
            <Pagination.Item active>{this.state.pn}</Pagination.Item>
            <Pagination.Next disabled = {this.state.pn === this.state.totalPn} onClick = {() => this.findUserList(this.state.location_char, this.state.pn + 1 > 0 ? this.state.pn + 1 : 1, 20)}/>
            <Pagination.Last onClick = {() => this.findUserList(this.state.location_char, this.state.totalPn, 20)}/>
          </Pagination>
        </div>
        {this.state.userListData !== '' ? 
          <UserBrowser 
            userListData = {this.state.userListData}
            selectFindUserValue = {this.props.selectFindUserValue}
            changeAction = {this.props.changeAction}
          />
        : ""}
        <Pagination style = {{ margin: '20px' }}>
          <Pagination.First onClick = {() => this.findUserList(this.state.location_char, 1, 20)}/>
          <Pagination.Prev disabled={this.state.pn === 1} onClick = {() => this.findUserList(this.state.location_char, this.state.pn - 1 > 0 ? this.state.pn - 1 : 1, 20)}/>
          <Pagination.Item active>{this.state.pn}</Pagination.Item>
          <Pagination.Next disabled = {this.state.pn === this.state.totalPn} onClick = {() => this.findUserList(this.state.location_char, this.state.pn + 1 > 0 ? this.state.pn + 1 : 1, 20)}/>
          <Pagination.Last onClick = {() => this.findUserList(this.state.location_char, this.state.totalPn, 20)}/>
        </Pagination>
      </div>
    )
  }
}

export default RecentUser;