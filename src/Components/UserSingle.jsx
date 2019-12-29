import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

class UserSingle extends Component {
  constructor(props){
    super(props);
    this.state = {
      filter: 'record_num',
      value: '',
      data: {}
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

  render() {
    return (
          <Card.Body>
            <Card.Title>
              <small>车主姓名：</small>{this.props.userData.user_name || ''}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              换油证号：{this.props.userData.record_num || ''}
            </Card.Subtitle>
            <Card.Text>
              联系方式：{this.props.userData.phone || ''}
              <br/>
              车牌号：{this.props.userData.plate || ''}
              <br/>
              车型：{this.props.userData.make || ''}
              <br/>
              备注：{this.props.userData.detail || ''}
            </Card.Text>
          </Card.Body>
    )
  }
}

export default UserSingle;