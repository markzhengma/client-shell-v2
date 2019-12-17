import React, { Component } from 'react';
import axios from 'axios';

class RecordList extends Component {
  constructor(props){
    super(props);
    this.state = {
      newRecord: {
        date: '',
        product_name: '',
        milage: '',
        gift: '',
        operator: '',
        detail: ''
      }
    }
  };

  resetInput(){
    this.setState({
      newRecord: {
        date: '',
        product_name: '',
        milage: '',
        gift: '',
        operator: '',
        detail: ''
      }
    })
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      newRecord: {
        ...this.state.newRecord,
        [name]: value
      }
    })
  };

  handleNewRecordSubmit(e){
    e.preventDefault();
    const record_num = this.props.record_num;
    axios({
      url: `http://123.207.165.116:7001/api/record/user/${record_num}`,
      method: 'POST',
      data: {
        date: this.state.newRecord.date,
        gift: this.state.newRecord.gift,
        milage: this.state.newRecord.milage,
        operator: this.state.newRecord.operator,
        product_name: this.state.newRecord.product_name,
        detail: this.state.newRecord.detail
      }
    })
      .then(res => {
        if(res.data.code !== 200){
          alert(res.data.code + '\n' + JSON.stringify(res.data.data));
          console.log(res.data.data);
        } else {
          console.log(res)
          this.resetInput();
          this.props.handleFindUserSubmit(e)
        }
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  }

  handleDeleteRecord(e, id){
    axios.delete(`http://123.207.165.116:7001/api/record/single/${id}`)
      .then(res => {
        if(res.data.code !== 200){
          alert(res.data.code + '\n' + JSON.stringify(res.data.data));
          console.log(res.data.data);
        } else {
          console.log(res)
          this.props.handleFindUserSubmit(e)
        }
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  }

  render() {
    const data = this.props.recordListData;
    return (
      <div>
        <div className = "record-single">
          <div className = "record-column">日期</div>
          <div className = "record-column">项目名称</div>
          <div className = "record-column">表示里程</div>
          <div className = "record-column">赠品情况</div>
          <div className = "record-column">操作人</div>
          <div className = "record-column">备注</div>
          <div className = "record-column">操作</div>
          {/* <div className = "record-column">换油证号</div> */}
        </div>
        <form onSubmit = {this.handleNewRecordSubmit.bind(this)}>
          <div className = "record-single">
            <div className = "record-column">
              <input name = "date" onChange = {this.handleChange.bind(this)} placeholder = "日期"></input>
            </div>
            <div className = "record-column">
              <input name = "product_name" onChange = {this.handleChange.bind(this)} placeholder = "项目名称"></input>
            </div>
            <div className = "record-column">
              <input name = "milage" onChange = {this.handleChange.bind(this)} placeholder = "表示里程"></input>
            </div>
            <div className = "record-column">
              <input name = "gift" onChange = {this.handleChange.bind(this)} placeholder = "赠品情况"></input>
            </div>
            <div className = "record-column">
              <input name = "operator" onChange = {this.handleChange.bind(this)} placeholder = "操作人"></input>
            </div>
            <div className = "record-column">
              <input name = "detail" onChange = {this.handleChange.bind(this)} placeholder = "备注"></input>
            </div>
            <div className = "record-column">
              <button type = "submit">保存</button>
            </div>
          </div>
        </form>
        {data.map(record => {
          return (
            <div className = "record-single" key = {record._id} id = {record._id}>
              <div className = "record-column">{record.date}</div>
              <div className = "record-column">{record.product_name}</div>
              <div className = "record-column">{record.milage}</div>
              <div className = "record-column">{record.gift}</div>
              <div className = "record-column">{record.operator}</div>
              <div className = "record-column">{record.detail}</div>
              <div className = "record-column">
                <button>编辑</button>
                <button onClick = {(e) => this.handleDeleteRecord(e, record._id)}>删除</button>
              </div>
              {/* <div className = "record-column">{record.record_num}</div> */}
            </div>
          )
        })}
      </div>
    )
  }
}

export default RecordList;