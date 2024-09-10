import React, { Component } from 'react';
import axios from 'axios';
import { Card, Button, ButtonGroup, Badge, Modal, Form, Spinner, ListGroup, Col, Row, Container, Image, Nav, Navbar } from 'react-bootstrap';

class WxArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wxArticleLibList: [],
      wxArticleDisplayList: [],
      isShowArticleDetail: false,
      isShowArticleNew: false,
      isShowArticleEdit: false,
      selectedArticle: '',
      articleInput: '',
      isLargeFile: false,
      isShowDelAlert: false,
      delArticle: '',
      editArticle: '',
      isOrderChanged: false,
      isLoading: false
    }
  };

  async initArticleList() {
    await this.getDisplayList();
    await this.getAllArticleInLib();
  }

  async getAllArticleInLib() {
    const domain = 'https://api.hulunbuirshell.com';
    const res = await axios.get(`${domain}/api/wxarticle/lib/all`);

    if(!res || res.status !== 200 || res.data.code !== 200) {
      this.props.showAlert('出错了', JSON.stringify(res.data), false);
    } else {
      let libList = res.data.data;

      libList.forEach(item => {
        item.isDisplay = this.state.displayIdList.includes(item.article_id);
      });

      this.setState({
        wxArticleLibList: res.data.data
      })
    }
  };

  async getDisplayList() {
    const res = await axios.get("https://api.hulunbuirshell.com/api/wxarticle/display/all");
    if(!res || res.status !== 200 || res.data.code !== 200) {
      this.props.showAlert('出错了', JSON.stringify(res.data), false);
    } else {
      let list = res.data.data.map(article =>{
        return ({
          ...article,
          order: res.data.data.length - 1 - res.data.data.indexOf(article)
        })
      });
      let displayIdList = list.map(data => {
        return data.article_id;
      });
      this.setState({
        wxArticleDisplayList: list,
        displayIdList
      })
    }
  };

  changeDisplayOrder(index, isMovingUp) {
    if(isMovingUp && index === 0) {
      this.props.showAlert('出错了', "已经是第一篇文章了，不能往前移动", false);
    } else if(!isMovingUp && index === this.state.wxArticleDisplayList.length - 1) {
      this.props.showAlert('出错了', "已经是最后一篇文章了，不能往后移动", false);
    } else {
      let { wxArticleDisplayList } = this.state;
      let selectArticle = this.state.wxArticleDisplayList[index];
      let targetArticle = this.state.wxArticleDisplayList[isMovingUp ? index - 1 : index + 1];

      wxArticleDisplayList[index] = {
        ...targetArticle,
        order: selectArticle.order
      };

      wxArticleDisplayList[isMovingUp ? index - 1 : index + 1] = {
        ...selectArticle,
        order: targetArticle.order
      };

      this.setState({
        wxArticleDisplayList,
        isOrderChanged: true
      });
    }
  };

  async updateDisplayOrder() {
    let articleList = this.state.wxArticleDisplayList.map(data => {
      return ({
        article_id: data.article_id,
        order: data.order
      })
    })
    const res = await axios({
      url: "https://api.hulunbuirshell.com/api/wxarticle/display/all",
      method: "PUT",
      data: {
        article_list: articleList
      }
    });
    
    if(!res || res.status !== 200 || res.data.code !== 200) {
      this.props.showAlert('出错了', JSON.stringify(res.data), false);
    } else {
      this.props.showAlert('修改成功', "文章展示顺序已更新", true);
      this.showOrHideArticleEdit(false);
      this.setState({
        isOrderChanged: false
      })
      await this.initArticleList();
    }
  };

  async removeArticleFromDisplay(id) {
    const res = await axios.delete(`https://api.hulunbuirshell.com/api/wxarticle/display/single/${id}`);
    
    if(!res || res.status !== 200 || res.data.code !== 200) {
      this.props.showAlert('出错了', JSON.stringify(res.data), false);
    } else {
      this.props.showAlert('修改成功', "文章已不再展示于小程序", true);
      await this.initArticleList();
    }
  };

  async removeArticleFromLib(id) {
    const res = await axios.delete(`https://api.hulunbuirshell.com/api/wxarticle/lib/single/${id}`);
    
    if(!res || res.status !== 200 || res.data.code !== 200) {
      this.props.showAlert('出错了', JSON.stringify(res.data), false);
    } else {
      this.props.showAlert('删除成功', "文章已从库中删除", true);
      this.showOrHideDelAlert(false)
      await this.initArticleList();
    }
  };

  async addArticleToDisplay(id) {
    const res = await axios.post(`https://api.hulunbuirshell.com/api/wxarticle/display/single/${id}`);
    
    if(!res || res.status !== 200 || res.data.code !== 200) {
      this.props.showAlert('出错了', JSON.stringify(res.data), false);
    } else {
      this.props.showAlert('修改成功', "文章已添加至小程序首页展示", true);
      await this.initArticleList();
    }
  };

  showOrHideArticleNew(isShow) {
    this.setState({
      isShowArticleNew: isShow,
      articleInput: "" 
    });
  };

  onArticleInputChange(e) {
    const target = e.target;
    const name = target.name;
    if(target.type === 'file') {
      let fileSize = target.files[0] ? target.files[0].size : 0;
      this.setState({
        articleInput: {
          ...this.state.articleInput,
          isLargeFile: fileSize > 524288,
          thumb_file: target.files[0],
          preview_url: target.files.length > 0 ? URL.createObjectURL(target.files[0]) : ""
        }
      })
    } else {
      this.setState({
        articleInput: {
          ...this.state.articleInput,
          [name]: target.value
        }
      })
    }
  };

  async uploadImg() {
    if(!this.state.articleInput.thumb_file) {
      const res = {
        data: {
          code: 200
        },
        msg: 'no image uploaded'
      };
      return res;
    } else {
      let formData = new FormData();
      formData.append("file", this.state.articleInput.thumb_file);
      this.setState({
        isLoading: true
      });
  
      const res = await axios({
        url: `https://api.hulunbuirshell.com/api/wxarticle/img/single?file_name=tmp_${new Date().getTime()}.png`,
        method: "POST",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
      });
  
      this.setState({
        isLoading: false
      });
      
      if(!res || res.status !== 200 || res.data.code !== 200) {
        this.props.showAlert('出错了', JSON.stringify(res.data.msg), false);
        console.log(res);
      } else {
        this.setState({
          articleInput: {
            ...this.state.articleInput,
            thumb_url: res.data.data.url,
            tmp_file_name: res.data.data.key
          }
        })
      }
      return res;
    }
  }

  articleInputValidate() {
    let article = this.state.articleInput;
    if(!article.title || !article.url || (!article.thumb_url && !article.thumb_file)) {
      this.props.showAlert('出错了', "所有内容都必填", false);
      return false;
    } else if(article.title === "" || article.url === "" || (article.thumb_url === "" && !article.thumb_file)) {
      this.props.showAlert('出错了', "所有内容都必填", false);
      return false;
    } else if(article.url.indexOf("https://mp.weixin.qq.com/s?__biz=MzIwMDAwOTc3MA") !== 0) {
      this.props.showAlert('非法链接', `${article.url}不是我司公众号的文章链接，不允许保存`, false);
      return false;
    } else if(this.state.articleInput.isLargeFile) {
      this.props.showAlert('图片过大', "请重新选择一个小于500KB的图片上传", false);
      return false;
    // } else if(article.thumb_url.indexOf("https://qiniu.hulunbuirshell.com/wxarticle-cover/") !== 0) {
    //   this.props.showAlert('非法图片', `${article.thumb_url}不是合法的图片路径，不允许保存`, false);
    //   return false;
    } else {
      return true;
    }
  }

  async confirmCreateArticleInLib() {
    const isValidInput = this.articleInputValidate();
    if(isValidInput) {
      let uploadRes = await this.uploadImg();
      if(uploadRes.data.code === 200) {
        const { title, url, thumb_url } = this.state.articleInput;
        this.setState({
          isLoading: true
        });
        const res = await axios({
          url: "https://api.hulunbuirshell.com/api/wxarticle/lib/single",
          method: "POST",
          data: {
            title,
            url,
            thumb_url
          }
        });

        this.setState({
          isLoading: false
        });
        
        if(!res || res.status !== 200 || res.data.code !== 200) {
          this.props.showAlert('出错了', JSON.stringify(res.data), false);
        } else {
          this.props.showAlert('添加成功', "文章已加至文章库", true);
          this.showOrHideArticleNew(false);
          await this.initArticleList();
        }
      }
    }
  };

  showOrHideArticleEdit(isShow, article) {
    this.setState({
      isShowArticleEdit: isShow,
      articleInput: article ? article : ""
    })
  };

  async confirmUpdateArticleInLib() {
    const isValidInput = this.articleInputValidate();
    if(isValidInput) {
      const uploadRes = await this.uploadImg();
      if(uploadRes.data.code === 200) {
        const { article_id, title, url, thumb_url } = this.state.articleInput;
        this.setState({
          isLoading: true
        });
        const res = await axios({
          url: "https://api.hulunbuirshell.com/api/wxarticle/lib/single",
          method: "PUT",
          data: {
            article_id,
            title,
            url,
            thumb_url
          }
        });

        this.setState({
          isLoading: false
        });
        
        if(!res || res.status !== 200 || res.data.code !== 200) {
          this.props.showAlert('出错了', JSON.stringify(res.data), false);
        } else {
          this.props.showAlert('编辑成功', "文章内容已更新", true);
          this.showOrHideArticleEdit(false);
          await this.initArticleList();
        }
      }
    };
  };

  showOrHideArticleDetail(isShow, article) {
    this.setState({
      isShowArticleDetail: isShow,
      selectedArticle: isShow ? article : ""
    });
  };

  openWxArticleLink(url) {
    if(url.indexOf("https://mp.weixin.qq.com/s?__biz=MzIwMDAwOTc3MA") === 0) {
      window.open(url, "_blank");
    } else {
      this.props.showAlert('非法链接', `${url}不是我司公众号的文章链接，不允许打开`, false)
    }
  };

  openCoverImg(url) {
    if(url.indexOf("https://qiniu.hulunbuirshell.com/wxarticle-cover/") === 0) {
      window.open(url, "_blank");
    } else {
      this.props.showAlert('非法图片源', `${url}不是我司的图片源，不允许打开`, false)
    }
  };

  showOrHideDelAlert(isShow, article) {
    this.setState({
      isShowDelAlert: isShow,
      delArticle: article ? article : ""
    })
  };

  componentDidMount(){
    this.initArticleList();
  };

  render() { 
    const linkIcon = require("../Icons/link.png");
    const newIcon = require("../Icons/new.png");
    const phoneIcon = require("../Icons/phone.png");
    const recordIcon = require("../Icons/record.png");
    const searchIcon = require("../Icons/search.png");

    const PreviewContent = () => {
      return (
        <Card.Body
          style={{margin: "-120px 10px 10px 10px"}}
        >
          <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px", borderRadius: "6px", border: "#dddddd solid 1px"}}>
            <div style={{margin: "6px"}}>宝马x3 【蒙E00355】</div>
          </Row>
          <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "18px 12px", borderRadius: "6px", border: "#dddddd solid 1px"}}>
            <Button 
              variant="warning" 
              disabled
              style={{width: "100%"}}
            >
              查看保养记录
            </Button>
          </Row>
          <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px", border: "#dddddd solid 1px"}}>
            <div>【通知】近期养护提醒……</div>
          </Row>

          <Row style={{marginTop: "6px"}}>
            <Col 
              className='flex-center'
              style={{backgroundColor: "#ffffff", marginRight: "6px", height: "70px", border: "#dddddd solid 1px"}}
            >
              <Row>
                <Image src={linkIcon} style={{width: "24px", marginBottom: "10px"}} />
              </Row>
              <Row>
                关联账号
              </Row>
            </Col>
            <Col 
              className='flex-center'
              style={{backgroundColor: "#ffffff", marginRight: "6px", height: "70px", border: "#dddddd solid 1px"}}
            >
              <Row>
                <Image src={searchIcon} style={{width: "28px", marginBottom: "6px"}} />
              </Row>
              <Row>
                输入查询
              </Row>
            </Col>
            <Col 
              className='flex-center'
              style={{backgroundColor: "#ffffff", height: "70px", border: "#dddddd solid 1px"}}
            >
              <Row>
                <Image src={phoneIcon} style={{width: "24px", marginBottom: "10px"}} />
              </Row>
              <Row>
                联系我们
              </Row>
            </Col>
          </Row>
          <Row
            className="justify-content-md-center" 
            style={{marginTop: "6px", padding: "6px"}}
          >
            管理员操作
          </Row>
          <Row style={{marginTop: "6px"}}>
            <Col 
              className='flex-center'
              style={{backgroundColor: "#ffffff", justifyContent: "center", marginRight: "6px", height: "70px", border: "#dddddd solid 1px"}}
            >
              <Row>
                <Image src={recordIcon} style={{width: "26px", marginBottom: "8px"}} />
              </Row>
              <Row>
                查询客户
              </Row>
            </Col>
            <Col 
              className='flex-center'
              style={{backgroundColor: "#ffffff", justifyContent: "center", marginRight: "6px", height: "70px", border: "#dddddd solid 1px"}}
            >
              <Row>
                <Image src={newIcon} style={{width: "24px", marginBottom: "10px"}} />
              </Row>
              <Row>
                创建用户
              </Row>
            </Col>
            <Col style={{height: "60px"}}/>
          </Row>
          <hr/>
        </Card.Body>
      )
    }

    return ( 
      <div className = "record-list">
        {/* 确认删除 */}
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.isShowDelAlert}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              正在删除文章
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            确认要从库里删除这篇标题为《{this.state.delArticle.title}》的文章？
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="danger"
              onClick={() => this.removeArticleFromLib(this.state.delArticle.article_id)}
            >
              删除
            </Button>
            <Button 
              variant="secondary"
              onClick={() => this.showOrHideDelAlert(false)}
            >
              取消
            </Button>
          </Modal.Footer>
        </Modal>
        {/* 编辑文章 */}
        <Modal
          show={this.state.isShowArticleEdit}
          onHide={() => this.showOrHideArticleEdit(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>编辑文章</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col style={{maxWidth: "calc(100% - 300px)", maxHeight: "400px", overflow: "scroll"}}>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>文章标题</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="title"
                        placeholder="请填写"
                        defaultValue={this.state.articleInput.title || ""}
                        onChange = {this.onArticleInputChange.bind(this)}
                      />
                      <Form.Text className="text-muted">
                        以后文章标题也会展示在小程序首页
                      </Form.Text>
                    </Form.Group>
                    <hr/>
                    <Form.Group className="mb-3">
                      <Form.Label>文章链接</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="url"
                        placeholder="请填写"
                        defaultValue={this.state.articleInput.url || ""}
                        onChange = {this.onArticleInputChange.bind(this)}
                      />
                      <Form.Text className="text-muted">
                        必须是公司公众号的文章链接
                      </Form.Text>
                    </Form.Group>
                    <hr/>
                    <Form.Group className="mb-3">
                      <Row>
                        <Col sm={8}>
                          <Form.Label>封面图片</Form.Label>
                          <Form.File 
                            id="formcheck-api-custom" 
                            custom
                            style={{marginBottom: "12px"}}
                          >
                            <Form.File.Input 
                              isValid={this.state.articleInput.thumb_file && !this.state.articleInput.isLargeFile}
                              isInvalid={this.state.articleInput.isLargeFile}
                              name="thumb_file" 
                              style={{cursor: "pointer"}}
                              onChange = {this.onArticleInputChange.bind(this)} 
                            />
                            <Form.File.Label data-browse="选择图片">
                              {this.state.articleInput.thumb_file ? this.state.articleInput.thumb_file.name : "选择后预览效果"}
                            </Form.File.Label>
                            {!this.state.articleInput.thumb_file ? 
                              <Form.Text className="text-muted">
                                请选择大小在500KB以内的图片
                              </Form.Text>
                              : ""
                            }
                            <Form.Control.Feedback type='invalid'>文件不可超过500KB!</Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">添加成功！点击「保存」来上传</Form.Control.Feedback>
                          </Form.File>
                        </Col>
                        <Col sm={4}>
                          {this.state.articleInput.preview_url ? 
                            <Image 
                              style={{maxWidth: "120px"}}
                              src={this.state.articleInput.preview_url} 
                              thumbnail 
                            />
                            : ""
                          }
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>
                </Col>
                <Col style={{maxWidth: "300px"}}>
                  <Row style={{position: 'fixed', zIndex: "2", padding: "6px 0 0 22px"}}>
                    <h5>
                      <Badge variant="dark">
                        效果预览
                      </Badge>
                    </h5>
                  </Row>
                  <Card style={{backgroundColor: "#f0f0f0", fontSize: "14px", color: "#808080"}}>
                    <Card.Header className="text-center">乘驾无忧</Card.Header>
                  </Card>
                  <Card style={{backgroundColor: "#f0f0f0", maxHeight: "400px", overflow: "scroll", fontSize: "12px", color: "#808080"}}>
                    <Card.Img 
                      variant="top" 
                      alt="选择封面以预览效果"
                      style={{width: "100%", objectFit: "cover", objectPosition: "center top", height: "300px"}}
                      src={this.state.articleInput.preview_url || this.state.articleInput.thumb_url} 
                    />
                    <PreviewContent/>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="warning" 
              onClick={() => this.confirmUpdateArticleInLib()}
              disabled={this.state.isLoading}
            >
              保存
              {this.state.isLoading ? <Spinner animation="border" size="sm" /> : ""}
            </Button>
            <Button variant="secondary" onClick={() => this.showOrHideArticleEdit(false)}>
              取消
            </Button>
          </Modal.Footer>
        </Modal>
        {/* 添加文章 */}
        <Modal
          show={this.state.isShowArticleNew}
          onHide={() => this.showOrHideArticleNew(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>添加文章</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col style={{maxWidth: "calc(100% - 300px)", maxHeight: "400px", overflow: "scroll"}}>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>文章标题</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="title"
                        placeholder="请填写"
                        onChange = {this.onArticleInputChange.bind(this)}
                      />
                      <Form.Text className="text-muted">
                        以后文章标题也会展示在小程序首页
                      </Form.Text>
                    </Form.Group>
                    <hr/>
                    <Form.Group className="mb-3">
                      <Form.Label>文章链接</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="url"
                        placeholder="请填写"
                        onChange = {this.onArticleInputChange.bind(this)}
                      />
                      <Form.Text className="text-muted">
                        必须是公司公众号的文章链接
                      </Form.Text>
                    </Form.Group>
                    <hr/>
                    <Form.Group className="mb-3">
                      <Row>
                        <Col sm={8}>
                          <Form.Label>封面图片</Form.Label>
                          <Form.File 
                            id="formcheck-api-custom" 
                            custom
                            style={{marginBottom: "12px"}}
                          >
                            <Form.File.Input 
                              isValid={this.state.articleInput.thumb_file && !this.state.articleInput.isLargeFile}
                              isInvalid={this.state.articleInput.isLargeFile}
                              name="thumb_file" 
                              style={{cursor: "pointer"}}
                              onChange = {this.onArticleInputChange.bind(this)} 
                            />
                            <Form.File.Label data-browse="选择图片">
                              {this.state.articleInput.thumb_file ? this.state.articleInput.thumb_file.name : "选择后预览效果"}
                            </Form.File.Label>
                            {!this.state.articleInput.thumb_file ? 
                              <Form.Text className="text-muted">
                                请选择大小在500KB以内的图片
                              </Form.Text>
                              : ""
                            }
                            <Form.Control.Feedback type='invalid'>文件不可超过500KB!</Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">添加成功！点击「保存」来上传</Form.Control.Feedback>
                          </Form.File>
                        </Col>
                        <Col sm={4}>
                          {this.state.articleInput.preview_url ? 
                            <Image 
                              style={{maxWidth: "120px"}}
                              src={this.state.articleInput.preview_url} 
                              thumbnail 
                            />
                            : ""
                          }
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>
                </Col>
                <Col style={{maxWidth: "300px"}}>
                  <Row style={{position: 'fixed', zIndex: "2", padding: "6px 0 0 22px"}}>
                    <h5>
                      <Badge variant="dark">
                        效果预览
                      </Badge>
                    </h5>
                  </Row>
                  <Card style={{backgroundColor: "#f0f0f0", fontSize: "14px", color: "#808080"}}>
                    <Card.Header className="text-center">乘驾无忧</Card.Header>
                  </Card>
                  <Card style={{backgroundColor: "#f0f0f0", maxHeight: "400px", overflow: "scroll", fontSize: "12px", color: "#808080"}}>
                    <Card.Img 
                      variant="top" 
                      alt="选择封面以预览效果"
                      style={{width: "100%", objectFit: "cover", objectPosition: "center top", height: "300px"}}
                      src={this.state.articleInput.preview_url} 
                    />
                    <PreviewContent/>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="warning" 
              onClick={() => this.confirmCreateArticleInLib()}
              disabled={this.state.isLoading}
            >
              保存
              {this.state.isLoading ? <Spinner animation="border" size="sm" /> : ""}
            </Button>
            <Button variant="secondary" onClick={() => this.showOrHideArticleNew(false)}>
              取消
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 查看文章详情 */}
        <Modal
          show={this.state.isShowArticleDetail}
          onHide={() => this.showOrHideArticleDetail(false)}
          keyboard={false}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>文章详情</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col style={{maxWidth: "calc(100% - 300px)", maxHeight: "400px", overflow: "scroll"}}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <h5>
                          <Badge variant="dark">
                            文章标题
                          </Badge>
                        </h5>
                        {this.state.selectedArticle.title}
                      </Card.Title>
                      <hr/>
                      <h5>
                        <Badge variant="dark">
                          公众号链接
                        </Badge>
                      </h5>
                      <Card.Text style={{color: "#808080"}}>
                        {this.state.selectedArticle.url? 
                          this.state.selectedArticle.url.length > 200 ? 
                            this.state.selectedArticle.url.slice(0, 199) + "..." 
                            : this.state.selectedArticle.url
                          : ""
                        }
                      </Card.Text>
                      <Button 
                        variant="warning"
                        onClick={() => this.openWxArticleLink(this.state.selectedArticle.url)}
                      >
                        查看文章
                      </Button>
                      <hr/>
                      <h5>
                        <Badge variant="dark">
                          封面图片
                        </Badge>
                      </h5>
                      <Image 
                        style={{width: "140px", cursor: "pointer"}} 
                        src={this.state.selectedArticle.thumb_url} 
                        thumbnail 
                        onClick={() => this.openCoverImg(this.state.selectedArticle.thumb_url)}
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col style={{maxWidth: "300px"}}>
                  <Row style={{position: 'fixed', zIndex: "2", padding: "6px 0 0 22px"}}>
                    <h5>
                      <Badge variant="dark">
                        效果预览
                      </Badge>
                    </h5>
                  </Row>
                  <Card style={{minWidth: "268px", backgroundColor: "#f0f0f0", fontSize: "12px", color: "#808080"}}>
                    <Card.Header className="text-center">乘驾无忧</Card.Header>
                  </Card>
                  <Card style={{minWidth: "268px", backgroundColor: "#f0f0f0", maxHeight: "400px", overflow: "scroll", fontSize: "12px", color: "#808080"}}>
                    <Card.Img 
                      variant="top" 
                      alt="选择封面以预览效果"
                      style={{width: "100%", objectFit: "cover", objectPosition: "center top", height: "300px"}}
                      src={this.state.selectedArticle.thumb_url} 
                    />
                    <PreviewContent/>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.showOrHideArticleDetail(false)}>
              关闭
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 页面标题 */}
        <Navbar style={{padding: "0", marginBottom: "12px"}}>
          <Container style={{justifyContent: "left", margin: "0"}}>
            <Navbar.Brand>
              <h3 style={{margin: "0"}}>小程序展示管理</h3>
            </Navbar.Brand>
            <Nav>
              <Nav.Item>
              <Button 
                  variant="warning"
                  onClick={() => this.showOrHideArticleNew(true)}
                >
                  添加新文章
                </Button>
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>
        
        {/* 展示文章 */}
        <hr/>
        <Navbar style={{padding: "0", marginBottom: "12px"}}>
          <Container style={{justifyContent: "left", margin: "0"}}>
            <Navbar.Brand>
              <h4 style={{margin: "10px 0"}}>展示文章</h4>
            </Navbar.Brand>
            <Nav>
              <Nav.Item>
              {this.state.isOrderChanged ? 
                <Button 
                  variant="success"
                  disabled={!this.state.isOrderChanged}
                  onClick={() => this.updateDisplayOrder()}
                >
                  确认修改顺序
                </Button>
                : 
                <Nav.Link disabled>
                  修改展示顺序后，点击「确认」按钮
                </Nav.Link>
              }
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>
        {this.state.wxArticleDisplayList.length !== 0 ?
          <ListGroup>
            {this.state.wxArticleDisplayList.map(item => {
              return (
                <ListGroup.Item style={{backgroundColor: "#eeeeee"}} key={"display" + item.article_id}>
                  <Row>
                    <Col
                      className="article-list"
                      onClick={() => this.showOrHideArticleDetail(true, item)}
                    >
                      <Row>
                        <Col md={2} style={{minWidth: '90px'}}>
                          <Image style={{width: "80px", height: "110px", objectFit: "cover", objectPosition: "center top"}} src={item.thumb_url} thumbnail />
                        </Col>
                        <Col style={{minWidth: "220px", borderLeft: "#dddddd solid 1px", display: "flex", alignItems: "center"}}>
                          <h5>
                            {item.title.length > 30 ? 
                              item.title.slice(0, 29) + "..." 
                              : item.title
                            }
                          </h5>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={2} style={{minWidth: "220px", borderLeft: "#dddddd solid 1px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <ButtonGroup style={{marginRight: "6px"}}>
                        <Button 
                          variant='warning'
                          style={{marginRight: "1px"}}
                          disabled={this.state.wxArticleDisplayList.length - 1 === item.order}
                          onClick={() => this.changeDisplayOrder(this.state.wxArticleDisplayList.indexOf(item), true)}
                        >
                          ↑
                        </Button>
                        <Button 
                          variant='dark'
                          disabled={item.order === 0}
                          onClick={() => this.changeDisplayOrder(this.state.wxArticleDisplayList.indexOf(item), false)}
                        >
                          ↓
                        </Button>
                      </ButtonGroup>
                      <Button 
                        variant='outline-danger'
                        onClick={() => this.removeArticleFromDisplay(item.article_id)}
                      >
                        不展示
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
          : "无展示文章"
        }

        {/* 文章库 */}
        <hr/>
        <Navbar style={{padding: "0", marginBottom: "12px"}}>
          <Container style={{justifyContent: "left", margin: "0"}}>
            <Navbar.Brand>
              <h4 style={{margin: "10px 0"}}>文章库</h4>
            </Navbar.Brand>
            <Nav>
              <Nav.Item>
                <Button 
                  variant="warning"
                  onClick={() => this.showOrHideArticleNew(true)}
                >
                  添加新文章
                </Button>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link disabled>
                  添加到文章库后，点击「展示」即可展示在小程序首页
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>
        {this.state.wxArticleLibList.length !== 0 ?
          <ListGroup>
            {this.state.wxArticleLibList.map(item => {
              return (
                <ListGroup.Item style={{backgroundColor: "#eeeeee"}} key={"lib" + item.article_id}>
                  <Row>
                    <Col
                      className="article-list"
                      onClick={() => this.showOrHideArticleDetail(true, item)}
                    >
                      <Row>
                        <Col md={2} style={{minWidth: '90px'}}>
                          <Image style={{width: "80px", height: "110px", objectFit: "cover", objectPosition: "center top" }} src={item.thumb_url} thumbnail />
                        </Col>
                        <Col style={{minWidth: "220px", borderLeft: "#dddddd solid 1px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                          <div>
                            <h5>
                              { item.isDisplay ?
                                <Badge variant='warning'>已展示</Badge>
                                : 
                                <Badge variant='secondary'>未展示</Badge>
                              }
                            </h5>
                          </div>
                          <h5>
                            {item.title.length > 30 ? 
                              item.title.slice(0, 29) + "..." 
                              : item.title
                            }
                          </h5>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={2} style={{minWidth: "220px", borderLeft: "#dddddd solid 1px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <Button 
                        variant= 'warning'
                        disabled={item.isDisplay}
                        style={{marginRight: "6px"}}
                        onClick={() => this.addArticleToDisplay(item.article_id)}
                      >
                        展示
                      </Button>
                      <Button 
                        variant='dark'
                        style={{marginRight: "6px"}}
                        onClick={() => this.showOrHideArticleEdit(true, item)}
                      >
                        编辑
                      </Button>
                      <Button 
                        variant='danger'
                        disabled={item.isDisplay}
                        onClick={() => this.showOrHideDelAlert(true, item)}
                      >
                        删除
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
          : "文章库里没有内容，请先添加文章"
        }
        <hr/>
      </div>
    );
  }
}

export default WxArticle;