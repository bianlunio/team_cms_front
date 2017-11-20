import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import styles from './index.less';

class MotionTable extends PureComponent {

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '辩题名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: () => (
          <div>
            <a href="">编辑</a>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.motionTable}>
        <Table
          loading={loading}
          rowKey={record => record.key}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default MotionTable;
