import Storage from './storage';

const maincontroll = require('../maincontroll');
var countChange = 0;
var countDispens = 0;
// const InputValidator = (active, cb) => {
//   console.log('==> START DRIVER');
//   settingCoin(active, cb);
// };

// const settingCoin = (active, cb) => {
//   maincontroll.setcoinaccept(active, res => {
//     console.log('COIN:', res);
//     settingBill(active, res.result, cb);
//   });
// };

// const settingBill = (active, coinStatus, cb) => {
//   maincontroll.setbillaccept(active, res => {
//     console.log('BILL:', res);
//     var callback = {
//       coin: coinStatus,
//       bill: res.result,
//     };
//     cb(callback);
//   });
// };

const InputValidator = async cb => {
  const callbackCoin = await maincontroll.setcoinaccept(true);
  const callbackBill = await maincontroll.setbillaccept(true);
  console.log(callbackCoin);
  console.log(callbackBill);
  let callback = {
    coin: callbackCoin.result,
    bill: callbackBill.result,
  };
  cb(callback);
};

const dispenseStatus = cb => {
  maincontroll.on('dispense', res => {
    console.log('dispense status:', res);
    cb(res);
  });
};

function useReceiveMoney(cb) {
  console.log('start ReceiveMoney');
  const callback = maincontroll.on('receivemoney');
  console.log('INPUT Money:::', callback);
  cb(callback);
}

function changeMoney(m, cb) {
  const callback = maincontroll.givechange(Number(m));
  if (callback.result) {
    cb(callback);
  }
}

const dispenseProduct = async (slot, cb) => {
  const callback = await maincontroll.dispense(Number(slot));
  if (callback.result) {
    cb(callback);
  }
};

export default {
  InputValidator,
  useReceiveMoney,
  changeMoney,
  dispenseProduct,
  dispenseStatus,
};
