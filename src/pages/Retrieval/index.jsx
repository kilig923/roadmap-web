import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Divider } from 'antd';
import { BiUser, BiBookBookmark } from 'react-icons/bi';
import { UserTable } from '../../components/info';
import axios from 'axios';
import './index.css';

const { Search } = Input;

import { RetrievalColumns, ThesaurusColumns } from '../../constants/columns';

const BASE_URL = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/27835';

export default function Retrieval() {
  const [searchState, setSearchState] = useState(false);
  const [title, setTitle] = useState('');
  const [wordData, setWordData] = useState([]);
  const [organizationData, setOrganizationData] = useState([]);

  const getBusinessNoun = async (title) => {
    let data;
    await axios
      .post(`${BASE_URL}/businessNounGet`, {
        title: title,
      })
      .then((response) => {
        data = response.data.businessNouns;
      })
      .catch((error) => console.log(error));

    return data;
  };

  const getOrganization = async (title) => {
    let data;
    await axios
      .post(`${BASE_URL}/organizationGetOne`, {
        empName: title,
      })
      .then((response) => {
        data = response.data.empInfos;
      })
      .catch((error) => console.log(error));

    return data;
  };

  const onSearch = (value) => {
    getBusinessNoun(value).then((response) => setWordData(response));
    getOrganization(value).then((response) => setOrganizationData(response));
    setTitle(value);
    setSearchState(true);
  };

  // useState(() => {
  //   getBusinessNoun(title).then(response => console.log('直采搜索结果', response))
  //   .catch(error => console.log(error))
  // });

  const returnSearch = () => {
    setSearchState(false);
  };

  return (
    <div>
      {!searchState ? (
        <div className="search-before">
          <div className="img-container">
            <span>有问</span>
            <img 
              src="https://img.js.design/assets/img/647741234609838c9a524f21.png#2809c45209f3dd9b226e9b1409c848ba"
            ></img>
            <span>必答</span>
          </div>
          <Search
            className="retrieval-page-search search-container"
            placeholder="请输入你要搜索的业务内容或负责人姓名..."
            onSearch={onSearch}
            enterButton
          />
          <div>
            <span className="search-info">可以搜索</span>
            <span className="search-info-key">业务名词</span>
            <span className="search-info">及对应</span>
            <span className="search-info-key">负责人</span>
            <span className="search-info">哦~</span>
          </div>
          <Button className="retrieval-page-button">
            <Link to={`/thesaurus`}>查看所有业务名词</Link>
          </Button>
        </div>
      ) : (
        <div className="search-after">
          <div className="search-after-search">
            <img src="https://img.js.design/assets/img/647741234609838c9a524f21.png#2809c45209f3dd9b226e9b1409c848ba" onClick={returnSearch}></img>
            <Search
              className="retrieval-page-search search-container-after"
              placeholder="请输入你要搜索的业务内容或负责人姓名..."
              onSearch={onSearch}
              enterButton
              defaultValue={title}
            />
          </div>
          <Divider style={{ borderWidth: '2px', color: 'black' }} />
          <div className="table-title-user">
            <BiUser /> 负责人
          </div>
          <div className="table-container" style={{ backgroundColor: 'rgba(42, 130, 228, 0.05)' }}>
            <UserTable className="user-table" columns={RetrievalColumns} data={organizationData}></UserTable>
          </div>
          <div className="table-title-book" style={{ marginTop: '50px' }}>
            <BiBookBookmark /> 相关知识
          </div>
          <div className="table-container" style={{ backgroundColor: 'rgba(255, 195, 0, 0.07)' }}>
            <UserTable className="user-table" columns={ThesaurusColumns} data={wordData}></UserTable>
          </div>
        </div>
      )}
    </div>
  );
}
