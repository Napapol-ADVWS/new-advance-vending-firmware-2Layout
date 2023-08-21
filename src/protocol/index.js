import STORE from '../storage';

const HOST = 'https://api.advancevending.net';

const postJson = (path, postdata, cb) => {
  if (path !== 'register') {
    checkToken(token => {
      console.log(token);
      switch (path) {
        case 'makeTransaction':
          makeTransaction(postdata, token.token, cb);
          break;
        case 'updateTransaction':
          updateTransaction(postdata, token.token, cb);
          break;
        default:
          break;
      }
    });
  } else {
    register(postdata, cb);
  }
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

const makeTransaction = (postdata, token, cb) => {
  const url = HOST + '/api/v1/kiosk/transaction';
  fetch(url, {
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
      cb(data);
    })
    .catch(err => {
      cb(false);
      console.error(err);
    });
};

const updateTransaction = (postdata, token, cb) => {
  const url = HOST + '/api/v1/kiosk/transactionsuccess';
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

const checkIn = (postdata, cb) => {
  fetch(HOST + '/api/v1/kiosk/checkin', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
  checkIn,
};
