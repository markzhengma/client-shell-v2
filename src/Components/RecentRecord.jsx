import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Pagination } from 'react-bootstrap';
import RecordBrowser from './RecordBrowser';

class RecentRecord extends Component {
  constructor(props){
    super(props);
    this.state = {
      location_char: '',
      start: '',
      end: '',
      recordListData: '',
      pn: 1,
      totalPn: 1,
      totalRecordList: ''
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

    this.findRecordListBetweenDates(this.props.admin.location_char, '2020-01-01', date, 1, 20);

    this.setState({
      start: '2020-01-01',
      end: date,
      location_char: this.props.admin.location_char
    });
  };

  findRecordListBetweenDates(location_char, start, end, pn, rn){
    axios.get(`https://api.hailarshell.cn/api/record/all/${location_char}?start=${start}&end=${end}&pn=${pn}&rn=${rn}`)
      .then(res => {
        if(res.data.code !== 200) {
          console.log(res.data);
          alert(res.data.code + '\n' + JSON.stringify(res.data.data));
        } else {
          this.setState({
            recordListData: res.data.data.list,
            pn: pn,
            totalPn: Math.floor(res.data.data.count / 20) || 1,
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
          <h3>浏览保养记录</h3>
          <Form.Group>
            <Form.Label>门店</Form.Label>
            <Form.Control as = "select" name = "location_char" defaultValue = "" onChange = {this.handleChange.bind(this)}>
              <option value = "" disabled>【请选择】</option>
              <option value = "HD">海拉尔河东</option>
              <option value = "HX">海拉尔河西</option>
              <option value = "MA">满洲里</option>
              <option value = "MB">满洲里二店</option>
              <option value = "YA">牙克石</option>
              <option value = "YB">牙克石二店</option>
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
          <Button variant = "success" onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, 1, 20)}>查看</Button>
          <Pagination style = {{ margin: '20px 0' }}>
            <Pagination.First onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, 1, 20)}/>
            <Pagination.Prev disabled={this.state.pn === 1} onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.pn - 1 > 0 ? this.state.pn - 1 : 1, 20)}/>
            {/* <Pagination.Item>{1}</Pagination.Item> */}
            <Pagination.Item active>{this.state.pn}</Pagination.Item>
            {/* <Pagination.Item>{this.state.totalPn}</Pagination.Item> */}
            <Pagination.Next disabled = {this.state.pn === this.state.totalPn} onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.pn + 1 > 0 ? this.state.pn + 1 : 1, 20)}/>
            <Pagination.Last onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.totalPn, 20)}/>
          </Pagination>
        </div>
        {this.state.recordListData !== '' ? 
          <RecordBrowser 
            recordListData = {this.state.recordListData}
            selectRecordNum = {this.props.selectRecordNum}
            changeAction = {this.props.changeAction}
          />
        : ""}
        <Pagination style = {{ margin: '20px' }}>
          <Pagination.First onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, 1, 20)}/>
          <Pagination.Prev disabled={this.state.pn === 1} onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.pn - 1 > 0 ? this.state.pn - 1 : 1, 20)}/>
          {/* <Pagination.Item>{1}</Pagination.Item> */}
          <Pagination.Item active>{this.state.pn}</Pagination.Item>
          {/* <Pagination.Item>{this.state.totalPn}</Pagination.Item> */}
          <Pagination.Next disabled = {this.state.pn === this.state.totalPn} onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.pn + 1 > 0 ? this.state.pn + 1 : 1, 20)}/>
          <Pagination.Last onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.totalPn, 20)}/>
        </Pagination>
      </div>
    )
  }
}

export default RecentRecord;