import React, {useState, useEffect } from 'react';
import { Input, Divider, message } from 'antd';
import { UserTableEdit } from '../../components/tableedit';
import axios from 'axios';
import './index.css';

import { ThesaurusEditColumns } from '../../constants/columns';

const { Search } = Input;

const BASE_URL = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/27835';

export default function Organization() {
  const [wordData, setWordData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchState, setSearchState] = useState(false);

  const getBusinessNoun = async(title) => {
    let data;
    await axios.post(`${BASE_URL}/businessNounGet`, {
      title: title,
    }).then(response => {
      data = response.data.businessNouns;
    })
    .catch(error => console.log (error));

    return data
  };

  const onSearch = (value) => {
    console.log (value);
    {
      !value ? getBusinessNounAll().then(response => setSearchData(response)) :
      getBusinessNoun(value).then(response => {
        console.log (response);
        setSearchData(response)
      })
    }
    setSearchValue(value);
    setSearchState(true);
  };

  const getBusinessNounAll = async() => {
    let data;
    await axios.post(`${BASE_URL}/businessNounGetAll`, {
      limit: 100
    }).then(response => {
      data = response.data.businessNoun;
    })
    .catch(error => console.log (error));

    return data
  };


  useEffect(() => {
    getBusinessNounAll().then(response => setWordData(response))
    .catch(err => {
      message.error('获取数据失败');
      console.log ('获取业务名词数据失败', err);
    })
  }, [])

  return (
    <div className='word-page-container'>
      <div className='word-page-search-container'>
      <Search
        className="word-page-search search-container-after"
        placeholder="请输入你要搜索的名词..."
        onSearch={onSearch}
        enterButton
        defaultValue={searchValue}
      />
      </div>
      <Divider style={{borderWidth:'2px', color:'black'}}/>
      {
        !searchState ?
        <UserTableEdit columns={ThesaurusEditColumns} originData={wordData} tableTitle='业务名词'/>
        : <UserTableEdit tableTitle='业务名词' columns={ThesaurusEditColumns} originData={searchData}/>
      }
    </div>
  )
}
