import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Pagination } from 'react-bootstrap';
import UserBrowser from './UserBrowser';

class RecentUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      location_char: '',
      userListData: '',
      pn: 1,
      totalPn: 1,
      totalUserList: ''
    }
  };

  componentDidMount(){
    this.findUserList(this.props.admin.location_char, 1, 20);
    this.setState({
      location_char: this.props.admin.location_char
    });
  };

  findUserList(location_char, pn, rn){
    axios.get(`https://api.hailarshell.cn/api/user/all/${location_char}?pn=${pn}&rn=${rn}`)
      .then(res => {
        if(res.data.code !== 200) {
          console.log(res.data);
          alert(res.data.code + '\n' + JSON.stringify(res.data.data));
        } else {
          this.setState({
            userListData: res.data.data.list,
            pn: pn,
            totalPn: Math.floor(res.data.data.count / 20) || 1
          })
        }
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  };

  render() {
    return (
      <div>
        <div className = "record-search-box">
          <h3>浏览近期用户</h3>
          <Form.Group>
            <Form.Label>门店</Form.Label>
            <Form.Control as = "select" name = "location_char" defaultValue = "" onChange = {this.handleChange.bind(this)}>
              <option value = "" disabled>【请选择】</option>
              <option value = "HD">海拉尔河东</option>
              <option value = "HX">海拉尔河西</option>
              <option value = "MA">满洲里</option>
              <option value = "MB">满洲里二店</option>
              <option value = "YA">牙克石</option>
              <option value = "YB">牙克石二店</option>
            </Form.Control>
          </Form.Group>
          <Button variant = "success" onClick = {() => this.findUserList(this.state.location_char, 1, 20)}>查看</Button>
          <Pagination style = {{ margin: '20px 0' }}>
            <Pagination.First onClick = {() => this.findUserList(this.state.location_char, 1, 20)}/>
            <Pagination.Prev disabled={this.state.pn === 1} onClick = {() => this.findUserList(this.state.location_char, this.state.pn - 1 > 0 ? this.state.pn - 1 : 1, 20)}/>
            {/* <Pagination.Item>{1}</Pagination.Item> */}
            <Pagination.Item active>{this.state.pn}</Pagination.Item>
            {/* <Pagination.Item>{this.state.totalPn}</Pagination.Item> */}
            <Pagination.Next disabled = {this.state.pn === this.state.totalPn} onClick = {() => this.findUserList(this.state.location_char, this.state.pn + 1 > 0 ? this.state.pn + 1 : 1, 20)}/>
            <Pagination.Last onClick = {() => this.findUserList(this.state.location_char, this.state.totalPn, 20)}/>
          </Pagination>
        </div>
        {this.state.userListData !== '' ? 
          <UserBrowser 
            userListData = {this.state.userListData}
            selectRecordNum = {this.props.selectRecordNum}
            changeAction = {this.props.changeAction}
          />
        : ""}
        <Pagination style = {{ margin: '20px' }}>
          <Pagination.First onClick = {() => this.findUserList(this.state.location_char, 1, 20)}/>
          <Pagination.Prev disabled={this.state.pn === 1} onClick = {() => this.findUserList(this.state.location_char, this.state.pn - 1 > 0 ? this.state.pn - 1 : 1, 20)}/>
          {/* <Pagination.Item>{1}</Pagination.Item> */}
          <Pagination.Item active>{this.state.pn}</Pagination.Item>
          {/* <Pagination.Item>{this.state.totalPn}</Pagination.Item> */}
          <Pagination.Next disabled = {this.state.pn === this.state.totalPn} onClick = {() => this.findUserList(this.state.location_char, this.state.pn + 1 > 0 ? this.state.pn + 1 : 1, 20)}/>
          <Pagination.Last onClick = {() => this.findUserList(this.state.location_char, this.state.totalPn, 20)}/>
        </Pagination>
      </div>
    )
  }
}

export default RecentUser;