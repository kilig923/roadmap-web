import React, { useState } from 'react';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, message, Upload, Modal } from 'antd';
import './index.css';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  },
  onDrop(e) {
    console.log('拖拽文件', e.dataTransfer.files);
  },
};

export default function Uploadfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="upload-page-container">
      <Button type="primary" onClick={showModal}>
        批量导入
      </Button>
      <Modal title="批量导入" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持excel文件（后缀为*.xlsx/*.xls）或csv文件（后缀为*.csv）
          </p>
        </Dragger>
      </Modal>
    </div>
  );
}
