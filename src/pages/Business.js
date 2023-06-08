import React, { useState, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { Button, Image, Layout, FloatButton } from 'antd';
import { PushpinFilled, EditOutlined } from '@ant-design/icons';
import Context from '../context';
import PageMenu from '../components/PageMenu';
import TagCollapse from '../components/TagCollapse';
import { fetcher } from '../utils';
// import { queryPages } from '../__mocks__/queryPages';
// import { queryTags } from '../__mocks__/queryTags';

const Business = ({ theme = 'light' }) => {
  const [editable, setEditable] = useState(false);
  const [pageItems, setPageItems] = useImmer([]);
  const [selectedPageItem, setSelectedPageItem] = useState(null);
  const [tagItems, setTagItems] = useImmer([]);
  const [selectedTagItem, setSelectedTagItem] = useState(null);
  const tagCollapseRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { businessInfos: pageItems } = await fetcher('businessGetList');
      setPageItems(pageItems);
      setSelectedPageItem(pageItems[0]);
      const { tagInfos: tagItems } = await fetcher('tagGet', { imageId: pageItems[0]?.businessId });
      setTagItems(tagItems);
      setSelectedTagItem(tagItems[0]);
    };
    fetchInitialData();
  }, [setPageItems, setTagItems]);

  return (
    <Context.Provider
      value={{
        pageItems,
        selectedPageItem,
        tagItems,
        selectedTagItem,
        setPageItems,
        setSelectedPageItem,
        setTagItems,
        setSelectedTagItem,
      }}
    >
      <Layout hasSider>
        <Layout.Sider theme={theme}>{pageItems?.length > 0 ? <PageMenu editable={editable} /> : null}</Layout.Sider>
        <Layout.Content style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
          <div
            style={{
              position: 'relative',
              cursor: editable ? 'crosshair' : 'default',
              padding: 100,
            }}
          >
            <Image
              src={selectedPageItem?.pagePicture}
              width={375}
              preview={false}
              onClick={(e) => {
                tagCollapseRef.current?.dropTag(e, editable, setTagItems);
              }}
            />
            {tagItems?.map((tag) => (
              <Button
                key={tag?.pointOrder}
                type="primary"
                shape="circle"
                icon={<PushpinFilled style={{ color: 'yellow' }} />}
                style={{ position: 'absolute', left: tag.pointX, top: tag.pointY, zIndex: 1 }}
                onClick={() => {
                  tagCollapseRef.current?.changeTag(tag.pointOrder);
                }}
              />
            ))}
          </div>
        </Layout.Content>
        <Layout.Sider width={400} theme={theme}>
          {tagItems?.length > 0 ? <TagCollapse ref={tagCollapseRef} editable={editable} /> : null}
        </Layout.Sider>
        <FloatButton
          onClick={() => {
            setEditable(!editable);
          }}
          icon={editable ? <EditOutlined /> : null}
        />
      </Layout>
    </Context.Provider>
  );
};

export default Business;
