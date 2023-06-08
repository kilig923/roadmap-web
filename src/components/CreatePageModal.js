import React, { useState, useCallback, useContext, useImperativeHandle, forwardRef } from 'react';
import { Form, Input, Select, Upload, message, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Context from '../context';
import { readImageAsArray, fetcher } from '../utils';
import { buOptions } from '../constants';

const CreatePageModal = forwardRef(function CreatePageModal(props, ref) {
  const { setPageItems } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => {
      return {
        show: () => {
          setIsModalOpen(true);
        },
      };
    },
    []
  );

  const cancelModal = useCallback(() => {
    form.resetFields();
    setFileList([]);
    setIsModalOpen(false);
  }, [form]);

  const onSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        const pagePicture = await readImageAsArray(fileList[0]);
        const request = {
          businessId: 0,
          bU: form.getFieldValue('bU'),
          pageName: form.getFieldValue('pageName'),
          pagePicture,
          fileName: 'file.png',
        };
        const {
          ResponseStatus: { Ack },
        } = await fetcher('businessAdd', { businessInfoAdd: request });
        cancelModal();
        if (Ack === 'Success') {
          message.success('添加成功!');
          const { businessInfos: pageItems } = await fetcher('businessGetList');
          setPageItems(pageItems);
        } else {
          message.error('添加失败!');
        }
      })
      .catch(() => {});
  }, [fileList, form, setPageItems, cancelModal]);

  const beforeUploadImage = useCallback((file) => {
    if (file.type !== 'image/png') {
      message.error('当前仅支持上传png格式的图片!');
    } else {
      setFileList([file]);
    }
    return false;
  }, []);

  return (
    <Modal title="新建业务" okText="确定" cancelText="取消" open={isModalOpen} onOk={onSubmit} onCancel={cancelModal}>
      <Form form={form} validateMessages={{ required: '${label}为必需项' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Form.Item
            name="bU"
            label="部门"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select style={{ minWidth: 120 }} options={buOptions} />
          </Form.Item>
          <Form.Item
            name="pageName"
            label="页面名称"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <Form.Item
          name="pagePicture"
          label="页面图片"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Upload.Dragger
            fileList={fileList}
            beforeUpload={beforeUploadImage}
            showUploadList={{ showRemoveIcon: false }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
              files.
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreatePageModal;
