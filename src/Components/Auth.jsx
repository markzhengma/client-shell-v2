import React, { Component } from 'react';
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';

class Auth extends Component {
  constructor(props){
    super(props);
    this.state = {
      userInfo: '',
      hasInfo: false,
      isAdmin: false,
      code: '',
      isFetching: false,
      waitTime: '3'
    };

    this.resetAuthStatus = this.resetAuthStatus.bind(this);
    this.openWxLoginQRCode = this.openWxLoginQRCode.bind(this);
    this.authAndChangePage = this.authAndChangePage.bind(this);
  };

  componentDidMount() {
    if(!Cookies.get('union_id') || Cookies.get('union_id') === '') {
      this.authWithCode();
    } else {
      this.authWithUnionId();
    }
  }

  timeout(time) {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  resetAuthStatus(){
    this.setState({
      userInfo: '',
      hasInfo: false,
      isAdmin: false,
      code: ''
    })
    Cookies.set('union_id', '');
  }

  async authAndChangePage(data) {
    this.setState({ 
      isAdmin: true,
      waitTime: '3'
    });
    this.props.setAdminWx(data);
    await this.timeout(1000);
    this.setState({
      waitTime: '2'
    });
    await this.timeout(1000);
    this.setState({
      waitTime: '1'
    });
    await this.timeout(1000);
    this.setState({
      waitTime: '0'
    });
    await this.timeout(1000);
    this.props.handlePageChange('admin');
  }

  async authWithUnionId() {
    let unionId = Cookies.get('union_id');
    this.setState({
      isFetching: true
    })

    const res = await axios.get(`http://127.0.0.1:7001/api/admin/auth/unionid?unionid=${unionId}`);

    this.setState({
      isFetching: false
    });

    console.log(res);

    try{
      if(res.data) {
        const userInfo = {
          admin_name: res.data.data.admin_name,
          location: res.data.data.location,
          location_char: res.data.data.location_char,
          super_admin: res.data.data.super_admin
        };
        this.setState({
          userInfo,
          hasInfo: true
        })
        if(res.data.code === 200) {
          this.authAndChangePage(userInfo);
        }
      } else {
        alert('login failed');
        console.log(res.data);
      }
    } catch(err) {
        alert(err);
        console.log(err);
    }

    return;
  }

  async authWithCode() {
    this.setState({
      isFetching: true
    })

    const queryParameters = new URLSearchParams(window.location.search)
    const code = queryParameters.get("code");
    if(code) {
      this.setState({ code });
  
      const res = await axios.get(`http://127.0.0.1:7001/api/admin/auth/code?code=${code}`);
      
      this.setState({
        isFetching: false,
      })
  
      try {
        if(res.data.code !== 500) {
          const userInfo = {
            admin_name: res.data.data.admin_name,
            location: res.data.data.location,
            location_char: res.data.data.location_char,
            super_admin: res.data.data.super_admin
          };
          this.setState({ 
            userInfo,
            hasInfo: true
          })
          Cookies.set("union_id", res.data.data.union_id, {
            expires: 1,
            overwrite: true
          });

          if(res.data.code === 200) {
            this.authAndChangePage(userInfo);
          }
  
        } else {
          alert(res.data.msg);
          console.log(res.data);
        }
      } catch(err) {
          alert(err);
          console.log(err);
      }
    }
  }

  openWxLoginQRCode() {
    const redirectUri = encodeURIComponent('http://fat.hulunbuirshell.com');
    const appid = 'wx6d0fa508298a731d';

    this.resetAuthStatus();

    window.location.replace(`https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`);
  }

  render() {
    return (
      <div className='auth auth-box'>
        <h3>门店及客户管理系统</h3>
        {/* {this.state.userInfo.admin_name !== "" ?
          <h2>{this.state.userInfo.admin_name}</h2>
        :
          <h2>{this.state.userInfo.nickname}</h2>
        } */}
        {!this.state.hasInfo ? 
          <div className='wxlogin-box flex-column-center'>
            <b>请登录</b>
            <Button 
              variant="success"
              onClick={ this.openWxLoginQRCode }
            >
              微信登录
            </Button>
          </div>
        :
        !this.state.isAdmin ? 
          <div className='wxlogin-box flex-column-center'>
            <b>无管理员权限</b>
            <Button 
              variant="danger"
              onClick={ this.openWxLoginQRCode }
            >
              其他账号登录
            </Button>
          </div>
        : 
          <div className='wxlogin-box' >
            <Spinner animation="border" role="status" size="sm"/>
            <b>{this.state.userInfo.admin_name}，欢迎回来。{this.state.waitTime}秒后跳转至管理页面……</b>
          </div>
        }
      </div>
    )
  }
}

export default Auth;