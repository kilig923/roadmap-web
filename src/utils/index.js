import { buOptions, baseUrl } from '../constants';

let id = -1;

export const generateTagId = () => id--;

export const formatItems = (pageItems) => {
  const result = buOptions.map((bU) => ({ label: bU.label, key: bU.value, children: null }));
  pageItems.forEach((page) => {
    for (let i = 0; i < result.length; i++) {
      if (page.bU === result[i].key) {
        if (!result[i].children) {
          result[i].children = [];
        }
        result[i].children.push({ key: page.businessId, label: page.pageName });
        break;
      }
    }
  });
  return result;
};

export const readImageAsArray = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      resolve(Array.from(new Int8Array(reader.result)));
    };
  });
};


export const fetcher = (api = '', body = {}) => {
  return new Promise((resolve) => {
    fetch(baseUrl + api, {
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};
