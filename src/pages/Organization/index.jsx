import React, { useState, useEffect } from 'react';
import { Input, Divider, message } from 'antd';
import { UserTableEdit } from '../../components/tableedit';
import axios from 'axios';
import './index.css';

import { RetrievalEditColumns } from '../../constants/columns';

const { Search } = Input;

const BASE_URL = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/27835';

export default function Organization() {
  const [organizationData, setOrganizationData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchState, setSearchState] = useState(false);


  const getOrganizationOne = async(searchValue) => {
    let data;
    await axios.post(`${BASE_URL}/organizationGetOne`, {
      empName: searchValue,
    }).then(response => {
      data = response.data.empInfos;
    })
    .catch(error => console.log(error));

    return data
  };

  const onSearch = (value) => {
    {
      ! value ? 
       getOrganizationAll() .then(response => setSearchData(response)): 
       getOrganizationOne(value).then(response => setSearchData(response))
    }
    setSearchValue(value);
    setSearchState(true);
  };
  

  const getOrganizationAll = async() => {
    let data;
    await axios.post(`${BASE_URL}/organizationGetAll`, {
      limit: 10000
    }).then(response => {
      data = response.data.groupInfo;
    })
    .catch(error => console.log (error));

    return data
  };

  useEffect(() => {
    getOrganizationAll().then(response => setOrganizationData(response))
    .catch(err => {
      message.error('获取数据失败');
      console.log ('获取组织架构信息数据失败', err);
    })
  }, [])
  
  return (
    <div className='organization-page-container'>
      <div className='organization-page-search-container'>
      <Search
        className="organization-page-search search-container-after"
        placeholder="请输入你要搜索的姓名..."
        onSearch={onSearch}
        enterButton
        defaultValue={searchValue}
      />
      </div>
      <Divider style={{borderWidth:'2px', color:'black'}}/>
      {
        !searchState ? <UserTableEdit tableTitle='组织架构' columns={RetrievalEditColumns} originData={organizationData}/> 
        : <UserTableEdit tableTitle='组织架构' columns={RetrievalEditColumns} originData={searchData}/>
      }
    </div>
  )
}
