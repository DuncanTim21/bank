import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { List, Modal, Input, Form, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';


const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;



const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};



const passwordStrength = {
  strong: <font className="strong">强</font>,
  medium: <font className="medium">中文</font>,
  weak: <font className="weak">弱</font>,
};
@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class SecurityView extends Component {
  state = {
    // visible: false,
    count: 0,
    confirmDirty: false,
    visibleModel: false,
    visible: false,
    help: '',
    // value :''

 
  };

  // 定义的初始值
  getInitialState(){
    return {
      formData: {
        oldPassword: undefined,
        newPassword1: undefined,
        newPassword2: undefined,
      }
    };
  }
  

  


  
  

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword1');
    
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    const value = form.getFieldValue('newPassword1');
    console.log('点击了确定',
    value
  );
    this.setState({
      visibleModel: false,
    });
    this.props.form.validateFields({ force: true }, (err, values) => {
    console.log(values);
    
      
      if (!err) {
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword1')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['newPassword2'], { force: true });
        }
        callback();
      }
    }
  };

  

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword1');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  
  
  showModal(){
  
    
    this.setState({
      visibleModel:true,
      // value: ''
    })
  };

  //确认按钮功能
  handleOk() {

    // const { form } = this.props;
    // const value = form.getFieldValue('newPassword1');
    // console.log('点击了确定',
    // // this.props.form.getFieldsValue().oldPassword,
    // // this.props.form.getFieldsValue().newPassword1,
    // // this.props.form.getFieldsValue().newPassword2
    // value
  // );
    
    // this.props.form.setFieldsValue,    
    this.setState({
      visibleModel: false,
      // value: ''
      

    });
  }
  handleCancel() {
    // console.log('点击了取消');
    // this.props.form.setFieldsValue,
    
    this.setState({
      
      visibleModel: false,
      visible : false
    });
    // console.log(value);    
  };
  getData = () => {
    return [
      {
        title: '账户密码',
        description: (
          <Fragment> 当前密码强度：{passwordStrength.strong}</Fragment>
        ),
        actions: [<a onClick={this.showModal.bind(this)}>修改</a>],
      },
      {
        title: '密保手机',
        description: '已绑定手机：138****8293',
        actions: [<a>修改</a>],
      },
      {
        title: '密保问题',
        description: '未设置密保问题，密保问题可有效保护账户安全',
        actions: [<a>设置</a>],
      },
      {
        title: '备用邮箱',
        description: '已绑定邮箱：ant***sign.com',
        actions: [<a>修改</a>],
      },
      {
        title: 'MFA 设备',
        description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
        actions: [<a>绑定</a>],
      },
    ];
  };
  render() {
    const { form,submitting} = this.props;
    // console.log(this.props.form,'this.props.form///')
    const { getFieldProps, }=this.props.form;
   const{getFieldDecorator}=form
    // console.log(this.props.form);
    const formData = this.state.formData;
    
    return (
      
      <Fragment >
        <Modal title="修改密码"
            visible={this.state.visibleModel}
            onOk={this.handleSubmit.bind(this) }
            // confirmLoading={this.state.confirmLoading}
             onCancel={this.handleCancel.bind(this)}
            >
            <Form horizontal='true' onSubmit={this.handleSubmit}>
            <FormItem
              id="oldPassword"
              label="原密码："
              required>
              <Input 
                type="password" 
                placeholder="请输入密码" 
              {...getFieldProps('oldPassword')}/>
            </FormItem>
            <FormItem 
              id="newPassword1"
              label="新密码：" 
              help={this.state.help}
              required 
            >
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('newPassword1', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="至少6位密码，区分大小写"
                  // {...getFieldProps('newPassword1')}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem label="确认密码：" 
            id="newPassword2" 
            required>
            
            {getFieldDecorator('newPassword2', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input 
                size="large" 
                type="password" 
                placeholder="确认密码" 
                // {...getFieldProps('newPassword2')}
                />
              )}
          </FormItem>
          </Form>
        </Modal>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}
