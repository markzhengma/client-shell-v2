import React, { Component } from 'react';
import axios from 'axios';
import { Card, Button, ButtonGroup, Badge, Modal, Form, InputGroup, ListGroup, Col, Row, Container, Image, Nav, Navbar } from 'react-bootstrap';

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
      isShowDelAlert: false,
      delArticle: '',
      editArticle: '',
      isOrderChanged: false
    }
  };

  async initArticleList() {
    await this.getDisplayList();
    await this.getAllArticleInLib();
  }

  async getAllArticleInLib() {
    const domain = 'https://api.hulunbuirshell.com';
    const res = await axios.get(`${domain}/api/wxarticle/lib/all`);

    if(!res || res.status !== 200) {
      this.props.showAlert('出错了', res.data, false);
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
    if(!res || res.status !== 200) {
      this.props.showAlert('出错了', res.data, false);
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
    
    if(!res || res.status !== 200) {
      this.props.showAlert('出错了', res.data, false);
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
    
    if(!res || res.status !== 200) {
      this.props.showAlert('出错了', res.data, false);
    } else {
      this.props.showAlert('修改成功', "文章已不再展示于小程序", true);
      await this.initArticleList();
    }
  };

  async removeArticleFromLib(id) {
    const res = await axios.delete(`https://api.hulunbuirshell.com/api/wxarticle/lib/single/${id}`);
    
    if(!res || res.status !== 200) {
      this.props.showAlert('出错了', res.data, false);
    } else {
      this.props.showAlert('删除成功', "文章已从库中删除", true);
      this.showOrHideDelAlert(false)
      await this.initArticleList();
    }
  };

  async addArticleToDisplay(id) {
    const res = await axios.post(`https://api.hulunbuirshell.com/api/wxarticle/display/single/${id}`);
    
    if(!res || res.status !== 200) {
      this.props.showAlert('出错了', res.data, false);
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
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      articleInput: {
        ...this.state.articleInput,
        [name]: value
      }
    })
  };

  // TODO: temporary solution, will change to image upload later
  setImageUrl() {
    if(this.state.articleInput.thumb_tmp) {
      if(this.state.articleInput.thumb_tmp.indexOf("https://qiniu.hulunbuirshell.com/wxarticle-cover/") !== 0) {
        this.props.showAlert('非法图片', `${this.state.articleInput.thumb_tmp}不是合法的图片路径，不允许预览`, false);
        return false;
      } else {
        this.setState({
          articleInput: {
            thumb_url: this.state.articleInput.thumb_tmp
          }
        })
      }
    }
  };

  articleInputValidate() {
    let article = this.state.articleInput;
    if(!article.title || !article.url || !article.thumb_url) {
      this.props.showAlert('出错了', "所有内容都必填", false);
      return false;
    } else if(article.title === "" || article.url === "" || article.thumb_url === "") {
      this.props.showAlert('出错了', "所有内容都必填", false);
      return false;
    } else if(article.url.indexOf("https://mp.weixin.qq.com/s?__biz=MzIwMDAwOTc3MA") !== 0) {
      this.props.showAlert('非法链接', `${article.url}不是我司公众号的文章链接，不允许保存`, false);
      return false;
    } else if(article.thumb_url.indexOf("https://qiniu.hulunbuirshell.com/wxarticle-cover/") !== 0) {
      this.props.showAlert('非法图片', `${article.thumb_url}不是合法的图片路径，不允许保存`, false);
      return false;
    } else {
      return true;
    }
  }

  async confirmCreateArticleInLib() {
    const isValidInput = this.articleInputValidate();
    if(isValidInput) {
      const { title, url, thumb_url } = this.state.articleInput;
      const res = await axios({
        url: "https://api.hulunbuirshell.com/api/wxarticle/lib/single",
        method: "POST",
        data: {
          title,
          url,
          thumb_url
        }
      });
      
      if(!res || res.status !== 200) {
        this.props.showAlert('出错了', res.data, false);
      } else {
        this.props.showAlert('添加成功', "文章已加至文章库", true);
        this.showOrHideArticleNew(false);
        await this.initArticleList();
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
      const { article_id, title, url, thumb_url } = this.state.articleInput;
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
      
      if(!res || res.status !== 200) {
        this.props.showAlert('出错了', res.data, false);
      } else {
        this.props.showAlert('编辑成功', "文章内容已更新", true);
        this.showOrHideArticleEdit(false);
        await this.initArticleList();
      }
    }
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
                    <Form.Group className="mb-3">
                      <Form.Label>封面图片</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type="text" 
                          name="thumb_tmp"
                          placeholder="请填写"
                          defaultValue={this.state.articleInput.thumb_url || ""}
                          onChange = {this.onArticleInputChange.bind(this)}
                          />
                        <Button
                          onClick={() => this.setImageUrl()}
                          disabled={!this.state.articleInput.thumb_tmp || this.state.articleInput.thumb_tmp === ""}
                          >
                          确认图片
                        </Button>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        暂时先手填链接，后面改成图片上传
                      </Form.Text>
                    </Form.Group>
                  </Form>
                </Col>
                <Col style={{maxWidth: "300px"}}>
                  <Row style={{position: 'fixed', zIndex: "2", padding: "6px 0 0 22px"}}>
                    <h5>
                      <Badge variant="primary">
                        效果预览
                      </Badge>
                    </h5>
                  </Row>
                  <Card style={{backgroundColor: "#f0f0f0", maxHeight: "400px", overflow: "scroll", fontSize: "12px", color: "#808080"}}>
                    <Card.Header className="text-center">乘驾无忧</Card.Header>
                    <Card.Img 
                      variant="top" 
                      style={{width: "100%", objectFit: "cover", objectPosition: "center top", height: "400px"}}
                      src={this.state.articleInput.thumb_url} 
                    />
                    <Card.Body
                      style={{margin: "-220px 10px 10px 10px"}}
                    >
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px", borderRadius: "6px"}}>
                        【车型】【车牌号】
                      </Row>
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px", borderRadius: "6px"}}>
                        <Button 
                          variant="warning" 
                          style={{width: "100%"}}
                        >
                          查看保养记录
                        </Button>
                      </Row>
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px"}}>
                        近期养护提醒……
                      </Row>

                      <Row style={{marginTop: "6px"}}>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>关</Col>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>手</Col>
                        <Col style={{backgroundColor: "#ffffff", height: "75px", border: "#dddddd solid 1px"}}>联</Col>
                      </Row>
                      <Row style={{marginTop: "6px", padding: "6px"}}>
                        管理员操作
                      </Row>
                      <Row style={{marginTop: "6px"}}>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>查</Col>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>创</Col>
                        <Col style={{height: "60px"}}/>
                      </Row>
                      <Row style={{marginTop: "6px", padding: "6px"}}>
                        ……到底了
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            {this.state.articleInput.thumb_tmp && this.state.articleInput.thumb_url !== this.state.articleInput.thumb_tmp ?
              <div style={{color: "#F9D148"}}>
                填入了新的封面图片，请点击确认图片以生成预览。
              </div>
              : ""
            }
            <Button 
              variant="success" 
              onClick={() => this.confirmUpdateArticleInLib()}
              disabled={this.state.articleInput.thumb_tmp && this.state.articleInput.thumb_url !== this.state.articleInput.thumb_tmp}
            >
              保存
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
                    <Form.Group className="mb-3">
                      <Form.Label>封面图片</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type="text" 
                          name="thumb_tmp"
                          placeholder="请填写"
                          onChange = {this.onArticleInputChange.bind(this)}
                          />
                        <Button
                          onClick={() => this.setImageUrl()}
                          >
                          确认图片
                        </Button>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        暂时先手填链接，后面改成图片上传
                      </Form.Text>
                    </Form.Group>
                  </Form>
                </Col>
                <Col style={{maxWidth: "300px"}}>
                  <Row style={{position: 'fixed', zIndex: "2", padding: "6px 0 0 22px"}}>
                    <h5>
                      <Badge variant="primary">
                        效果预览
                      </Badge>
                    </h5>
                  </Row>
                  <Card style={{backgroundColor: "#f0f0f0", maxHeight: "400px", overflow: "scroll", fontSize: "12px", color: "#808080"}}>
                    <Card.Header className="text-center">乘驾无忧</Card.Header>
                    <Card.Img 
                      variant="top" 
                      style={{width: "100%", objectFit: "cover", objectPosition: "center top", height: "400px"}}
                      src={this.state.articleInput.thumb_url} 
                    />
                    <Card.Body
                      style={{margin: "-220px 10px 10px 10px"}}
                    >
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px", borderRadius: "6px"}}>
                        【车型】【车牌号】
                      </Row>
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px", borderRadius: "6px"}}>
                        <Button 
                          variant="warning" 
                          style={{width: "100%"}}
                        >
                          查看保养记录
                        </Button>
                      </Row>
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px"}}>
                        近期养护提醒……
                      </Row>

                      <Row style={{marginTop: "6px"}}>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>关</Col>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>手</Col>
                        <Col style={{backgroundColor: "#ffffff", height: "75px", border: "#dddddd solid 1px"}}>联</Col>
                      </Row>
                      <Row style={{marginTop: "6px", padding: "6px"}}>
                        管理员操作
                      </Row>
                      <Row style={{marginTop: "6px"}}>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>查</Col>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>创</Col>
                        <Col style={{height: "60px"}}/>
                      </Row>
                      <Row style={{marginTop: "6px", padding: "6px"}}>
                        ……到底了
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            {this.state.articleInput.thumb_tmp && this.state.articleInput.thumb_url !== this.state.articleInput.thumb_tmp ?
              <div style={{color: "#F9D148"}}>
                填入了新的封面图片，请点击确认图片以生成预览。
              </div>
              : ""
            }
            <Button 
              variant="success" 
              onClick={() => this.confirmCreateArticleInLib()}
              disabled={this.state.articleInput.thumb_tmp && this.state.articleInput.thumb_url !== this.state.articleInput.thumb_tmp}
            >
              保存
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
          backdrop="static"
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
                          <Badge variant="success">
                            标题
                          </Badge>
                        </h5>
                        {this.state.selectedArticle.title}
                      </Card.Title>
                      <hr/>
                      <Card.Text>
                        <h5>
                          <Badge variant="secondary">
                            公众号链接
                          </Badge>
                        </h5>
                        {this.state.selectedArticle.url? 
                          this.state.selectedArticle.url.length > 40 ? 
                            this.state.selectedArticle.url.slice(0, 39) + "..." 
                            : this.state.selectedArticle.url
                          : ""
                        }
                      </Card.Text>
                      <Button 
                        variant="primary"
                        onClick={() => this.openWxArticleLink(this.state.selectedArticle.url)}
                      >
                        查看文章
                      </Button>
                      <hr/>
                      <Card.Text>
                        <h5>
                          <Badge variant="warning">
                            封面图链接
                          </Badge>
                        </h5>
                        {this.state.selectedArticle.thumb_url? 
                          this.state.selectedArticle.thumb_url.length > 40 ? 
                            this.state.selectedArticle.thumb_url.slice(0, 39) + "..." 
                            : this.state.selectedArticle.thumb_url
                          : ""
                        }
                      </Card.Text>
                      <Image style={{width: "80px"}} src={this.state.selectedArticle.thumb_url} thumbnail />
                    </Card.Body>
                  </Card>
                </Col>
                <Col style={{maxWidth: "300px"}}>
                  <Row style={{position: 'fixed', zIndex: "2", padding: "6px 0 0 22px"}}>
                    <h5>
                      <Badge variant="primary">
                        效果预览
                      </Badge>
                    </h5>
                  </Row>
                  <Card style={{backgroundColor: "#f0f0f0", maxHeight: "400px", overflow: "scroll", fontSize: "12px", color: "#808080"}}>
                    <Card.Header className="text-center">乘驾无忧</Card.Header>
                    <Card.Img 
                      variant="top" 
                      style={{width: "100%", objectFit: "cover", objectPosition: "center top", height: "400px"}}
                      src={this.state.selectedArticle.thumb_url} 
                    />
                    <Card.Body
                      style={{margin: "-220px 10px 10px 10px"}}
                    >
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px", borderRadius: "6px"}}>
                        【车型】【车牌号】
                      </Row>
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px", borderRadius: "6px"}}>
                        <Button 
                          variant="warning" 
                          style={{width: "100%"}}
                        >
                          查看保养记录
                        </Button>
                      </Row>
                      <Row style={{marginTop: "6px", backgroundColor: "#ffffff", padding: "6px"}}>
                        近期养护提醒……
                      </Row>

                      <Row style={{marginTop: "6px"}}>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>关</Col>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>手</Col>
                        <Col style={{backgroundColor: "#ffffff", height: "75px", border: "#dddddd solid 1px"}}>联</Col>
                      </Row>
                      <Row style={{marginTop: "6px", padding: "6px"}}>
                        管理员操作
                      </Row>
                      <Row style={{marginTop: "6px"}}>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>查</Col>
                        <Col style={{backgroundColor: "#ffffff", marginRight: "6px", height: "75px", border: "#dddddd solid 1px"}}>创</Col>
                        <Col style={{height: "60px"}}/>
                      </Row>
                      <Row style={{marginTop: "6px", padding: "6px"}}>
                        ……到底了
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => this.showOrHideArticleDetail(false)}>
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
                <Button 
                  variant="warning"
                  disabled={!this.state.isOrderChanged}
                  onClick={() => this.updateDisplayOrder()}
                >
                  确认修改顺序
                </Button>
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
                          <Image style={{width: "80px", height: "110px", objectFit: "cover"}} src={item.thumb_url} thumbnail />
                        </Col>
                        <Col style={{minWidth: "220px", borderLeft: "#dddddd solid 1px", display: "flex", alignItems: "center"}}>
                          <h5>{item.title}</h5>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={2} style={{minWidth: "220px", borderLeft: "#dddddd solid 1px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <ButtonGroup style={{marginRight: "6px"}}>
                        <Button 
                          variant={this.state.wxArticleDisplayList.length - 1 === item.order ? 'secondary' : 'success'}
                          disabled={this.state.wxArticleDisplayList.length - 1 === item.order}
                          onClick={() => this.changeDisplayOrder(this.state.wxArticleDisplayList.indexOf(item), true)}
                        >
                          ↑
                        </Button>
                        <Button 
                          variant={item.order === 0 ? 'secondary' : 'primary'}
                          disabled={item.order === 0}
                          onClick={() => this.changeDisplayOrder(this.state.wxArticleDisplayList.indexOf(item), false)}
                        >
                          ↓
                        </Button>
                      </ButtonGroup>
                      <Button 
                        variant='danger'
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
                          <Image style={{width: "80px", height: "110px", objectFit: "cover" }} src={item.thumb_url} thumbnail />
                        </Col>
                        <Col style={{minWidth: "220px", borderLeft: "#dddddd solid 1px", display: "flex", alignItems: "center", color: "#808080"}}>
                          <h5>{item.title}</h5>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={2} style={{minWidth: "220px", borderLeft: "#dddddd solid 1px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <Button 
                        variant= {item.isDisplay ? 'secondary' : 'success'}
                        disabled={item.isDisplay}
                        style={{marginRight: "6px"}}
                        onClick={() => this.addArticleToDisplay(item.article_id)}
                      >
                        展示
                      </Button>
                      <Button 
                        variant='info'
                        style={{marginRight: "6px"}}
                        onClick={() => this.showOrHideArticleEdit(true, item)}
                      >
                        编辑
                      </Button>
                      <Button 
                        variant={item.isDisplay ? 'secondary' : 'danger'}
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
      </div>
    );
  }
}

export default WxArticle;