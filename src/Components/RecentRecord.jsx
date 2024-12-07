import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Pagination, Row, Spinner, Col } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
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
      isFetching: false,
      totalData: '',
      isFetchingTotal: false
    }
  };

  componentDidMount(){
    let formatDate = (date) => {
      let paramsDate = new Date(date),
      month = '' + (paramsDate.getMonth() + 1),
      day = '' + paramsDate.getDate(),
      year = paramsDate.getFullYear();
      
      if (month.length < 2) 
      month = '0' + month;
      if (day.length < 2) 
      day = '0' + day;
      
      return [year, month, day].join('-');
    }
    
    let defaultDate = new Date();
    const currDate = formatDate(defaultDate);
    const startDate = formatDate(new Date(defaultDate.setDate(defaultDate.getDate() - 13)))

    this.findRecordListBetweenDates(this.props.adminwx.location_char, startDate, currDate, 1, 20);
    // this.findRecordListBetweenDates(this.props.admin.location_char, startDate, currDate, 1, 20);

    this.setState({
      start: startDate,
      end: currDate,
      location_char: this.props.adminwx.location_char
      // location_char: this.props.admin.location_char
    });
  };

  findRecordListBetweenDates(location_char, start, end, pn, rn){
    this.setState({
      isFetching: true
    })
    axios.get(`https://api.hulunbuirshell.com/api/record/all/${location_char}?start=${start}&end=${end}&pn=${pn}&rn=${rn}`)
      .then(res => {
        this.setState({
          isFetching: false
        })
        if(res.data.code !== 200) {
          console.log(res.data);
          this.props.showAlert('出错了', res.data.code + '\n' + JSON.stringify(res.data.data), false);
        } else {
          this.setState({
            recordListData: res.data.data.list,
            pn: pn,
            totalPn: Math.floor(res.data.data.count / 20) || 1,
          })
        }
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false);
        console.log(err);
      })
  };

  getTotalData() {
    this.setState({
      isFetchingTotal: true
    });
    axios.get(`https://api.hulunbuirshell.com/api/record/all/${this.state.location_char}?start=${this.state.start}&end=${this.state.end}`)
      .then(res => {
        this.setState({
          isFetchingTotal: false
        })
        if(res.data.code !== 200) {
          console.log(res.data);
          this.props.showAlert('出错了', res.data.code + '\n' + JSON.stringify(res.data.data), false);
        } else {
          this.setState({
            totalData: res.data.data.list
          })
        }
      })
      .catch(err => {
        this.props.showAlert('出错了', err, false);
        console.log(err);
      })
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if(name === "location_char" || "start" || "end"){
      this.setState({
        totalData: ''
      })
    };
    this.setState({
      [name]: value
    })
  };

  render() {
    const headers = [
      {label: 'date', key: 'date'},
      {label: 'product_name', key: 'product_name'},
      {label: 'milage', key: 'milage'},
      {label: 'gift', key: 'gift'},
      {label: 'operator', key: 'operator'},
      {label: 'detail', key: 'detail'},
      {label: 'reminder', key: 'reminder'},
      {label: 'record_num', key: 'record_num'},
    ];
    return (
      <div>
        <div style={{ padding: "20px"}}>
          <h3>浏览保养记录</h3>
          <Row>
            <Col xs="auto">
              <Form.Group as={Row}>
                <Form.Label column>门店</Form.Label>
                <Col xs="auto">
                  <Form.Control as = "select" name = "location_char" defaultValue = "" onChange = {this.handleChange.bind(this)}>
                    <option value = "" disabled>【请选择】</option>
                    <option value = "HD">海拉尔河东</option>
                    <option value = "HX">海拉尔河西</option>
                    <option value = "MA">满洲里</option>
                    <option value = "MB">满洲里二店</option>
                    <option value = "YA">牙克石</option>
                    <option value = "YB">牙克石二店</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Col>
            <Col xs="auto">
              <Form.Group as={Row}>
                <Form.Label column>开始时间</Form.Label>
                <Col xs="auto">
                  <Form.Control type = "date" value = {this.state.start} name = "start" onChange = {this.handleChange.bind(this)}>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Col>
            <Col xs="auto">
              <Form.Group as={Row}>
                <Form.Label column>结束时间</Form.Label>
                <Col xs="auto">
                  <Form.Control type = "date" value = {this.state.end} name = "end" onChange = {this.handleChange.bind(this)}>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Col>
            <Col xs="auto">
              {/* <div className="search-btn-group"> */}
                <Button variant = "success" onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, 1, 20)}>
                  {this.state.isFetching ? 
                    <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                  : ''}
                  查看选中门店记录
                </Button>
              {/* </div> */}
            </Col>
            <Col xs="auto">
              {this.props.adminwx.super_admin ? 
                this.state.totalData === '' ?
                  <Button variant = "primary" disabled = {this.state.isFetchingTotal} onClick = {() => this.getTotalData()}>
                    {this.state.isFetchingTotal ? 
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    : ''}
                    获取选中门店全部
                  </Button>
                :
                  <CSVLink data = {this.state.totalData} headers = {headers} style = {{ textDecoration: 'none' }}><Button variant = "success" style = {{ margin: '10px', display: 'block' }}>下载选中门店全部</Button></CSVLink>
              : ''}
            </Col>
          </Row>
          
          <Pagination style = {{ margin: '20px 0' }}>
            <Pagination.First onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, 1, 20)}/>
            <Pagination.Prev disabled={this.state.pn === 1} onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.pn - 1 > 0 ? this.state.pn - 1 : 1, 20)}/>
            <Pagination.Item active>{this.state.pn}</Pagination.Item>
            <Pagination.Next disabled = {this.state.pn === this.state.totalPn} onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.pn + 1 > 0 ? this.state.pn + 1 : 1, 20)}/>
            <Pagination.Last onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.totalPn, 20)}/>
          </Pagination>
        </div>
        {this.state.recordListData !== '' ? 
          <RecordBrowser 
            recordListData = {this.state.recordListData}
            selectFindUserValue = {this.props.selectFindUserValue}
            changeAction = {this.props.changeAction}
          />
        : ""}
        <Pagination style = {{ margin: '20px' }}>
          <Pagination.First onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, 1, 20)}/>
          <Pagination.Prev disabled={this.state.pn === 1} onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.pn - 1 > 0 ? this.state.pn - 1 : 1, 20)}/>
          <Pagination.Item active>{this.state.pn}</Pagination.Item>
          <Pagination.Next disabled = {this.state.pn === this.state.totalPn} onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.pn + 1 > 0 ? this.state.pn + 1 : 1, 20)}/>
          <Pagination.Last onClick = {() => this.findRecordListBetweenDates(this.state.location_char, this.state.start, this.state.end, this.state.totalPn, 20)}/>
        </Pagination>
      </div>
    )
  }
}

export default RecentRecord;