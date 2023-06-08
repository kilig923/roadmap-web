import {
  Input,
  Form,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Modal,
  message,
  Upload,
  Space,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { BiUser, BiBookBookmark } from 'react-icons/bi';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import './index.css';

const { Option } = Select;

const BASE_URL = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/27835';

const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export function UserTableEdit(props) {
  const { columns, originData, tableTitle } = props;
  const [form] = Form.useForm();
  const [selectData, setSelectData] = useState(originData);
  const [count, setCount] = useState(100);
  const [editingKey, setEditingKey] = useState('');
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [isModalOpenAdd, setIsModelOpenAdd] = useState(false);

  useEffect(() => {
    setSelectData(originData);
  });

  const isEditing = (record) => record.id === editingKey;

  const deleteRecord = (record) => {
    const {id, title} = record;
    {
      tableTitle === '组织架构'
        ? axios({
            method: 'post',
            url: `${BASE_URL}/organizationDelete`,
            data: {
              id: id,
            },
          })
            .then((response) => {
              const { Ack } = response['data']['ResponseStatus'];
              if (Ack === 'Success') {
                message.success('删除成功');
                window.location.reload();
              } else message.error('删除失败');
            })
            .catch((error) => {
              message.error('删除失败');
              console.log('删除失败', error);
            })
        : axios({
            method: 'post',
            url: `${BASE_URL}/businessNounDelete`,
            data: {
              title: title,
            },
          })
            .then((response) => {
              const { Ack } = response['data']['ResponseStatus'];
              if (Ack === 'Success') {
                message.success('删除成功');
                window.location.reload();
              } else message.error('删除失败');
            })
            .catch((error) => {
              message.error('删除失败');
              console.log('删除失败', error);
            });
    }
  };

  const editRecord = async (info) => {
    {
      tableTitle === '组织架构'
        ? await axios
            .post(`${BASE_URL}/organizationAddOne`, {
              empInfos: [info],
            })
            .then((response) => {
              console.log(response);
              const { Ack } = response['data']['ResponseStatus'];
              if (Ack === 'Success') message.success('修改成功');
              else message.error('修改失败');
            })
            .catch((error) => {
              message.error('修改失败');
              console.log(error);
            })
        : await axios
            .post(`${BASE_URL}/businessNounAdd`, {
              businessNouns: [info],
            })
            .then((response) => {
              console.log(response);
              const { Ack } = response['data']['ResponseStatus'];
              if (Ack === 'Success') message.success('修改成功');
              else message.error('修改失败');
            })
            .catch((error) => {
              console.log(error);
              message.error('修改失败');
            });
    }
  };

  const edit = (record) => {
    tableTitle === '组织架构'
      ? form.setFieldsValue({
          name: '',
          content: '',
          type: '',
          group: '',
          leader: '',
          ...record,
        })
      : form.setFieldsValue({
          word: '',
          glossary: '',
          team: '',
          document: '',
          importance: '',
          ...record,
        });
    setEditingKey(record.id);
    setCount(count + 1);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...selectData];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        editRecord(row);
        setSelectData(newData);
        setEditingKey('');
        window.location.reload();
      } else {
        newData.push(row);
        addRecord(row);
        setSelectData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = async (id) => {
    const newData = selectData.filter((item) => item.id !== id);
    deleteRecord(id);
    setSelectData(newData);
    // window.location.reload();
  };

  const addRecord = async (info) => {
    {
      tableTitle === '组织架构'
        ? await axios
            .post(`${BASE_URL}/organizationAddOne`, {
              empInfos: [Object.assign(info, { id: 0 })],
            })
            .then((response) => {
              const { Ack } = response['data']['ResponseStatus'];
              if (Ack === 'Success') message.success('添加成功');
              else message.error('添加失败');
            })
            .catch((error) => {
              message.error('添加失败');
              console.log(error);
            })
        : await axios
            .post(`${BASE_URL}/businessNounAdd`, {
              businessNouns: [Object.assign(info, { id: 0 })],
            })
            .then((response) => {
              console.log(response);
              const { Ack } = response['data']['ResponseStatus'];
              if (Ack === 'Success') message.success('添加成功');
              else message.error('添加失败');
            })
            .catch((error) => {
              console.log(error);
              message.error('添加失败');
            });
    }
  };

  const onFinish = (value) => {
    // 获取表单提交的数据
    console.log ('value', value);
    addRecord(value);
  };

  const onFinishFailed = (error) => {
    console.log('表单提交失败', error);
    message.error('表单提交失败');
  };

  const normFile = (e) => {
    console.log('上传事件：', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleCancel = () => {
    setIsModelOpen(false);
  };

  const showModalAdd = () => {
    setIsModelOpenAdd(true);
  };

  const handleCanelAdd = () => {
    setIsModelOpenAdd(false);
  };

  const propsFile = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const operationObject = {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    className: 'table-columns',
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Typography.Link
            onClick={() => save(record.id)}
            style={{
              marginRight: 8,
            }}
          >
            保存
          </Typography.Link>
          <Popconfirm title="你确定要取消吗?" onConfirm={cancel}>
            <a>取消</a>
          </Popconfirm>
        </span>
      ) : (
        <div className="operation-toolbar">
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: '10px' }}>
            编辑
          </Typography.Link>
          <Popconfirm title="你确定要删除吗?" onConfirm={() => handleDelete(record)}>
            <a style={editingKey !== '' ? { color: 'rgba(0, 0, 0, 0.25)' } : { color: 'red' }}>删除</a>
          </Popconfirm>
        </div>
      );
    },
  };

  const mergedColumns = [...columns, operationObject].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <div className="edittable-toolbar">
        {tableTitle === '组织架构' ? (
          <div className="organization-user">
            <BiUser /> 组织架构
          </div>
        ) : (
          <div className="word-user">
            <BiBookBookmark /> 名词解释
          </div>
        )}
        <div className="organization-button">
          <Button type="link" onClick={showModalAdd}>
            添加记录
          </Button>
        </div>
        <Modal title="批量导入" open={isModalOpen} footer={null} onCancel={handleCancel}>
          <Form>
            <Form.Item>
              <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                <Upload.Dragger name="files" {...propsFile}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">支持excel文件（*.xlsx/*.xls）或csv文件（*.csv）</p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                span: 12,
                offset: 9,
              }}
            >
              <Space>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button htmlType="reset">重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
        <Modal title="添加记录" open={isModalOpenAdd} footer={null} maskClosable={true} onCancel={handleCanelAdd}>
          <div className="message">tip:添加成功后请及时刷新~</div>
          {tableTitle === '组织架构' ? (
            <Form layout="vertical" onFinish={onFinish} autoComplete="off">
              <Form.Item
                label="工号"
                name="empId"
                rules={[
                  {
                    required: true,
                    message: '请输入工号',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="姓名"
                name="empName"
                rules={[
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="负责内容"
                name="business"
                rules={[
                  {
                    required: true,
                    message: '请输入负责内容',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="职能类型"
                name="position"
                rules={[
                  {
                    required: true,
                    message: '请输入职能类型',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="所属组"
                name="workGroup"
                rules={[
                  {
                    required: true,
                    message: '请输入所属组',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="直属上级"
                name="supervisorName"
                rules={[
                  {
                    required: true,
                    message: '请输入所属组',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  span: 12,
                  offset: 8,
                }}
              >
                <Space>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
              <Form.Item
                name="category"
                label="类别"
                rules={[
                  {
                    required: true,
                    message: '请输入类别',
                  },
                ]}
                initialValue="商户资源类"
              >
                <Select defaultValue="商户资源类">
                  <Option value="商户资源类">商户资源类</Option>
                  <Option value="平台规则类">平台规则类</Option>
                  <Option value="用户服务类">用户服务类</Option>
                  <Option value="数据指标类">数据指标类</Option>
                  <Option value="工具类">工具类</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="title"
                label="名词"
                rules={[
                  {
                    required: true,
                    message: '请输入名词',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="名词解释"
                rules={[
                  {
                    required: true,
                    message: '请输入名词解释',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="team"
                label="相关团队"
                rules={[
                  {
                    required: true,
                    message: '请输入相关团队',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="document"
                label="相关文档"
                rules={[
                  {
                    required: true,
                    message: '请输入相关文档',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="importance"
                label="重要程度"
                rules={[
                  {
                    required: true,
                    message: '请输入重要程度',
                  },
                ]}
                initialValue="P0"
              >
                <span>
                  <Select value="P0">
                    <Option value="P0">P0</Option>
                    <Option value="P1">P1</Option>
                    <Option value="P2">P2</Option>
                  </Select>
                </span>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  span: 12,
                  offset: 8,
                }}
              >
                <Space>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={selectData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            position: ['bottomCenter'],
            hideOnSinglePage: true
          }}
          rowKey={(data) => data.id}
        />
      </Form>
    </div>
  );
}

// <Button type="link" onClick={showModal}>
//             批量导入
//           </Button>
