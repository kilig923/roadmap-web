import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Business from './pages/Business';
import Retrieval from './pages/Retrieval';
import Thesaurus from './pages/Thesaurus';
import Organization from './pages/Organization';
import Word from './pages/Word';
import { menuItems } from './constants';
import './App.css';

const App = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClickMenuItem = useCallback(
    (e) => {
      navigate(e?.key);
    },
    [navigate]
  );

  useEffect(() => {
    setSelectedKeys([pathname.slice(1)]);
  }, [pathname]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: '75px',
        }}
      >
        <Menu
          className="roadmap-menu"
          theme="dark"
          mode="horizontal"
          items={menuItems}
          onClick={handleClickMenuItem}
          onSelect={({ key }) => {
            navigate(key);
          }}
          selectedKeys={selectedKeys}
        />
        <img
          src="https://img.js.design/assets/img/647744811bb29d226c59d760.png#d568d115841aa033c547a7d8f3416466"
          style={{ width: '280px', height: '50px' }}
        ></img>
      </Layout.Header>
      <Routes>
        <Route index element={<Retrieval />} />
        <Route path={menuItems[0].key} element={<Business />} />
        <Route path={menuItems[1].key} element={<Retrieval />} index />
        <Route path={menuItems[2].key} element={<Thesaurus />} />
        <Route path={menuItems[3].children[0].key} element={<Organization />} />
        <Route path={menuItems[3].children[1].key} element={<Word />} />
      </Routes>
    </Layout>
  );
};

export default App;
