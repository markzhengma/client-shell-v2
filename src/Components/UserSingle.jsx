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
            <Card.Header>
              <Card.Title className = "text-warning">
                {this.props.userData.user_name || ''}
              </Card.Title>
            </Card.Header>
            <Card.Text className="mb-2 text-warning">
              换油证号
            </Card.Text>
            <Card.Text>
              {this.props.userData.record_num || ''}
            </Card.Text>
            <Card.Text className="mb-2 text-warning">
              联系方式
            </Card.Text>
            <Card.Text>
              {this.props.userData.phone || ''}
            </Card.Text>
            <Card.Text className="mb-2 text-warning">
              车牌号
            </Card.Text>
            <Card.Text>
              {this.props.userData.plate || ''}
            </Card.Text>
            <Card.Text className="mb-2 text-warning">
              车型
            </Card.Text>
            <Card.Text>
              {this.props.userData.make || ''}
            </Card.Text>
            <Card.Text className="mb-2 text-warning">
              备注
            </Card.Text>
            <Card.Text>
              {this.props.userData.detail || ''}
            </Card.Text>
          </Card.Body>
    )
  }
}

export default UserSingle;