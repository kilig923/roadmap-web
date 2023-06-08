import React, { useState, useRef, useCallback, useContext } from 'react';
import { useImmer } from 'use-immer';
import { Button, Divider, Space, Menu, Dropdown, AutoComplete, Input, message, Modal } from 'antd';
import {
  ExclamationCircleFilled,
  SettingOutlined,
  SearchOutlined,
  FileAddOutlined,
  DeleteOutlined,
  ShrinkOutlined,
  ArrowsAltOutlined,
} from '@ant-design/icons';
import CreatePageModal from './CreatePageModal';
import Context from '../context';
import { buOptions } from '../constants';
import { formatItems, fetcher } from '../utils';

const PageMenu = ({ editable = false }) => {
  const { pageItems, selectedPageItem, setPageItems, setSelectedPageItem, setTagItems, setSelectedTagItem } =
    useContext(Context);
  const [options, setOptions] = useState([]);
  const [openKeys, setOpenKeys] = useImmer([selectedPageItem?.bU]);
  const modalRef = useRef(null);

  const changePage = useCallback(
    async (pageId) => {
      const pageInfo = pageItems.find((page) => page.businessId === pageId);
      setSelectedPageItem(pageInfo);
      const { tagInfos: tagItems } = await fetcher('tagGet', { imageId: pageInfo?.businessId });
      setTagItems(tagItems);
      setSelectedTagItem(tagItems?.[0]);
    },
    [pageItems, setSelectedPageItem, setSelectedTagItem, setTagItems]
  );

  const onSearch = useCallback(
    (text) => {
      const result = [];
      if (text) {
        pageItems.forEach(({ bU, businessId, pageName, pagePicture }) => {
          if (pageName?.includes(text)) result.push({ label: pageName, value: pageName, businessId, bU, pagePicture });
        });
      }
      setOptions(result);
    },
    [pageItems]
  );

  const selectOption = useCallback(
    async (value, option) => {
      setOpenKeys((draft) => {
        if (!draft.includes(option.bU)) draft.push(option.bU);
      });
      changePage(option?.businessId);
    },
    [setOpenKeys, changePage]
  );

  const deletePage = useCallback(() => {
    if (!selectedPageItem?.businessId) return;
    if (pageItems.length < 2) {
      message.error('仅剩1个页面时无法删除!');
      return;
    }
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      title: `是否确定删除${selectedPageItem?.pageName}?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const {
          ResponseStatus: { Ack },
        } = await fetcher('businessDelete', { imageId: selectedPageItem?.businessId });
        if (Ack === 'Success') {
          message.success('删除成功!');
          const { businessInfos: pageItems } = await fetcher('businessGetList');
          setPageItems(pageItems);
          changePage(pageItems[0]?.businessId);
        } else {
          message.error('删除失败!');
        }
      },
    });
  }, [pageItems, selectedPageItem, setPageItems, changePage]);

  return (
    <>
      <Space style={{ padding: 16, paddingBottom: 0 }}>
        <AutoComplete options={options} onSearch={onSearch} onSelect={selectOption}>
          <Input prefix={<SearchOutlined />} allowClear placeholder="页面名称" />
        </AutoComplete>
        {editable ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'create',
                  label: '新建业务',
                  icon: <FileAddOutlined />,
                },

                {
                  key: 'delete',
                  label: '删除业务',
                  icon: <DeleteOutlined />,
                },
                {
                  key: 'unfold',
                  label: '展开所有业务',
                  icon: <ArrowsAltOutlined />,
                },
                {
                  key: 'fold',
                  label: '折叠所有业务',
                  icon: <ShrinkOutlined />,
                },
              ],
              onClick: ({ key }) => {
                if (key === 'create') modalRef.current?.show();
                if (key === 'delete') deletePage();
                if (key === 'unfold') setOpenKeys(buOptions.map((bU) => bU.value));
                if (key === 'fold') setOpenKeys([]);
              },
            }}
          >
            <Button type="text" shape="circle" size="small" icon={<SettingOutlined />} />
          </Dropdown>
        ) : null}
        <CreatePageModal ref={modalRef} />
      </Space>
      <Divider />
      <Menu
        mode="inline"
        items={formatItems(pageItems)}
        openKeys={openKeys}
        selectedKeys={[String(selectedPageItem?.businessId)]}
        onOpenChange={(openKeys) => {
          setOpenKeys(openKeys);
        }}
        onSelect={({ key }) => {
          changePage(Number(key));
        }}
      />
    </>
  );
};

export default PageMenu;
