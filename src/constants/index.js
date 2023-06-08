export const menuItems = [
  {
    key: 'business',
    label: '走进业务',
  },
  {
    key: 'retrieval',
    label: '有问必答',
  },
  {
    key: 'thesaurus',
    label: '名词百科',
  },
  {
    key: 'manage',
    label: '管理页面',
    children: [
      {
        key: 'organization',
        label: '组织架构',
      },
      {
        key: 'word',
        label: '业务名词',
      },
    ],
  },
];

export const buOptions = [
  {
    label: '酒店',
    value: 'hotel',
  },
  {
    label: '机票',
    value: 'flight',
  },

  {
    label: '旅游',
    value: 'tour',
  },
  {
    label: '商旅',
    value: 'corp',
  },
  {
    label: '火车票',
    value: 'train',
  },
];

export const baseUrl = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/27835/';
