import React, { Component } from 'react';
import { Form, Button, ButtonGroup } from 'react-bootstrap';

class UserUpdate extends Component {
  constructor(){
    super();
    this.state = {
      filter: 'record_num',
      value: ''
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

  render() {
    return (
      <Form 
        onSubmit = {(e) => this.props.confirmUserUpdate(e)}
        className='text-secondary'
        style={{padding: "10px"}}
      >
        <Form.Group style = {{padding: "10px 10px 0 10px"}}>
          <Form.Label style={{marginBottom: "0"}}>客户姓名</Form.Label>
          <Form.Control 
            name = "user_name" 
            defaultValue = {this.props.userData.user_name} 
            onChange = {this.props.handleUserUpdateChange.bind(this)} 
            style={{marginBottom: "9px"}}
          />
          <Form.Label style={{marginBottom: "0"}}>换油证号</Form.Label>
          <Form.Control 
            value = {this.props.userData.record_num} 
            disabled
            style={{marginBottom: "9px"}}
          />
          <Form.Label style={{marginBottom: "0"}}>联系方式</Form.Label>
          <Form.Control 
            name = "phone" 
            defaultValue = {this.props.userData.phone} 
            onChange = {this.props.handleUserUpdateChange.bind(this)}
            style={{marginBottom: "9px"}}
          />
          <Form.Label style={{marginBottom: "0"}}>车牌号</Form.Label>
          <Form.Control 
            name = "plate" 
            defaultValue = {this.props.userData.plate} 
            onChange = {this.props.handleUserUpdateChange.bind(this)}
            style={{marginBottom: "9px"}}
          />
          <Form.Label style={{marginBottom: "0"}}>车型</Form.Label>
          <Form.Control 
            name = "make" 
            defaultValue = {this.props.userData.make} 
            onChange = {this.props.handleUserUpdateChange.bind(this)}
            style={{marginBottom: "9px"}}
          />
          <Form.Label style={{marginBottom: "0"}}>备注</Form.Label>
          <Form.Control 
            as="textarea" 
            rows="2" 
            name = "detail" 
            defaultValue = {this.props.userData.detail} 
            onChange = {this.props.handleUserUpdateChange.bind(this)}
            style={{marginBottom: "9px"}}
          />
        </Form.Group>
        <Button 
          block 
          variant="success" 
          type = "submit"
          style={{
            width: "100%"
          }}
        >
          保存
        </Button>
        <Button 
          block 
          variant="warning" 
          onClick = {this.props.cancelUserUpdate}
          style={{
            width: "100%"
          }}
        >
          取消
        </Button>
      </Form>
    )
  }
}

export default UserUpdate;