import React, { Component } from 'react';
import './App.css';

import Login from './Components/Login';
import Admin from './Components/Admin';

class App extends Component {
  constructor(){
    super();
    this.state = {
      admin: {},
      page: 'login'
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

  render() {
    return (
      <div>
        <h1>
          Shell
        </h1>
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
      </div>
    )
  }
}

export default App;