import MQTT from 'sp-react-native-mqtt';
import moment from 'moment';
import G from './globalVar';
/* create mqtt client */
//CMD to publish

const connect = (user, clientId, subscribe, publish, cb) => {
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
      });

      client.on('connect', async function () {
        console.log('connected');
        console.log('subscribe:', subscribe);
        G.mqttClient = client;
        subscribe.forEach(topic => client.subscribe(topic, 2));
        var topicCheckInStatus = false;
        var topicApiCmdStatus = false;
        var topicCronStatus = false;
        console.log('PUBLIC:', publish);
        publish.map(topic => {
          if (topic.includes('checkin')) {
            console.log('CHECK-IN!!!');
            topicCheckInStatus = true;
            G.topicCheckIn = topic;
          } else if (topic.includes('server/api/command')) {
            G.topicApiCmd = topic;
            topicApiCmdStatus = true;
          } else if (topic.includes('cron/success')) {
            G.topicCron = topic;
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
            xy: true,
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

const publicCheckin = (mqttClient, payload) => {
  try {
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
