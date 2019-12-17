import React, { Component } from 'react';
import axios from 'axios';

import UserSingle from './UserSingle';
import UserUpdate from './UserUpdate';
import RecordList from './RecordList';

class FindUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      filter: 'record_num',
      value: '',
      userData: '',
      recordListData: [],
      isUserUpdating: ''
    }
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  };

  resetStates(){
    this.setState({
      filter: 'record_num',
      value: '',
      userData: '',
      recordListData: '',
    })
  };

  changeUserUpdate() {
    this.setState({
      isUserUpdating: !this.state.isUserUpdating
    })
  };

  confirmUserUpdate(e, data) {
    e.preventDefault();
    axios({
      url: `http://123.207.165.116:7001/api/user/single/${this.state.userData.record_num}`,
      method: 'PUT',
      data: {
        make: data.make,
        phone: data.phone,
        plate: data.plate,
        user_name: data.user_name,
        detail: data.detail,
      }
    })
      .then(res => {
        if(res.data.code === 200){
          this.changeUserUpdate();
          this.handleFindUserSubmit(e);
        }
      })
      .catch(err => {
        console.log(err)
      })
  };

  confirmUserDelete() {
    let confirm = window.confirm(`确定删除用户${this.state.userData.user_name}？`);
    if(confirm){
      axios.delete(`http://123.207.165.116:7001/api/user/single/${this.state.userData.record_num}`)
        .then(res => {
          if(res.data.code !== 200){
            alert(res.data.code + '\n' + JSON.stringify(res.data.data))
          } else {
            this.resetStates();
          }
        })
        .catch(err => {
          alert(err);
          console.log(err)
        })
    }
  }

  handleFindUserSubmit(e) {
    e.preventDefault();
    axios.get(`http://123.207.165.116:7001/api/user/single?filter=${this.state.filter}&value=${this.state.value}`)
        .then(user => {
          if(user.data.code !== 200){
            alert(user.data.code + '\n' + JSON.stringify(user.data.data))
          } else {
            this.setState({
              userData: user.data.data
            });
            const record_num = user.data.data.record_num;
            axios.get(`http://123.207.165.116:7001/api/record/user/${record_num}`)
              .then(records => {
                if(records.data.code !== 200){
                  alert(records.data);
                  console.log(records.data)
                } else {
                  this.setState({
                    recordListData: records.data.data
                  })
                }
              })
              .catch(err => {
                alert(err);
                console.log(err);
              })
          }
        })
        .catch(err => {
          console.log(err);
        })
  }

  render() {
    return (
      <div>
        <form onSubmit = {this.handleFindUserSubmit.bind(this)}>
          <select name = "filter" value = {this.state.filter} onChange = {this.handleChange.bind(this)}>
            <option value = "record_num">按换油证号查找</option>
            <option value = "phone">按手机号查找</option>
            <option value = "plate">按车牌号查找</option>
          </select>
          <input type = "text" name = "value" value = {this.state.value} onChange = {this.handleChange.bind(this)} placeholder = "内容"></input>
          <button type = "submit">查找</button>
        </form>
        {this.state.userData !== '' ? this.state.isUserUpdating ? 
          <UserUpdate 
            userData = {this.state.userData} 
            // changeUserUpdate = {this.changeUserUpdate.bind(this)}
            confirmUserUpdate = {this.confirmUserUpdate.bind(this)}
          />
        :
          <div>
            <UserSingle userData = {this.state.userData}/>
            <button onClick = {this.changeUserUpdate.bind(this)}>编辑客户信息</button>
            <button onClick = {this.confirmUserDelete.bind(this)}>删除客户信息</button>
            <RecordList 
              recordListData = {this.state.recordListData}
              record_num = {this.state.userData.record_num}
              handleFindUserSubmit = {this.handleFindUserSubmit.bind(this)}
            />
          </div>
        : ""}
        {/* {this.state.recordListData.length > 0 ? 
        : ""} */}
      </div>
    )
  }
}

export default FindUser;