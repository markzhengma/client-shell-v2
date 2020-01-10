import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import RecordBrowser from './RecordBrowser';

class RecentRecord extends Component {
  constructor(props){
    super(props);
    this.state = {
      location_char: '',
      start: '',
      end: '',
      recordListData: ''
    }
  };

  componentDidMount(){
    let currDate = new Date(),
        currMonth = '' + (currDate.getMonth() + 1),
        currDay = '' + currDate.getDate(),
        currYear = currDate.getFullYear();

    if (currMonth.length < 2) 
        currMonth = '0' + currMonth;
    if (currDay.length < 2) 
        currDay = '0' + currDay;
    
    const date = [currYear, currMonth, currDay].join('-');

    this.findRecordListBetweenDates(this.props.admin.location_char, '2020-01-01', date);

    this.setState({
      start: '2020-01-01',
      end: date,
      location_char: this.props.admin.location_char
    });
  };

  findRecordListBetweenDates(location_char, start, end){
    axios.get(`https://api.hailarshell.cn/api/record/period/${location_char}?start=${start}&end=${end}`)
      .then(res => {
        if(res.data.code !== 200) {
          console.log(res.data);
          alert(res.data.code + '\n' + JSON.stringify(res.data.data));
        } else {
          this.setState({
            recordListData: res.data.data
          })
        }
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  };

  render() {
    return (
      <div>
        <div className = "record-search-box">
          <h5>浏览保养记录</h5>
          <Form.Group>
            <Form.Label>门店</Form.Label>
            <Form.Control as = "select" name = "location_char" defaultValue = "" onChange = {this.handleChange.bind(this)}>
              <option value = "" disabled>【请选择】</option>
              <option value = "HD">海拉尔河东</option>
              <option value = "H">海拉尔河西</option>
              <option value = "M">满洲里</option>
              <option value = "Y">牙克石</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>开始时间</Form.Label>
            <Form.Control type = "date" value = {this.state.start} name = "start" onChange = {this.handleChange.bind(this)}>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>结束时间</Form.Label>
            <Form.Control type = "date" value = {this.state.end} name = "end" onChange = {this.handleChange.bind(this)}>
            </Form.Control>
          </Form.Group>
          <Button variant = "success" onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end)}>查看</Button>
        </div>
        {this.state.recordListData !== '' ? 
          <RecordBrowser 
            recordListData = {this.state.recordListData}
            selectRecordNum = {this.props.selectRecordNum}
            changeAction = {this.props.changeAction}
          />
        : ""}
      </div>
    )
  }
}

export default RecentRecord;