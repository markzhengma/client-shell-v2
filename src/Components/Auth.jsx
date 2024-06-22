import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

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
    }
  };

  componentDidMount() {
    this.authWithCode();
  }

  timeout(time) {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  async authWithCode() {
    this.setState({
      isFetching: true
    })

    const queryParameters = new URLSearchParams(window.location.search)
    const code = queryParameters.get("code");
    if(code) {
      this.setState({ code });
  
      const res = await axios.get(`http://localhost:7001/api/admin/auth/code?code=${code}`);
      
      this.setState({
        isFetching: false,
      })
  
      try {
        if(res.data.code !== 500) {
          const userInfo = res.data.data;
          this.setState({ 
            userInfo,
            hasInfo: true
          })
  
          if(res.data.code === 200) {
            this.setState({ 
              isAdmin: true,
              waitTime: '3'
            });
            this.props.setAdminWx(userInfo);
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
  
        } else {
          alert(res.data.msg);
          console.log(res.data);
        }
      } catch(err) {
          alert(err);
          console.log(err);
      }
    }

    // axios.get(`http://localhost:7001/api/admin/auth/code?code=${code}`)
    //   .then(res => {
    //     this.setState({
    //       isFetching: false,
    //     })
    //     if(res.data.code !== 500) {
    //       const userInfo = res.data.data;
    //       this.setState({ userInfo })

    //       if(res.data.code === 200) {
    //         this.setState({ isAdmin: true });
    //       }

    //     } else {
    //       alert(res.data.msg);
    //       console.log(res.data);
    //     }
    //   })
    //   .catch(err => {
    //     alert(err);
    //     console.log(err);
    //   })
  }

  openWxLoginQRCode() {
    const redirectUri = encodeURIComponent('http://fat.hulunbuirshell.com');
    const appid = 'wx6d0fa508298a731d';

    window.location.replace(`https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`);
  }

  render() {
    return (
      <div>
        <h1>内部管理系统</h1>
        {/* {this.state.userInfo.admin_name !== "" ?
          <h2>{this.state.userInfo.admin_name}</h2>
        :
          <h2>{this.state.userInfo.nickname}</h2>
        } */}
        {!this.state.hasInfo ? 
          <div>
            <h3>请登录</h3>
            <Button 
              variant="success"
              onClick={ this.openWxLoginQRCode }
            >
              微信登录
            </Button>
          </div>
        :
          ''
        }
        {!this.state.isAdmin ? 
          <h3>非管理员</h3>
        : 
          <h3>{this.state.userInfo.admin_name}，欢迎回来。{this.state.waitTime}秒后跳转至管理页面……</h3>
        }
      </div>
    )
  }
}

export default Auth;