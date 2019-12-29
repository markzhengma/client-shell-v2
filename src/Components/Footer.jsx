import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

class Footer extends Component {
  constructor(props){
    super(props);
    this.state = {
      admin_name: '',
      admin_pass: ''
    }
  };

  render() {
    return (
      <Navbar sticky = "bottom" className = "footer">
        <div className = "footer-info">
          <h5>呼伦贝尔市佳润物资有限公司</h5>
          <p>0470-8223779</p>
        </div>
        <div className = "footer-legal">
          <a href = "http://beian.miit.gov.cn" target="_blank">蒙ICP备19005903号-1</a>
        </div>
      </Navbar>
    )
  }
}

export default Footer;