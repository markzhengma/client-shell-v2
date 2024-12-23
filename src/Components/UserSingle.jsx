import React, { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

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
        <Row>
          <Col sm={6} md={12} lg={12} style={{minWidth: "140px", marginBottom: "2px"}}>
            <Card.Text className="mb-2 text-secondary">
              客户姓名
            </Card.Text>
            <Card.Title>
              {this.props.userData.user_name || ''}
            </Card.Title>
          </Col>
          <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
            <Card.Text className="mb-2 text-secondary">
              换油证号
            </Card.Text>
            <Card.Text>
              {this.props.userData.record_num || ''}
            </Card.Text>
          </Col>
          <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
            <Card.Text className="mb-2 text-secondary">
              联系方式
            </Card.Text>
            <Card.Text>
              {this.props.userData.phone || ''}
            </Card.Text>
          </Col>
          <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
            <Card.Text className="mb-2 text-secondary">
              车牌号
            </Card.Text>
            <Card.Text>
              {this.props.userData.plate || ''}
            </Card.Text>
          </Col>
          <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
            <Card.Text className="mb-2 text-secondary">
              车型
            </Card.Text>
            <Card.Text>
              {this.props.userData.make || ''}
            </Card.Text>
          </Col>
          <Col sm={6} md={3} lg={3} style={{minWidth: "140px", marginBottom: "15px"}}>
            <Card.Text className="mb-2 text-secondary">
              备注
            </Card.Text>
          <Card.Text>
            {this.props.userData.detail || ''}
          </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    )
  }
}

export default UserSingle;