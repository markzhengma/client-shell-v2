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
          <div style={{ width:'300px', margin:'0 auto', padding:'20px 0'}}>
            <a target="_blank" href="http://beian.miit.gov.cn" style={{display:'inline-block',textDecoration: 'none', height:'20px', lineHeight:'20px'}}><img src="" style={{float:'left'}}/><p style={{float:'left',height:'20px',lineHeight:'20px',margin: '0px 0px 0px 5px', color:'#939393'}}>蒙ICP备19005903号-1</p></a>
          </div>
          {/* <a href = "http://beian.miit.gov.cn" target="_blank">蒙ICP备19005903号-1</a> */}
          <div style={{ width:'300px', margin:'0 auto', padding:'20px 0'}}>
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=15070202000139" style={{display:'inline-block',textDecoration: 'none', height:'20px', lineHeight:'20px'}}><img src="" style={{float:'left'}}/><p style={{float:'left',height:'20px',lineHeight:'20px',margin: '0px 0px 0px 5px', color:'#939393'}}>蒙公网安备 15070202000139号</p></a>
          </div>
		 
        </div>
      </Navbar>
    )
  }
}

export default Footer;