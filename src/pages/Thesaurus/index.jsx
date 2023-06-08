import React, { useState, useEffect } from 'react';
import { Tabs, Divider, message } from 'antd';
import { WordTable } from '../../components/info';
import { Link } from 'react-router-dom';
import './index.css';
import axios from 'axios';

import { ThesaurusColumns } from '../../constants/columns';

const BASE_URL = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/27835';

export default function Thesaurus() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const onChange = (key) => {
    const label = items.filter((item) => item.key === key)[0]['label'];
    const dataFromAll = allData.filter((item) => item.category === label);
    setData(dataFromAll);
  };

  const getAllBusinessNoun = async () => {
    let data;
    await axios
      .post(`${BASE_URL}/businessNounGetAll`, {
        limit: 10000,
      })
      .then((response) => {
        data = response.data.businessNoun;
      })
      .catch((error) => console.log(error));

    return data;
  };

  useEffect(() => {
    getAllBusinessNoun().then(response => {
      setAllData(response)
      const dd = response.filter(item => item.category === '商户资源类');
      setData(dd);
    })
    .catch(err => {
      message.error('获取数据失败');
      console.log ('获取业务名词数据失败', err);
    })
  }, []);

  const items = [
    {
      label: '商户资源类',
      children: '',
      key: 'resources',
    },
    {
      label: '平台规则类',
      children: '',
      key: 'rules',
    },
    {
      label: '用户服务类',
      children: '',
      key: 'service',
    },
    {
      label: '数据指标类',
      children: '',
      key: 'index',
    },
    {
      label: '工具类',
      children: '',
      key: 'tool',
    },
  ];

  return (
    <div className="thesaurus-container">
      <div className="thesaurus-tabs-container">
        <Link to={`/retrieval`}><img src="https://img.js.design/assets/img/647840ed4ad0ee9fa531ef96.png#26cdd121a496856c255e2c8b8b78b7b0"/></Link>
        <Tabs className="thesaurus-tabs" defaultActiveKey="resources" items={items} onChange={onChange} />
      </div>
      <Divider style={{ borderWidth: '2px', color: 'black' }} />
      <div className="thesaurus-table-container">
        <WordTable columns={ThesaurusColumns} data={data}></WordTable>
      </div>
    </div>
  );
}
