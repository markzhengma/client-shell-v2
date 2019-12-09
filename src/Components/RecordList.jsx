import React, { Component } from 'react';
import axios from 'axios';

class RecordList extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {}
    }
  };

  // handleChange(e) {
  //   const target = e.target;
  //   const value = target.type === 'checkbox' ? target.checked : target.value;
  //   const name = target.name;
  //   this.setState({
  //     [name]: value
  //   })
  // };

  render() {
    const data = this.props.recordListData;
    return (
      <div>
        <div className = "record-single">
          <div className = "record-column">日期</div>
          <div className = "record-column">备注</div>
          <div className = "record-column">赠品情况</div>
          <div className = "record-column">表示里程</div>
          <div className = "record-column">操作人</div>
          <div className = "record-column">项目名称</div>
          <div className = "record-column">换油证号</div>
        </div>
        {data.map(record => {
          return (
            <div className = "record-single" id = {record._id}>
              <div className = "record-column">{record.date}</div>
              <div className = "record-column">{record.detail}</div>
              <div className = "record-column">{record.gift}</div>
              <div className = "record-column">{record.milage}</div>
              <div className = "record-column">{record.operator}</div>
              <div className = "record-column">{record.product_name}</div>
              <div className = "record-column">{record.record_num}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default RecordList;