import MQTT from 'sp-react-native-mqtt';
import Restart from 'react-native-restart';
import moment from 'moment';
import Script from './script';
/* create mqtt client */
//CMD to publish
const maincontroll = require('../maincontroll');

const connect = (
  user,
  clientId,
  subscribe,
  publish,
  topicCheckIn,
  topicApiCmd,
  topicCron,
  setMqttClient,
  QRPaymentResult,
  category,
  inventory,
  inventoryAll,
  decodedToken,
  ClientData,
  cash_method,
  cb,
) => {
  var options = {
    uri: 'mqtt://mqtt.advancevending.net:2883',
    user: user.replace(/"/g, ''),
    clientId: clientId,
    auth: true,
  };
  console.log('options', options);
  MQTT.createClient(options)
    .then(function (client) {
      console.log('client===>', client, typeof client);
      client.on('closed', function () {
        console.log('mqtt.event.closed');
      });

      client.on('error', function (msg) {
        console.log('mqtt.event.error', msg, moment().format('HH:mm:ss'));
        // client.disconnect();
        setTimeout(() => {
          client.connect();
        }, 2000);
      });

      client.on('message', async function (msg) {
        console.log('mqtt.event.message', msg);
        let res;
        try {
          res = JSON.parse(msg.data);
        } catch (error) {
          console.log(error);
        }
        if (res) {
          cb(res);
        }

        // try {
        //   var res = JSON.parse(msg.data);
        //   switch (res.cmd) {
        //     case 'restart_app':
        //       console.log('restart', typeof res);
        //       let payload = decodedToken;
        //       let objData = JSON.stringify(res.data);
        //       payload.payload = {cronID: objData.cronID};
        //       publicCron(ClientData, payload, result => {
        //         if (result) {
        //           Restart.restart();
        //         }
        //       });
        //       break;
        //     case 'qr_payment_result':
        //       console.log('SAVE QR RESULT');
        //       QRPaymentResult(res.result);
        //       break;
        //     case 'setup_inventory':
        //       inventory(res.inventory);
        //       inventoryAll(res.inventory);
        //       var arrayCategory = [
        //         {
        //           _id: 'all',
        //           categoryName: 'ALL',
        //         },
        //       ];
        //       arrayCategory = arrayCategory.concat(res.category);
        //       category(arrayCategory);
        //       //client.disconnect();
        //       console.log('SYNC!!!!');
        //       break;
        //     case 'open_cash_payment':
        //       console.log('OPEN CASH');
        //       cash_method(true);
        //       break;
        //     case 'close_cash_payment':
        //       console.log('CLOSE CASH');
        //       cash_method(false);
        //       break;
        //     case 'clear_jammed':
        //       const callback = await maincontroll.clearselectionjammed('clear');
        //       console.log('clear jammed', callback);
        //       break;
        //     default:
        //       break;
        //   }
        //   cb(res);
        // } catch (error) {
        //   console.log(error);
        // }
      });

      client.on('connect', async function () {
        console.log('connected');
        console.log('subscribe:', subscribe);
        setMqttClient(client);
        subscribe.forEach(topic => client.subscribe(topic, 2));
        var topicCheckInStatus = false;
        var topicApiCmdStatus = false;
        var topicCronStatus = false;
        console.log('PUBLIC:', publish);
        publish.map(topic => {
          if (topic.includes('checkin')) {
            console.log('CHECK-IN!!!');
            topicCheckInStatus = true;
            topicCheckIn(topic);
          } else if (topic.includes('server/api/command')) {
            topicApiCmd(topic);
            topicApiCmdStatus = true;
          } else if (topic.includes('cron/success')) {
            topicCron(topic);
          }
        });
        if (topicCheckInStatus) {
          console.log('CHECK-IN');
          const coinStack = {}; //await Script.checkCoinStack();
          var payload = {
            coinStack: coinStack,
            boardStatus: true,
            mdbStatus: true,
          };
          client.publish('/checkin', JSON.stringify(payload), 2, false);
        }
        if (topicApiCmdStatus) {
          var payload = {
            cmd: 'get_inventory',
          };
          client.publish(
            '/server/api/command',
            JSON.stringify(payload),
            2,
            false,
          );
        }
        if (topicCronStatus) {
        }
      });

      client.connect();
    })
    .catch(function (err) {
      console.log(err);
    });
};

const disconnectMQTT = mqttClient => {
  mqttClient.disconnect();
};

const connectMQTT = mqttClient => {
  mqttClient.connect();
};

const publicCheckin = async mqttClient => {
  try {
    const coinStack = await Script.checkCoinStack();
    var payload = {
      coinStack: coinStack,
      boardStatus: true,
      mdbStatus: true,
    };
    console.log(payload);
    mqttClient.publish('/checkin', JSON.stringify(payload), 2, false);
    console.log('Message published Check In successfully!');
    return true;
  } catch (error) {
    return false;
  }
};

const publicQRPaymentResult = (mqttClient, payload) => {
  try {
    mqttClient.publish('/checkin', JSON.stringify(payload), 2, false);
    console.log('Message published Check In successfully!');
    return true;
  } catch (error) {
    return false;
  }
};

const publicCron = (mqttClient, payload, cb) => {
  try {
    console.log(payload);
    mqttClient.publish('/cron/success', JSON.stringify(payload), 2, false);
    console.log('Message published Cron successfully!');
    cb(true);
  } catch (error) {
    cb(false);
  }
};

export default {
  connect,
  publicCheckin,
  publicQRPaymentResult,
  disconnectMQTT,
  connectMQTT,
};
