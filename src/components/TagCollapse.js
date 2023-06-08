import React, { useState, useCallback, useEffect, useContext, useImperativeHandle, forwardRef } from 'react';
import { Button, Form, Space, message, Input, InputNumber, Collapse, Dropdown, Modal } from 'antd';
import { SettingOutlined, FileAddOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import TagInfo from './TagInfo';
import Context from '../context';
import { fetcher } from '../utils';

const TagCollapse = forwardRef(function TagCollapse({ editable = false }, ref) {
  const { selectedPageItem, tagItems, selectedTagItem, setTagItems, setSelectedTagItem } = useContext(Context);
  const [unsaved, setUnsaved] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(selectedTagItem);
  }, [form, selectedTagItem]);

  const changeTag = useCallback(
    (tagId) => {
      form
        .validateFields()
        .then(async () => {
          if (unsaved) {
            message.error('标签尚未保存,请保存或重置后再切换标签!');
          } else {
            const tagInfo = tagItems.find((tag) => tag.pointOrder === Number(tagId));
            setSelectedTagItem(tagInfo);
            setUnsaved(false);
          }
        })
        .catch(() => {});
    },
    [form, unsaved, tagItems, setSelectedTagItem]
  );

  const createTag = useCallback(() => {
    if (unsaved) {
      message.error('标签尚未保存,请保存或重置后再新建标签!');
      return;
    }
    const newTagInfo = {
      pointOrder: -1,
      pointX: 0,
      pointY: 0,
      moduleName: '',
      moduleDefinition: '',
      teamLink: '',
      docLink: '',
    };
    setTagItems((draft) => {
      draft.push(newTagInfo);
    });
    setSelectedTagItem(newTagInfo);
  }, [setTagItems, unsaved, setSelectedTagItem]);

  const deleteTag = useCallback(() => {
    if (tagItems.length < 2) {
      message.error('仅剩1个标签时无法删除!');
      return;
    }
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      title: `是否确定删除${selectedTagItem?.moduleName}?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        if (selectedTagItem?.pointOrder === -1) {
          setTagItems((draft) => {
            draft.pop();
          });
          setSelectedTagItem(tagItems[0]);
          message.success('删除成功!');
        } else {
          const {
            ResponseStatus: { Ack },
          } = await fetcher('tagDelete', { pointOrder: selectedTagItem?.pointOrder });
          if (Ack === 'Success') {
            message.success('删除成功!');
            const { tagInfos: tagItems } = await fetcher('tagGet', { imageId: selectedPageItem?.businessId });
            setTagItems(tagItems);
            setSelectedTagItem(tagItems[0]);
          } else {
            message.error('删除失败!');
          }
        }
      },
    });
  }, [setTagItems, tagItems, selectedTagItem, setSelectedTagItem, selectedPageItem]);

  const dropTag = useCallback(
    ({ nativeEvent: { offsetX, offsetY } }, editable, setTagItems) => {
      if (!editable) return;
      let pointX = offsetX - 16;
      let pointY = offsetY - 16;
      if (pointX < 0) pointX = 0;
      if (pointX > 375 - 32) pointX = 375 - 32;
      if (pointY < 0) pointY = 0;
      if (pointY > 812 - 32) pointY = 812 - 32;
      form.setFieldsValue({ pointX, pointY });
      setTagItems((draft) => {
        const index = tagItems.findIndex((tag) => {
          return tag.pointOrder === selectedTagItem?.pointOrder;
        });
        draft[index].pointX = pointX;
        draft[index].pointY = pointY;
      });
    },
    [form, tagItems, selectedTagItem]
  );

  const onSubmit = useCallback(async () => {
    const request = {
      tagInfo: [
        { ...form.getFieldsValue(), pointOrder: selectedTagItem?.pointOrder, imageId: selectedPageItem?.businessId },
      ],
    };
    const {
      ResponseStatus: { Ack },
    } = await fetcher('tagAdd', request);
    if (Ack === 'Success') {
      message.success('保存成功!');
      const { tagInfos: tagItems } = await fetcher('tagGet', { imageId: selectedPageItem?.businessId });
      setTagItems(tagItems);
      setSelectedTagItem(tagItems[tagItems?.length - 1]);
      setUnsaved(false);
    } else {
      message.error('保存失败!');
    }
  }, [form, selectedPageItem, selectedTagItem, setTagItems, setSelectedTagItem]);

  useImperativeHandle(
    ref,
    () => ({
      changeTag,
      dropTag,
    }),
    [changeTag, dropTag]
  );

  return (
    <Collapse
      accordion
      activeKey={selectedTagItem?.pointOrder}
      onChange={(activedKeys) => {
        changeTag(Number(activedKeys[0]));
      }}
    >
      {tagItems.map((tag) => (
        <Collapse.Panel
          key={tag.pointOrder}
          collapsible={tag.pointOrder === selectedTagItem?.pointOrder ? 'disabled' : 'true'}
          header={tag.moduleName}
          extra={
            editable && tag.pointOrder === selectedTagItem?.pointOrder ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'create',
                      label: '新建标签',
                      icon: <FileAddOutlined />,
                    },
                    {
                      key: 'delete',
                      label: '删除标签',
                      icon: <DeleteOutlined />,
                    },
                  ],
                  onClick: (item) => {
                    if (item.key === 'create') createTag();
                    if (item.key === 'delete') deleteTag();
                  },
                }}
              >
                <Button type="text" shape="circle" size="small" icon={<SettingOutlined />} />
              </Dropdown>
            ) : null
          }
        >
          {editable ? (
            <Form
              form={form}
              initialValues={tagItems[0]}
              validateMessages={{ required: '${label}为必需项' }}
              onFinish={onSubmit}
              onValuesChange={(changedValues, allValues) => {
                for (const [key, value] of Object.entries(allValues)) {
                  if (selectedTagItem[key] !== value) {
                    setUnsaved(true);
                    return;
                  }
                }
                setUnsaved(false);
              }}
            >
              <Form.Item
                name="moduleName"
                label="标题"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  onChange={({ target: { value } }) => {
                    setTagItems((draft) => {
                      const index = tagItems.findIndex((tag) => tag.pointOrder === selectedTagItem?.pointOrder);
                      draft[index].moduleName = value;
                    });
                  }}
                />
              </Form.Item>
              <Space>
                <Form.Item
                  name="pointX"
                  label="左偏移量"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={375 - 32}
                    onChange={(value) => {
                      setTagItems((draft) => {
                        const index = tagItems.findIndex((tag) => tag.pointOrder === selectedTagItem?.pointOrder);
                        draft[index].pointX = value;
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="pointY"
                  label="上偏移量"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={812 - 32}
                    onChange={(value) => {
                      setTagItems((draft) => {
                        const index = tagItems.findIndex((tag) => tag.pointOrder === selectedTagItem?.pointOrder);
                        draft[index].pointY = value;
                      });
                    }}
                  />
                </Form.Item>
              </Space>
              <Form.Item
                name="moduleDefinition"
                label="描述"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea placeholder="请添加描述" rows={4} />
              </Form.Item>
              <Form.Item
                name="teamLink"
                label="团队"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="docLink"
                label="文档"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <TagInfo info={selectedTagItem} />
          )}
        </Collapse.Panel>
      ))}
    </Collapse>
  );
});

export default TagCollapse;
