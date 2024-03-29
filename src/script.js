import MQTTConnection from './MQTTConnection';
import STORE from './storage';
import jwt_decode from 'jwt-decode';
import POST from './protocol';
import Script from './script';
import G from './globalVar';
import RNFetchBlob from 'rn-fetch-blob';

const maincontroll = require('../maincontroll');
var kioskID;
let ownerID;
let coinStack = {C1: 0, C2: 0, C5: 0, C10: 0};

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

const checkSignal = (ping, setSignal) => {
  if (ping >= 0.0 && ping <= 199.99) {
    console.log('Level4');
    setSignal(4);
  } else if (ping >= 200.0 && ping <= 299.99) {
    console.log('Level3');
    setSignal(3);
  } else if (ping >= 300.0 && ping <= 599.99) {
    console.log('Level2');
    setSignal(2);
  } else if (ping >= 600.0 && ping <= 1999.99) {
    console.log('Level1');
    setSignal(1);
  } else {
    console.log('Level0');
    setSignal(0);
  }
};

const vendingStatus = (productInsideElevator, pickupDoor, temperature) => {
  maincontroll.on('matchinestatus', status => {
    //console.log('vendingStatus:', status);
    productInsideElevator(status.productInsideElevatorText);
    pickupDoor(status.pickupDoorText);
    temperature(status.temperature);
    G.temperature = status.temperature;
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
  G.coinStack = coinStack;
  return coinStack;
};

const getLastCoinStack = () => {
  return coinStack;
};

const checkURLVideo = (
  videoUrl,
  adsDownload,
  adsDownloadPer,
  ads,
  videoReady,
  startDownlaod,
  cb,
) => {
  STORE.getItem('adsURL', async res => {
    console.log('adsURL::::::::', res.data, '===', videoUrl, '');
    if (res.result) {
      if (res.data === videoUrl) {
        STORE.getItem('adsVideo', async adsData => {
          if (adsData.result) {
            //cb(adsData.data);
            ads(adsData.data);
            videoReady(true);
            cb('Setting completed!');
          } else {
            downloadFileADS(
              videoUrl,
              adsDownload,
              adsDownloadPer,
              ads,
              videoReady,
              startDownlaod,
              cb,
            );
          }
        });
      } else {
        STORE.setItem('adsURL', videoUrl, callback => {
          if (callback.result) {
            downloadFileADS(
              videoUrl,
              adsDownload,
              adsDownloadPer,
              ads,
              videoReady,
              startDownlaod,
              cb,
            );
          }
        });
      }
    } else {
      STORE.setItem('adsURL', videoUrl, callback => {
        if (callback.result) {
          downloadFileADS(
            videoUrl,
            adsDownload,
            adsDownloadPer,
            ads,
            videoReady,
            startDownlaod,
            cb,
          );
        }
      });
    }
  });
};

const downloadFileADS = async (
  videoUrl,
  adsDownload,
  adsDownloadPer,
  ads,
  videoReady,
  startDownlaod,
  cb,
) => {
  if (!G.startDownlaod) {
    G.startDownlaod = true;
    startDownlaod(true);
    try {
      const response = await RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', videoUrl)
        .progress((received, total) => {
          adsDownload(received / total);
          let processDN = (received / total) * 100;
          console.log('DOWNLOAD: ', Number(processDN.toFixed(2) * 100), ' %');
          adsDownloadPer(Number(processDN.toFixed(2)));
          // อัปเดต UI หรือทำตามการตรวจสอบความคืบหน้า
        })
        .then(res => {
          console.log('Download completed!');
          G.startDownlaod = false;
          // ดำเนินการอื่น ๆ หลังจากการดาวน์โหลดเสร็จสิ้น
          const fileData = res.data;
          STORE.setItem('adsVideo', fileData, callback => {
            if (callback.result) {
              ads(fileData);
              videoReady(true);
              startDownlaod(false);
              cb('Download completed!');
            }
          });
        })
        .catch(error => {
          console.error('Error during download:', error);
        });
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
};

export default {
  checkIn,
  checkInV2,
  checkSignal,
  vendingStatus,
  checkCoinStack,
  checkInRecheck,
  getLastCoinStack,
  downloadFileADS,
  checkURLVideo,
};
