import MQTTConnection from './MQTTConnection';
import moment from 'moment';
import STORE from './storage';
import jwt_decode from 'jwt-decode';
import POST from './protocol';
import Script from './script';

const maincontroll = require('../maincontroll');
var kioskID;
let ownerID;
let coinStack;

const checkIn = async ClientData => {
  console.log('start check in', ClientData);
  if (ClientData && Object.keys(ClientData).length > 0) {
    console.log('check in');
    const coinStack = await Script.checkCoinStack();
    var payload = {
      coinStack: coinStack,
      boardStatus: true,
      mdbStatus: true,
    };
    MQTTConnection.publicCheckin(ClientData, payload);
  }
};

const checkInV2 = async () => {
  STORE.getItem('TOKEN', async res => {
    if (res.result) {
      let value = res;
      let decodedToken = jwt_decode(value.data);
      console.log('start check in v2', decodedToken);
      let postdata = decodedToken;
      const coinStack = await checkCoinStack();
      let payload = {
        coinStack: coinStack,
        boardStatus: true,
        mdbStatus: true,
      };
      postdata.payload = JSON.stringify(payload);
      POST.checkIn(postdata, callback => {
        console.log('checkin=>', callback);
        setTimeout(() => {
          checkInV2();
        }, 60000 * 3);
      });
    }
  });
};

const checkInRecheck = ClientData => {
  console.log('MQTT RE Check-in');
  MQTTConnection.publicCheckin(ClientData);
};

const checkSignal = (setSignal, setPingMS) => {
  let start = Date.now();
  fetch('https://www.advancevending.net/')
    .then(response => {
      if (response) {
        const pingMS = Date.now() - start;
        setPingMS(pingMS);
        if (pingMS >= 0.0 && pingMS <= 250.99) {
          setSignal(4);
        } else if (pingMS >= 100.0 && pingMS <= 299.99) {
          setSignal(3);
        } else if (pingMS >= 300.0 && pingMS <= 599.99) {
          setSignal(2);
        } else if (pingMS >= 600.0 && pingMS <= 1999.99) {
          setSignal(1);
        } else {
          setSignal(0);
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
};

const vendingStatus = (productInsideElevator, pickupDoor, temperature) => {
  maincontroll.on('matchinestatus', status => {
    //console.log('vendingStatus:', status);
    productInsideElevator(status.productInsideElevatorText);
    pickupDoor(status.pickupDoorText);
    temperature(status.temperature);
  });
};

const checkCoinStack = async () => {
  const getCoinStack = await maincontroll.querycoinnumber();
  console.log('Raw Coin', getCoinStack);
  let coin1 = getCoinStack.coin1 ? getCoinStack.coin1 : 0;
  let coin2 = getCoinStack.coin2 ? getCoinStack.coin2 : 0;
  let coin5 = getCoinStack.coin5 ? getCoinStack.coin5 : 0;
  let coin10 = getCoinStack.coin10 ? getCoinStack.coin10 : 0;
  coinStack = {C1: coin1, C2: coin2, C5: coin5, C10: coin10};
  return coinStack;
};

const getLastCoinStack = async () => {
  return coinStack;
};

export default {
  checkIn,
  checkInV2,
  checkSignal,
  vendingStatus,
  checkCoinStack,
  checkInRecheck,
  getLastCoinStack,
};
