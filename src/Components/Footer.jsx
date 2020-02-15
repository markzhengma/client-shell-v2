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
      <Navbar sticky = "bottom" className = "footer" style = {{ display: 'flex', flexDirection: 'column', padding: '40px' }}>
        <div className = "footer-info">
          <h5>呼伦贝尔市佳润物资有限公司 | 0470-8223779</h5>
        </div>
        <div className = "footer-info">
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=15070202000140" style={{display:'inline-block',textDecoration: 'none', height:'20px', lineHeight:'20px'}}>
              <img src={require('../Images/beian_2.png')} style={{float:'left'}}/>
              <p style={{float:'left',height:'20px',lineHeight:'20px',margin: '0px 0px 0px 5px', color:'#939393'}}>
                蒙公网安备 15070202000140号
              </p>
            </a>
            <a target="_blank" href="http://beian.miit.gov.cn" style={{display:'inline-block',textDecoration: 'none', height:'20px', lineHeight:'20px'}}>
              <img src="" style={{float:'left'}}/>
              <p style={{float:'left',height:'20px',lineHeight:'20px',margin: '0px 0px 0px 5px', color:'#939393'}}>
                蒙ICP备19005903号-2
              </p>
            </a>
        </div>
      </Navbar>
    )
  }
}

export default Footer;