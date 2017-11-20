import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Card, Col, Form, Input, message, Modal, Row, Select} from 'antd';
import StandardTable from '../../components/MotionTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './MotionList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class MotionList extends PureComponent {
  state = {
    motionName: '',
    motionZheng: '',
    motionFan: '',
    modalVisible: false,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAddMotion = (e) => {
    this.setState({
      motionName: e.target.value,
    });
  }

  handleAddMotionZheng = (e) => {
    this.setState({
      motionZheng: e.target.value,
    });
  }

  handleAddMotionFan = (e) => {
    this.setState({
      motionFan: e.target.value,
    });
  }

  handleAdd = () => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        name: this.state.motionName,
        zheng: this.state.motionZheng,
        fan: this.state.motionFan,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="辩题关键词">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="筛选标签">
              {getFieldDecorator('tags')(
                <Select placeholder="待开发" style={{ width: '100%' }}>
                  <Option value="0">比较性辩题</Option>
                  <Option value="1">政策辩</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { rule: { loading: ruleLoading, data } } = this.props;
    const { modalVisible, motionName, motionZheng, motionFan } = this.state;

    return (
      <PageHeaderLayout title="辩题列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加
              </Button>
            </div>
            <StandardTable
              loading={ruleLoading}
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="添加辩题"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="辩题"
            required
          >
            <Input placeholder="请输入（例：以暴制暴是不是正义）" onChange={this.handleAddMotion} value={motionName} />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="正方持方"
            required
          >
            <Input placeholder="请输入（例：以暴制暴是正义）" onChange={this.handleAddMotionZheng} value={motionZheng} />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="反方持方"
            required
          >
            <Input placeholder="请输入（例：以暴制暴不是正义）" onChange={this.handleAddMotionFan} value={motionFan} />
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
