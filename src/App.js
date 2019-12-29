import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Components/Header';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Admin from './Components/Admin';

class App extends Component {
  constructor(){
    super();
    this.state = {
      admin: {},
      page: 'admin'
    }
  }

  setAdmin(data){
    this.setState({
      admin: data
    })
  };

  handlePageChange(page){
    this.setState({
      page: page
    })
  }

  componentDidMount(){
    // let tcb = require('tcb-js-sdk');
    // tcb.init({
    //   env: 'hailar-shell-zb8lp'
    // });
    // let auth = tcb.auth();
    // auth.weixinAuthProvider({
    //   appid: 'wx1e21359edb78fd06',  //微信应用appid
    //   scope: 'snsapi_login'     //网页授权类型
    // })
    //   .signIn()
    //   .then(res => {
    //     // 登录成功
    //     console.log(res)
        // let db = tcb.database();
        // console.log(tcb)
      // })
      // .catch(err => {
      //   // 登录失败
      //   console.log(err)
      // })
      console.log('client initiated')
  }

  render() {
    return (
      <div className = "app">
        <Header/>
        {this.state.page === 'login' ? 
          <Login
            setAdmin = {this.setAdmin.bind(this)}
            handlePageChange = {this.handlePageChange.bind(this)}
          />
        : ''}
        {this.state.page === 'admin' ? 
          <Admin
            handlePageChange = {this.handlePageChange.bind(this)}
          />
        : ''}
        <Footer/>
      </div>
    )
  }
}

export default App;