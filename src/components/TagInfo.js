import React from 'react';
import { Descriptions } from 'antd';

const TagInfo = ({ info: { moduleDefinition = '', teamLink = '', docLink = '' } }) => {
  return (
    <Descriptions column={1}>
      <Descriptions.Item label="描述">{moduleDefinition}</Descriptions.Item>
      <Descriptions.Item label="团队">
        <a>{teamLink}</a>
      </Descriptions.Item>
      <Descriptions.Item label="文档">
        <a>{docLink}</a>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TagInfo;
