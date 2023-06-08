import React from 'react';
import { Tag } from 'antd';


export const RetrievalColumns = [
    {
       title: '姓名', 
       dataIndex: 'empName',
       editable: true,
       align: 'center', 
       className: 'table-columns',
       render: (name) => {
        return (<a>{name}</a>)
       },
    }, {
        title: '负责内容',
        dataIndex: 'business',
        editable: true,
        align: 'center',
        className: 'table-columns',
    }, {
        title: '职能类型',
        dataIndex: 'position',
        editable: true,
        align: 'center',
        className: 'table-columns', 
    }, {
        title: '直属上级',
        dataIndex: 'supervisorName',
        editable: true,
        align: 'center', 
        className: 'table-columns',
        render: (name) => {
            return (<a>{name}</a>)
        },
    }
];


export const ThesaurusColumns = [
    {
       title: '名词', 
       dataIndex: 'title',
       editable: true,
       align: 'center', 
       className: 'table-columns',
    }, {
        title: '名词解释',
        dataIndex: 'description',
        editable: true,
        align: 'center', 
        className: 'table-columns',
    }, {
        title: '相关团队',
        dataIndex: 'team',
        editable: true,
        align: 'center', 
        className: 'table-columns',
    },{
        title: '相关文档',
        dataIndex: 'document',
        editable: true,
        align: 'center', 
        className: 'table-columns',
        render: (document) => (
            <a>{document}</a>
        )
    }, {
        title: '重要程度',
        dataIndex: 'importance',
        editable: true,
        align: 'center', 
        className: 'table-columns',
        render: (tag) => {
            let color;
            
            switch (tag) {
                case 'P0':
                    color = 'red';
                    break;
                case 'P1':
                    color = 'orange';
                    break;
                case 'P2':
                    color = 'green';
                    break;
                default:
                    break;
            }
                
            return (
                <Tag color={color} key={tag}>
                    {tag}
                </Tag>
            )
        }
    }
];

export const RetrievalEditColumns = [
    {
        title: '工号', 
        dataIndex: 'empId',
        editable: true,
        align: 'center',
        className: 'table-columns',
     }, 
    {
       title: '姓名', 
       dataIndex: 'empName',
       editable: true,
       align: 'center',
       className: 'table-columns',
       render: (name) => {
        return (<a>{name}</a>)
       }, 
    }, {
        title: '负责内容',
        dataIndex: 'business',
        editable: true,
        align: 'center', 
        className: 'table-columns',
    }, {
        title: '职能类型',
        dataIndex: 'position',
        editable: true,
        align: 'center', 
        className: 'table-columns',
    }, {
        title: '所属组',
        dataIndex: 'workGroup',
        editable: true,
        align: 'center', 
        className: 'table-columns',
    },{
        title: '直属上级',
        dataIndex: 'supervisorName',
        editable: true,
        align: 'center',
        className: 'table-columns',
        render: (name) => {
            return (<a>{name}</a>)
        }, 
    }
];

export const ThesaurusEditColumns = [
    {
        title: '类别', 
        dataIndex: 'category',
        editable: true,
        align: 'center', 
        className: 'table-columns',
     },
    {
        title: '名词', 
        dataIndex: 'title',
        editable: true,
        align: 'center', 
        className: 'table-columns',
     }, {
         title: '名词解释',
         dataIndex: 'description',
         editable: true,
         align: 'center', 
         className: 'table-columns',
         ellipsis: false,
         render: (description) => (
            <div style={{wordWrap: 'break-word', wordBreak: 'break-all'}}>{description}</div>
         )
     }, {
         title: '相关团队',
         dataIndex: 'team',
         editable: true,
         align: 'center', 
         className: 'table-columns',
     },{
        title: '相关文档',
        dataIndex: 'document',
        editable: true,
        align: 'center', 
        className: 'table-columns',
        render: (document) => (
            <a>{document}</a>
        )
    }, {
         title: '重要程度',
         dataIndex: 'importance',
         editable: true,
         align: 'center', 
         className: 'table-columns',
         render: (tag) => {
             let color;
             switch (tag) {
                 case 'P0':
                     color = 'red';
                     break;
                 case 'P1':
                     color = 'orange';
                     break;
                 case 'P2':
                     color = 'green';
                     break;
                 default:
                     break;
             }
                 
             return (
                 <Tag color={color} key={tag}>
                     {tag}
                 </Tag>
             )
         }
     }
];
