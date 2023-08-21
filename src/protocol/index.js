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

const MAINPOST = (url,postdata,token, cb) => {
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(postdata),
    timeout: 3000,
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
}
const register = (postdata, cb) => {
  MAINPOST(HOST + '/api/v1/kiosk/register',postdata,'',cb)
};

const getProduct = (postdata, token, cb) => {
    MAINPOST(HOST +  '/api/v1/get/product',postdata,token,cb)
};

const makeTransaction = (postdata, token, cb) => {
    MAINPOST(HOST +  '/api/v1/kiosk/transaction',postdata,token,cb)
};

const updateTransaction = (postdata, token, cb) => {
  MAINPOST(HOST +  '/api/v1/kiosk/transactionsuccess',postdata,token,cb)
};

const loginServiceMode = (postdata, token, cb) => {
  MAINPOST(HOST +  '/api/v1/kiosk/service/pin',postdata,token,cb)
};

const checkIn = (postdata, cb) => {
    MAINPOST(HOST +   '/api/v1/kiosk/checkin',postdata,'',cb)
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
