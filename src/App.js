import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';

import Header from './Components/Header';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Auth from './Components/Auth';
import Admin from './Components/Admin';

class App extends Component {
  constructor(){
    super();
    this.state = {
      admin: '',
      adminwx: '',
      page: 'auth',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      isAlertSuccess: false
    }
  }

  setAdmin(data){
    this.setState({
      admin: data
    })
  };

  setAdminWx(data) {
    this.setState({
      adminwx: data
    })
  }

  handlePageChange(page){
    this.setState({
      page: page
    })
  }

  showAlert(title, msg, isSuccess) {
    this.setState({
      showAlert: true,
      alertTitle: title,
      alertMsg: msg,
      isAlertSuccess: isSuccess
    })
  };

  closeAlert() {
    this.setState({
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      isAlertSuccess: false
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
      // console.log('client initiated')
  }

  render() {
    return (
      <div className = "app">
        <Header
          adminwx = {this.state.adminwx}
          setAdminWx = {this.setAdminWx.bind(this)}
          handlePageChange = {this.handlePageChange.bind(this)}
        />
        {this.state.page === 'auth' ? 
          <Auth
            showAlert = {this.showAlert.bind(this)}
            setAdminWx = {this.setAdminWx.bind(this)}
            handlePageChange = {this.handlePageChange.bind(this)}
          />
        : ''}
        {this.state.page === 'login' ? 
          <Login
            setAdmin = {this.setAdmin.bind(this)}
            handlePageChange = {this.handlePageChange.bind(this)}
          />
        : ''}
        {this.state.page === 'admin' ? 
          <Admin
            showAlert = {this.showAlert.bind(this)}
            handlePageChange = {this.handlePageChange.bind(this)}
            admin = {this.state.admin}
            adminwx = {this.state.adminwx}
          />
        : ''}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.showAlert}
          onHide={() => this.closeAlert()}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.alertTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.alertMsg}
          </Modal.Body>
          <Modal.Footer>
            <Button variant={this.state.isAlertSuccess ? "success" : "danger"} onClick={() => this.closeAlert()}>
              {this.state.isAlertSuccess ? "确认" : "关闭"}
            </Button>
          </Modal.Footer>
        </Modal>
        <Footer/>
      </div>
    )
  }
}

export default App;