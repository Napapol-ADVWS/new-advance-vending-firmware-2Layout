/* eslint-disable no-eval */
import STORE from '../storage';

const HOST = 'https://api.advancevending.net';

const postJson = async (path, postdata) => {
  if (path !== 'register') {
    checkToken(async token => {
      console.log(token);
      let setFunction = eval(path);
      await setFunction(postdata, token.token);
    });
  } else {
    let setFunction = eval(path);
    await setFunction(postdata);
  }
};

const postJsonAwait = async (path, postdata) => {
  let result = new Promise((resolve, reject) => {
    if (path !== 'register') {
      checkToken(token => {
        console.log(token);
        let setFunction = eval(path);
        setFunction(postdata, token.token, r => {
          resolve(r);
        });
      });
    } else {
      let setFunction = eval(path);
      setFunction(postdata, result, r => {
        resolve(r);
      });
    }
  });
  return result;
};

const checkToken = cb => {
  STORE.getItem('TOKEN', RES => {
    console.log(RES);
    if (RES.result) {
      let callback = {
        token: RES.data,
      };
      cb(callback);
    }
  });
};

const register = (postdata, cb) => {
  const url = HOST + '/api/v1/kiosk/register';
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      //Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(postdata),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      cb(data);
    })
    .catch(err => {
      cb(false);
      console.error(err);
    });
};

const getProduct = (postdata, token, cb) => {
  const url = HOST + '/api/v1/get/product';
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(postdata),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      cb(data);
    })
    .catch(err => {
      cb(false);
      console.error(err);
    });
};

const makeTransaction = async (postdata, token) => {
  const url = HOST + '/api/v1/kiosk/transaction';
  await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(postdata),
    timeout: 2000,
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(err => {
      console.error(err);
      return false;
    });
};

const updateTransaction = async (postdata, token) => {
  const url = HOST + '/api/v1/kiosk/transactionsuccess';
  await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(postdata),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(err => {
      console.error(err);
      return false;
    });
};

const loginServiceMode = (postdata, token, cb) => {
  const url = HOST + '/api/v1/kiosk/service/pin';
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(postdata),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      cb(data);
    })
    .catch(err => {
      cb(false);
      console.error(err);
    });
};

export default {
  postJson,
  register,
  getProduct,
  makeTransaction,
  updateTransaction,
  loginServiceMode,
  postJsonAwait,
};
