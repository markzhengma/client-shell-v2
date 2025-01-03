import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      admin_name: '',
      admin_pass: ''
    }
    this.logOut = this.logOut.bind(this);
  };

  async logOut() {
    Cookies.set('union_id', '');
    await this.props.setAdminWx('');
    await this.props.handlePageChange('auth');
    // window.location.replace("https://hulunbuirshell.com");
  }

  render() {
    return (
      <Navbar sticky = "top" className = "header">
        <div className = "logo"></div>
        <h1>壳牌润滑油</h1>
        { this.props.adminwx !== "" ?
          <div className = "header-admin-box">
            <b>{this.props.adminwx.admin_name}</b>
            <Button 
              variant="outline-light"
              size="sm"
              onClick={ this.logOut }
            >
              退出
            </Button>
          </div>
        :
          ''
        }
      </Navbar>
    )
  }
}

export default Header;