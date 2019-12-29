import React, { Component } from 'react';
import { Form, Card, Button } from 'react-bootstrap';

class UserUpdate extends Component {
  constructor(){
    super();
    this.state = {
      filter: 'record_num',
      value: '',
      user_input: {
        user_name: '',
        phone: '',
        plate: '',
        make: '',
        detail: '',
      }
    };
  };

  componentWillMount(){
    this.setState({
      user_input: {
        user_name: this.props.userData.user_name,
        phone: this.props.userData.phone,
        plate: this.props.userData.plate,
        make: this.props.userData.make,
        detail: this.props.userData.detail,
      }
    })
  }

  handleUserUpdateChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      user_input: {
        ...this.state.user_input,
        [name]: value
      }
    })
  };

  render() {
    return (
      <Form onSubmit = {(e) => this.props.confirmUserUpdate(e, this.state.user_input)}>
        <Form.Group>
        <Form.Label>车主姓名</Form.Label>
          <Form.Control name = "user_name" defaultValue = {this.props.userData.user_name} onChange = {this.handleUserUpdateChange.bind(this)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>换油证号</Form.Label>
          <Form.Control value = {this.props.userData.record_num} disabled></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>联系方式</Form.Label>
          <Form.Control name = "phone" defaultValue = {this.props.userData.phone} onChange = {this.handleUserUpdateChange.bind(this)}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>车牌号</Form.Label>
          <Form.Control name = "plate" defaultValue = {this.props.userData.plate} onChange = {this.handleUserUpdateChange.bind(this)}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>车型</Form.Label>
          <Form.Control name = "make" defaultValue = {this.props.userData.make} onChange = {this.handleUserUpdateChange.bind(this)}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>备注</Form.Label>
          <Form.Control as="textarea" rows="3" name = "detail" defaultValue = {this.props.userData.detail} onChange = {this.handleUserUpdateChange.bind(this)}></Form.Control>
        </Form.Group>
        <Button variant="success" type = "submit">保存</Button>
      </Form>
    )
  }
}

export default UserUpdate;