import React, { Component } from 'react';
import axios from 'axios';

import UserSingle from './UserSingle';

class CreateUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: ''
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

  // handleFindUserSubmit(e) {
  //   e.preventDefault();
  //   axios.get(`http://localhost:7001/api/user/single?filter=${this.state.filter}&value=${this.state.value}`)
  //       .then(res => {
  //         if(res.data.code !== 200){
  //           alert(res.data)
  //         } else {
  //           this.setState({
  //             data: res.data.data
  //           });
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       })
  // }

  render() {
    return (
      <div>
        CREATE USER
        {this.state.data !== '' ? 
          <UserSingle data = {this.state.data}/>
        : ""}
      </div>
    )
  }
}

export default CreateUser;