(this["webpackJsonpclient-shell-v2"]=this["webpackJsonpclient-shell-v2"]||[]).push([[0],{40:function(e,t,a){e.exports=a(69)},45:function(e,t,a){},46:function(e,t,a){},69:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(19),i=a.n(l),c=(a(45),a(5)),o=a(6),s=a(9),u=a(7),d=a(8),m=(a(46),a(47),a(74)),h=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={admin_name:"",admin_pass:""},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return r.a.createElement(m.a,{sticky:"top",className:"header"},r.a.createElement("h1",null,"\u58f3\u724c\u6da6\u6ed1\u6cb9"))}}]),t}(n.Component),p=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={admin_name:"",admin_pass:""},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return r.a.createElement(m.a,{sticky:"bottom",className:"footer"},r.a.createElement("div",{className:"footer-info"},r.a.createElement("h5",null,"\u547c\u4f26\u8d1d\u5c14\u5e02\u4f73\u6da6\u7269\u8d44\u6709\u9650\u516c\u53f8"),r.a.createElement("p",null,"0470-8223779")),r.a.createElement("div",{className:"footer-legal"},r.a.createElement("a",{href:"http://beian.miit.gov.cn",target:"_blank"},"\u8499ICP\u590719005903\u53f7-1")))}}]),t}(n.Component),f=a(11),g=a(10),E=a.n(g),v=a(75),b=a(77),_=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).handleAdminLogin=function(e){e.preventDefault(),""===a.state.admin_name||""===a.state.admin_pass?alert("\u8bf7\u8f93\u5165\u7ba1\u7406\u5458\u8d26\u53f7\u548c\u5bc6\u7801"):E.a.get("https://api.hailarshell.cn/api/admin/login?admin=".concat(a.state.admin_name,"&pass=").concat(a.state.admin_pass)).then((function(e){200!==e.data.code?422===e.data.code?alert("\u8f93\u5165\u683c\u5f0f\u6709\u8bef"):alert("\u8bf7\u518d\u6b21\u68c0\u67e5\u8d26\u53f7\u548c\u5bc6\u7801"):(a.props.setAdmin(e.data.data),a.props.handlePageChange("admin"))})).catch((function(e){console.log(e)}))},a.state={admin_name:"",admin_pass:""},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"handleChange",value:function(e){var t=e.target,a="checkbox"===t.type?t.checked:t.value,n=t.name;this.setState(Object(f.a)({},n,a))}},{key:"render",value:function(){return r.a.createElement("div",{className:"login"},r.a.createElement(v.a,{className:"login-form",onSubmit:this.handleAdminLogin.bind(this)},r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u7ba1\u7406\u5458\u8d26\u53f7"),r.a.createElement(v.a.Control,{name:"admin_name",value:this.state.admin_name,onChange:this.handleChange.bind(this),type:"text",placeholder:"\u7ba1\u7406\u5458\u8d26\u53f7"})),r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u7ba1\u7406\u5458\u5bc6\u7801"),r.a.createElement(v.a.Control,{name:"admin_pass",value:this.state.admin_pass,onChange:this.handleChange.bind(this),type:"password",placeholder:"\u7ba1\u7406\u5458\u5bc6\u7801"})),r.a.createElement(b.a,{variant:"success",type:"submit"},"\u767b\u5f55")))}}]),t}(n.Component),k=a(71),y=a(17),C=a(76),D=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={filter:"record_num",value:"",data:{}},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"handleChange",value:function(e){var t=e.target,a="checkbox"===t.type?t.checked:t.value,n=t.name;this.setState(Object(f.a)({},n,a))}},{key:"render",value:function(){return r.a.createElement(C.a.Body,null,r.a.createElement(C.a.Header,null,r.a.createElement(C.a.Title,null,this.props.userData.user_name||"")),r.a.createElement(C.a.Text,{className:"mb-2 text-muted"},"\u6362\u6cb9\u8bc1\u53f7"),r.a.createElement(C.a.Text,null,this.props.userData.record_num||""),r.a.createElement(C.a.Text,{className:"mb-2 text-muted"},"\u8054\u7cfb\u65b9\u5f0f"),r.a.createElement(C.a.Text,null,this.props.userData.phone||""),r.a.createElement(C.a.Text,{className:"mb-2 text-muted"},"\u8f66\u724c\u53f7"),r.a.createElement(C.a.Text,null,this.props.userData.plate||""),r.a.createElement(C.a.Text,{className:"mb-2 text-muted"},"\u8f66\u578b"),r.a.createElement(C.a.Text,null,this.props.userData.make||""),r.a.createElement(C.a.Text,{className:"mb-2 text-muted"},"\u5907\u6ce8"),r.a.createElement(C.a.Text,null,this.props.userData.detail||""))}}]),t}(n.Component),U=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(u.a)(t).call(this))).state={filter:"record_num",value:""},e}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){this.setState({user_input:{user_name:this.props.userData.user_name,phone:this.props.userData.phone,plate:this.props.userData.plate,make:this.props.userData.make,detail:this.props.userData.detail}})}},{key:"render",value:function(){var e=this;return r.a.createElement(v.a,{onSubmit:function(t){return e.props.confirmUserUpdate(t)}},r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u8f66\u4e3b\u59d3\u540d"),r.a.createElement(v.a.Control,{name:"user_name",defaultValue:this.props.userData.user_name,onChange:this.props.handleUserUpdateChange.bind(this)})),r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u6362\u6cb9\u8bc1\u53f7"),r.a.createElement(v.a.Control,{value:this.props.userData.record_num,disabled:!0})),r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u8054\u7cfb\u65b9\u5f0f"),r.a.createElement(v.a.Control,{name:"phone",defaultValue:this.props.userData.phone,onChange:this.props.handleUserUpdateChange.bind(this)})),r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u8f66\u724c\u53f7"),r.a.createElement(v.a.Control,{name:"plate",defaultValue:this.props.userData.plate,onChange:this.props.handleUserUpdateChange.bind(this)})),r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u8f66\u578b"),r.a.createElement(v.a.Control,{name:"make",defaultValue:this.props.userData.make,onChange:this.props.handleUserUpdateChange.bind(this)})),r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u5907\u6ce8"),r.a.createElement(v.a.Control,{as:"textarea",rows:"3",name:"detail",defaultValue:this.props.userData.detail,onChange:this.props.handleUserUpdateChange.bind(this)})),r.a.createElement(k.a,{style:{width:"100%"}},r.a.createElement(b.a,{variant:"success",type:"submit"},"\u4fdd\u5b58"),r.a.createElement(b.a,{variant:"warning",onClick:this.props.cancelUserUpdate},"\u53d6\u6d88")))}}]),t}(n.Component),O=a(72),j=a(37),w=a(73),N=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={newRecord:{date:"",product_name:"",milage:"",gift:"",operator:"",detail:""},updateRecord:{date:"",product_name:"",milage:"",gift:"",operator:"",detail:""},selectUpdateId:"",currDate:""},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=new Date,t=""+(e.getMonth()+1),a=""+e.getDate(),n=e.getFullYear();t.length<2&&(t="0"+t),a.length<2&&(a="0"+a),this.setState({currDate:[n,t,a].join("-")})}},{key:"resetInput",value:function(){this.setState({newRecord:{date:"",product_name:"",milage:"",gift:"",operator:"",detail:""}})}},{key:"handleNewRecordChange",value:function(e){var t=e.target,a="checkbox"===t.type?t.checked:t.value,n=t.name;this.setState({newRecord:Object(y.a)({},this.state.newRecord,Object(f.a)({},n,a))})}},{key:"handleUpdateRecordChange",value:function(e){var t=e.target,a="checkbox"===t.type?t.checked:t.value,n=t.name;this.setState({updateRecord:Object(y.a)({},this.state.updateRecord,Object(f.a)({},n,a))})}},{key:"handleNewRecordSubmit",value:function(e){var t=this;e.preventDefault();var a=this.props.record_num;E()({url:"https://api.hailarshell.cn/api/record/user/".concat(a),method:"POST",data:{date:this.state.newRecord.date,gift:this.state.newRecord.gift,milage:this.state.newRecord.milage,operator:this.state.newRecord.operator,product_name:this.state.newRecord.product_name,detail:this.state.newRecord.detail}}).then((function(a){200!==a.data.code?(alert(a.data.code+"\n"+JSON.stringify(a.data.data)),console.log(a.data.data)):(console.log(a),t.resetInput(),t.props.handleFindUserSubmit(e))})).catch((function(e){alert(e),console.log(e)}))}},{key:"handleDeleteRecord",value:function(e,t){var a=this;E.a.delete("https://api.hailarshell.cn/api/record/single/".concat(t)).then((function(t){200!==t.data.code?(alert(t.data.code+"\n"+JSON.stringify(t.data.data)),console.log(t.data.data)):(console.log(t),a.props.handleFindUserSubmit(e))})).catch((function(e){alert(e),console.log(e)}))}},{key:"selectUpdateRecord",value:function(e){this.setState({updateRecord:{date:e.date,product_name:e.product_name,milage:e.milage,gift:e.gift,operator:e.operator,detail:e.detail},selectUpdateId:e._id})}},{key:"confirmUpdateRecord",value:function(e){var t=this;console.log(this.state.selectUpdateId),console.log(this.state.updateRecord),e.preventDefault(),E()({url:"https://api.hailarshell.cn/api/record/single/".concat(this.state.selectUpdateId),method:"PUT",data:this.state.updateRecord}).then((function(a){200===a.data.code&&(t.resetUpdateRecord(),t.props.handleFindUserSubmit(e))})).catch((function(e){console.log(e)}))}},{key:"resetUpdateRecord",value:function(){this.setState({updateRecord:{date:"",product_name:"",milage:"",gift:"",operator:"",detail:""},selectUpdateId:""})}},{key:"render",value:function(){var e=this,t=this.props.recordListData;return r.a.createElement("div",{className:"record-list"},r.a.createElement("div",null,r.a.createElement("h5",null,"\u65b0\u4fdd\u517b\u8bb0\u5f55"),r.a.createElement(v.a,{className:"new-record-form",onSubmit:this.handleNewRecordSubmit.bind(this)},r.a.createElement(O.a,null,r.a.createElement(j.a,null,r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u65e5\u671f"),r.a.createElement(v.a.Control,{type:"date",defaultValue:this.state.currDate,name:"date",onChange:this.handleNewRecordChange.bind(this),placeholder:"\u65e5\u671f"}))),r.a.createElement(j.a,null,r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u9879\u76ee\u540d\u79f0"),r.a.createElement(v.a.Control,{as:"select",name:"product_name",defaultValue:"",onChange:this.handleNewRecordChange.bind(this)},r.a.createElement("option",{value:"",disabled:!0},"\u3010\u6c7d\u673a\u6cb9\u3011"),this.props.productData.map((function(e){if("\u6c7d\u673a\u6cb9"===e.product_type)return r.a.createElement("option",{value:e.product_name,key:e._id},e.product_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u67f4\u673a\u6cb9\u3011"),this.props.productData.map((function(e){if("\u67f4\u673a\u6cb9"===e.product_type)return r.a.createElement("option",{value:e.product_name,key:e._id},e.product_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u4e2d\u534e\u4ea7\u54c1\u3011"),this.props.productData.map((function(e){if("\u4e2d\u534e\u4ea7\u54c1"===e.product_type)return r.a.createElement("option",{value:e.product_name,key:e._id},e.product_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u9644\u5c5e\u54c1\u3011"),this.props.productData.map((function(e){if("\u9644\u5c5e\u54c1"===e.product_type)return r.a.createElement("option",{value:e.product_name,key:e._id},e.product_name)}))))),r.a.createElement(j.a,null,r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u8868\u793a\u91cc\u7a0b"),r.a.createElement(v.a.Control,{name:"milage",onChange:this.handleNewRecordChange.bind(this),placeholder:"\u8868\u793a\u91cc\u7a0b"}))),r.a.createElement(j.a,null,r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u8d60\u54c1\u60c5\u51b5"),r.a.createElement(v.a.Control,{as:"select",name:"gift_name",defaultValue:"",onChange:this.handleNewRecordChange.bind(this)},this.props.giftData.map((function(e){return r.a.createElement("option",{value:e.gift_name,key:e._id},e.gift_name)}))))),r.a.createElement(j.a,null,r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u64cd\u4f5c\u4eba"),r.a.createElement(v.a.Control,{as:"select",name:"operator_name",defaultValue:"",onChange:this.handleNewRecordChange.bind(this)},r.a.createElement("option",{value:"",disabled:!0},"\u3010\u6d77\u62c9\u5c14\u3011"),this.props.operatorData.map((function(e){if("\u6d77\u62c9\u5c14"===e.location)return r.a.createElement("option",{value:e.op_name,key:e._id},e.op_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u6ee1\u6d32\u91cc\u3011"),this.props.operatorData.map((function(e){if("\u6ee1\u6d32\u91cc"===e.location)return r.a.createElement("option",{value:e.op_name,key:e._id},e.op_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u7259\u514b\u77f3\u3011"),this.props.operatorData.map((function(e){if("\u7259\u514b\u77f3"===e.location)return r.a.createElement("option",{value:e.op_name,key:e._id},e.op_name)}))))),r.a.createElement(j.a,null,r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u79ef\u5206/\u5907\u6ce8"),r.a.createElement(v.a.Control,{name:"detail",onChange:this.handleNewRecordChange.bind(this),placeholder:"\u79ef\u5206/\u5907\u6ce8"}))),r.a.createElement(j.a,null,r.a.createElement("div",{style:{margin:"0 0 8px 0"}},"\u64cd\u4f5c"),r.a.createElement(b.a,{variant:"primary",type:"submit"},"\u4fdd\u5b58"))))),t?r.a.createElement("div",null,r.a.createElement("h5",null,"\u4fdd\u517b\u8bb0\u5f55\u5386\u53f2"),r.a.createElement(w.a,{striped:!0,bordered:!0,hover:!0,variant:"dark"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"\u65e5\u671f"),r.a.createElement("th",null,"\u9879\u76ee\u540d\u79f0"),r.a.createElement("th",null,"\u8868\u793a\u91cc\u7a0b"),r.a.createElement("th",null,"\u8d60\u54c1\u60c5\u51b5"),r.a.createElement("th",null,"\u64cd\u4f5c\u4eba"),r.a.createElement("th",null,"\u79ef\u5206/\u5907\u6ce8"),r.a.createElement("th",null,"\u64cd\u4f5c"))),r.a.createElement("tbody",null,t.map((function(t){return e.state.selectUpdateId!==t._id?r.a.createElement("tr",{key:t._id,id:t._id},r.a.createElement("td",{className:"record-list-column"},t.date),r.a.createElement("td",{className:"record-list-column"},t.product_name),r.a.createElement("td",{className:"record-list-column"},t.milage),r.a.createElement("td",{className:"record-list-column"},t.gift),r.a.createElement("td",{className:"record-list-column"},t.operator),r.a.createElement("td",{className:"record-list-column"},t.detail),r.a.createElement("td",{className:"record-list-column"},r.a.createElement(b.a,{variant:"primary",onClick:function(a){return e.selectUpdateRecord(t)}},"\u7f16\u8f91"),r.a.createElement(b.a,{variant:"danger",onClick:function(a){return e.handleDeleteRecord(a,t._id)}},"\u5220\u9664"))):r.a.createElement("tr",{key:t._id,id:t._id},r.a.createElement("td",{className:"record-list-column"},r.a.createElement("input",{className:"edit-input",type:"date",defaultValue:t.date,name:"date",onChange:e.handleUpdateRecordChange.bind(e)})),r.a.createElement("td",{className:"record-list-column"},r.a.createElement("select",{className:"edit-select",name:"product_name",defaultValue:t.product_name,onChange:e.handleUpdateRecordChange.bind(e)},r.a.createElement("option",{value:"",disabled:!0},"\u3010\u9879\u76ee\u540d\u79f0\u3011"),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u6c7d\u673a\u6cb9\u3011"),e.props.productData.map((function(e){if("\u6c7d\u673a\u6cb9"===e.product_type)return r.a.createElement("option",{value:e.product_name,key:e._id},e.product_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u67f4\u673a\u6cb9\u3011"),e.props.productData.map((function(e){if("\u67f4\u673a\u6cb9"===e.product_type)return r.a.createElement("option",{value:e.product_name,key:e._id},e.product_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u4e2d\u534e\u4ea7\u54c1\u3011"),e.props.productData.map((function(e){if("\u4e2d\u534e\u4ea7\u54c1"===e.product_type)return r.a.createElement("option",{value:e.product_name,key:e._id},e.product_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u9644\u5c5e\u54c1\u3011"),e.props.productData.map((function(e){if("\u9644\u5c5e\u54c1"===e.product_type)return r.a.createElement("option",{value:e.product_name,key:e._id},e.product_name)})))),r.a.createElement("td",{className:"record-list-column"},r.a.createElement("input",{className:"edit-input",defaultValue:t.milage,name:"milage",onChange:e.handleUpdateRecordChange.bind(e)})),r.a.createElement("td",{className:"record-list-column"},r.a.createElement("select",{className:"edit-select",name:"gift",defaultValue:t.gift,onChange:e.handleUpdateRecordChange.bind(e)},r.a.createElement("option",{value:"",disabled:!0},"\u3010\u8d60\u54c1\u60c5\u51b5\u3011"),e.props.giftData.map((function(e){return r.a.createElement("option",{value:e.gift_name,key:e._id},e.gift_name)})))),r.a.createElement("td",{className:"record-list-column"},r.a.createElement("select",{className:"edit-select",name:"operator",defaultValue:t.operator,onChange:e.handleUpdateRecordChange.bind(e)},r.a.createElement("option",{value:"",disabled:!0},"\u3010\u64cd\u4f5c\u4eba\u3011"),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u6d77\u62c9\u5c14\u3011"),e.props.operatorData.map((function(e){if("\u6d77\u62c9\u5c14"===e.location)return r.a.createElement("option",{value:e.op_name,key:e._id},e.op_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u6ee1\u6d32\u91cc\u3011"),e.props.operatorData.map((function(e){if("\u6ee1\u6d32\u91cc"===e.location)return r.a.createElement("option",{value:e.op_name,key:e._id},e.op_name)})),r.a.createElement("option",{value:"",disabled:!0},"\u3010\u7259\u514b\u77f3\u3011"),e.props.operatorData.map((function(e){if("\u7259\u514b\u77f3"===e.location)return r.a.createElement("option",{value:e.op_name,key:e._id},e.op_name)})))),r.a.createElement("td",{className:"record-list-column"},r.a.createElement("input",{defaultValue:t.detail,name:"detail",onChange:e.handleUpdateRecordChange.bind(e)})),r.a.createElement("td",{className:"record-list-column"},r.a.createElement(b.a,{variant:"success",onClick:function(t){return e.confirmUpdateRecord(t)}},"\u4fdd\u5b58"),r.a.createElement(b.a,{variant:"warning",onClick:e.resetUpdateRecord.bind(e)},"\u53d6\u6d88")))}))))):"")}}]),t}(n.Component),S=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={filter:"record_num",value:"",userData:"",recordListData:[],isUserUpdating:"",updateUser:{user_name:"",phone:"",plate:"",make:"",detail:""}},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"handleChange",value:function(e){var t=e.target,a="checkbox"===t.type?t.checked:t.value,n=t.name;this.setState(Object(f.a)({},n,a))}},{key:"handleUserUpdateChange",value:function(e){var t=e.target,a="checkbox"===t.type?t.checked:t.value,n=t.name;this.setState({updateUser:Object(y.a)({},this.state.updateUser,Object(f.a)({},n,a))})}},{key:"resetStates",value:function(){this.setState({filter:"record_num",value:"",userData:"",recordListData:""})}},{key:"changeUserUpdateStatus",value:function(){this.setState({isUserUpdating:!this.state.isUserUpdating})}},{key:"selectUserUpdate",value:function(){this.setState({isUserUpdating:!0,updateUser:this.state.userData})}},{key:"cancelUserUpdate",value:function(){this.setState({isUserUpdating:!1,updateUser:{user_name:"",phone:"",plate:"",make:"",detail:""}})}},{key:"confirmUserUpdate",value:function(e){var t=this;e.preventDefault(),console.log(this.state.updateUser),E()({url:"https://api.hailarshell.cn/api/user/single/".concat(this.state.userData.record_num),method:"PUT",data:{make:this.state.updateUser.make,phone:this.state.updateUser.phone,plate:this.state.updateUser.plate,user_name:this.state.updateUser.user_name,detail:this.state.updateUser.detail}}).then((function(a){200===a.data.code&&(t.cancelUserUpdate(),t.handleFindUserSubmit(e))})).catch((function(e){console.log(e)}))}},{key:"confirmUserDelete",value:function(){var e=this;window.confirm("\u786e\u5b9a\u5220\u9664\u7528\u6237".concat(this.state.userData.user_name,"\uff1f"))&&E.a.delete("https://api.hailarshell.cn/api/user/single/".concat(this.state.userData.record_num)).then((function(t){200!==t.data.code?alert(t.data.code+"\n"+JSON.stringify(t.data.data)):e.resetStates()})).catch((function(e){alert(e),console.log(e)}))}},{key:"handleFindUserSubmit",value:function(e){var t=this;e.preventDefault(),E.a.get("https://api.hailarshell.cn/api/user/single?filter=".concat(this.state.filter,"&value=").concat(this.state.value)).then((function(e){if(200!==e.data.code)alert(e.data.code+"\n"+JSON.stringify(e.data.data));else{t.setState({userData:e.data.data});var a=e.data.data.record_num;E.a.get("https://api.hailarshell.cn/api/record/user/".concat(a)).then((function(e){200!==e.data.code?(alert(e.data),console.log(e.data)):t.setState({recordListData:e.data.data})})).catch((function(e){alert(e),console.log(e)}))}})).catch((function(e){console.log(e)}))}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(v.a,{className:"search-form",onSubmit:this.handleFindUserSubmit.bind(this)},r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u67e5\u8be2\u6761\u4ef6"),r.a.createElement(v.a.Control,{as:"select",name:"filter",value:this.state.filter,onChange:this.handleChange.bind(this)},r.a.createElement("option",{value:"record_num"},"\u6309\u6362\u6cb9\u8bc1\u53f7\u67e5\u627e"),r.a.createElement("option",{value:"phone"},"\u6309\u624b\u673a\u53f7\u67e5\u627e"),r.a.createElement("option",{value:"plate"},"\u6309\u8f66\u724c\u53f7\u67e5\u627e"))),r.a.createElement(v.a.Group,null,r.a.createElement(v.a.Label,null,"\u67e5\u8be2\u5185\u5bb9"),r.a.createElement(v.a.Control,{type:"text",name:"value",value:this.state.value,onChange:this.handleChange.bind(this),placeholder:"\u5185\u5bb9"})),r.a.createElement(b.a,{variant:"success",type:"submit"},"\u67e5\u627e")),""!==this.state.userData?this.state.isUserUpdating?r.a.createElement(C.a,{bg:"dark",text:"white",border:"light",className:"user-form"},r.a.createElement(U,{userData:this.state.userData,cancelUserUpdate:this.cancelUserUpdate.bind(this),confirmUserUpdate:this.confirmUserUpdate.bind(this),handleUserUpdateChange:this.handleUserUpdateChange.bind(this)})):r.a.createElement("div",null,r.a.createElement(C.a,{bg:"dark",text:"white",border:"light",className:"user-single"},r.a.createElement(D,{userData:this.state.userData}),r.a.createElement(k.a,{style:{margin:"10px"}},r.a.createElement(b.a,{variant:"primary",onClick:this.selectUserUpdate.bind(this)},"\u7f16\u8f91\u5ba2\u6237\u4fe1\u606f"),r.a.createElement(b.a,{variant:"danger",onClick:this.confirmUserDelete.bind(this)},"\u5220\u9664\u5ba2\u6237\u4fe1\u606f")))):"",""!==this.state.userData?r.a.createElement(N,{productData:this.props.productData,giftData:this.props.giftData,operatorData:this.props.operatorData,recordListData:this.state.recordListData,record_num:this.state.userData.record_num,handleFindUserSubmit:this.handleFindUserSubmit.bind(this)}):"")}}]),t}(n.Component),R=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={isManual:!1,userData:"",user_name:"",record_num:"",phone:"",plate:"",make:""},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"handleChange",value:function(e){var t=e.target,a="checkbox"===t.type?t.checked:t.value,n=t.name;this.setState(Object(f.a)({},n,a))}},{key:"changeManualState",value:function(){this.setState({isManual:!this.state.isManual})}},{key:"handleNewUserSubmit",value:function(e){var t=this;e.preventDefault(),window.confirm("\u8bf7\u6838\u5bf9\u65b0\u7528\u6237\u4fe1\u606f\uff1a\n\u5ba2\u6237\u59d3\u540d\uff1a".concat(this.state.user_name,"\n\u6362\u6cb9\u8bc1\u53f7\uff1a").concat(this.state.isManual?this.state.record_num:"\u81ea\u52a8\u751f\u6210 - "+this.props.admin.location,"\n\u8054\u7cfb\u65b9\u5f0f\uff1a").concat(this.state.phone,"\n\u8f66\u578b\uff1a").concat(this.state.make,"\n\u8f66\u724c\u53f7\uff1a").concat(this.state.plate))&&E()({url:"https://api.hailarshell.cn/api/user/single".concat(this.state.isManual?"":"/"+this.props.admin.location_char),method:"POST",data:{make:this.state.make,phone:this.state.phone,plate:this.state.plate,record_num:this.state.record_num,user_name:this.state.user_name}}).then((function(e){200!==e.data.code?alert(e.data.code+"\n"+JSON.stringify(e.data.data)):t.setState({userData:e.data.data})})).catch((function(e){alert(e)}))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,""!==this.state.userData?r.a.createElement("div",null,r.a.createElement("h3",null,"\u65b0\u7528\u6237\uff1a"),r.a.createElement(C.a,{bg:"dark",text:"white",border:"light",className:"user-single"},r.a.createElement(D,{userData:this.state.userData})),r.a.createElement("h5",null,"\u8bf7\u8fd4\u56de",r.a.createElement(b.a,{variant:"secondary",onClick:function(){return e.props.changeAction("find_user")}},"\u67e5\u627e\u8001\u7528\u6237"),"\u6765\u67e5\u627e\u8be5\u7528\u6237\uff0c\u5e76\u6dfb\u52a0\u4fdd\u517b\u8bb0\u5f55\u3002")):r.a.createElement(v.a,{className:"user-form"},r.a.createElement(v.a.Label,null,"\u5ba2\u6237\u59d3\u540d\uff1a"),r.a.createElement(v.a.Control,{type:"text",name:"user_name",onChange:this.handleChange.bind(this),value:this.state.user_name}),r.a.createElement(v.a.Label,null,"\u6362\u6cb9\u8bc1\u53f7\uff1a",this.props.admin.location,"\u95e8\u5e97"),r.a.createElement(v.a.Check,{onChange:this.changeManualState.bind(this),type:"checkbox",label:"\u624b\u52a8\u8f93\u5165\u95e8\u5e97\u6362\u6cb9\u8bc1\u53f7"}),r.a.createElement(v.a.Control,{type:"text",name:"record_num",onChange:this.handleChange.bind(this),value:this.state.record_num,disabled:this.state.isManual?"":"disabled"}),r.a.createElement(v.a.Label,null,"\u8054\u7cfb\u65b9\u5f0f\uff1a"),r.a.createElement(v.a.Control,{type:"text",name:"phone",onChange:this.handleChange.bind(this),value:this.state.phone}),r.a.createElement(v.a.Label,null,"\u8f66\u724c\u53f7\uff1a"),r.a.createElement(v.a.Control,{type:"text",name:"plate",onChange:this.handleChange.bind(this),value:this.state.plate}),r.a.createElement(v.a.Label,null,"\u8f66\u578b\uff1a"),r.a.createElement(v.a.Control,{type:"text",name:"make",onChange:this.handleChange.bind(this),value:this.state.make}),r.a.createElement(b.a,{variant:"info",onClick:this.handleNewUserSubmit.bind(this)},"\u521b\u5efa")))}}]),t}(n.Component),x=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={action:"find_user",giftData:[],operatorData:[],productData:[]},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){this.getGiftData(),this.getOperatorData(),this.getProductData()}},{key:"getGiftData",value:function(){var e=this;E.a.get("https://api.hailarshell.cn/api/gift/all").then((function(t){e.setState({giftData:t.data})})).catch((function(e){console.log(e)}))}},{key:"getOperatorData",value:function(){var e=this;E.a.get("https://api.hailarshell.cn/api/operator/all").then((function(t){e.setState({operatorData:t.data})})).catch((function(e){console.log(e)}))}},{key:"getProductData",value:function(){var e=this;E.a.get("https://api.hailarshell.cn/api/product/all").then((function(t){e.setState({productData:t.data})})).catch((function(e){console.log(e)}))}},{key:"handleChange",value:function(e){var t=e.target,a="checkbox"===t.type?t.checked:t.value,n=t.name;this.setState(Object(f.a)({},n,a))}},{key:"changeAction",value:function(e){this.setState({action:e})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"admin"},r.a.createElement("div",{className:"nav-bar"},r.a.createElement(k.a,{style:{width:"300px",margin:"20px"}},r.a.createElement(b.a,{variant:"secondary",onClick:function(){return e.changeAction("find_user")}},"\u67e5\u627e\u8001\u7528\u6237"),r.a.createElement(b.a,{variant:"secondary",onClick:function(){return e.changeAction("new_user")}},"\u521b\u5efa\u65b0\u7528\u6237"))),"find_user"===this.state.action?r.a.createElement(S,{giftData:this.state.giftData,productData:this.state.productData,operatorData:this.state.operatorData}):"","new_user"===this.state.action?r.a.createElement(R,{changeAction:this.changeAction.bind(this),admin:this.props.admin}):"")}}]),t}(n.Component),L=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(s.a)(this,Object(u.a)(t).call(this))).state={admin:{},page:"admin"},e}return Object(d.a)(t,e),Object(o.a)(t,[{key:"setAdmin",value:function(e){this.setState({admin:e})}},{key:"handlePageChange",value:function(e){this.setState({page:e})}},{key:"componentDidMount",value:function(){console.log("client initiated")}},{key:"render",value:function(){return r.a.createElement("div",{className:"app"},r.a.createElement(h,null),"login"===this.state.page?r.a.createElement(_,{setAdmin:this.setAdmin.bind(this),handlePageChange:this.handlePageChange.bind(this)}):"","admin"===this.state.page?r.a.createElement(x,{handlePageChange:this.handlePageChange.bind(this),admin:this.state.admin}):"",r.a.createElement(p,null))}}]),t}(n.Component),G=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function T(e){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}})).catch((function(e){console.error("Error during service worker registration:",e)}))}i.a.render(r.a.createElement(L,null),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("/client-shell-v2",window.location).origin!==window.location.origin)return;window.addEventListener("load",(function(){var e="".concat("/client-shell-v2","/service-worker.js");G?(!function(e){fetch(e).then((function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):T(e)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ")}))):T(e)}))}}()}},[[40,1,2]]]);
//# sourceMappingURL=main.1f08ef0f.chunk.js.map