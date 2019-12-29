import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      admin_name: '',
      admin_pass: ''
    }
  };

  render() {
    return (
      <Navbar sticky = "top" className = "header">
        <h1>壳牌润滑油</h1>
      </Navbar>
    )
  }
}

export default Header;