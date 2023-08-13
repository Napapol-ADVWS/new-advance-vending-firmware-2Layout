// V.2.6.0

import RNSerialport from 'react-native-serial-port-api';

var Buffer = require('buffer/').Buffer;
const vmcCmd = require('./vmc');

const mainevent = {};
let q_cmd = false;
let waittimeout = 3000; //millsec time out for every command
let globaltimeout = false;
let eventchecktimeout = false;
let timeout = 0;
let lastmessage = '';

let event_name_waiting;
function calwaitingevent(e) {
  let result = new Promise((resolve, reject) => {
    if (event_name_waiting) {
      return reject('other checking event exists');
    }
    event_name_waiting = (ev_name, result) => {
      if (ev_name == e) {
        clearTimeout(eventchecktimeout);
        resolve(result);
        event_name_waiting = false; // clear self function;
      }
    };
    // now wait
    eventchecktimeout = setTimeout(() => {
      event_name_waiting = false; // Clear queue
      resolve({result: false, message: 'No VMC Event :' + e, code: '104001'});
    }, 30000);
  });
  return result;
}

function sendCommand(cmd) {
  SerialPort.send(cmd.toString('hex')); // or cmd.toString('hex') ?
}

// Create a port
// Open errors will be emitted as an error event
var SerialPort;
var buffer;
async function OpenPort() {
  SerialPort = await RNSerialport.open('/dev/ttyS1', {
    baudRate: 57600,
  });
  console.log('START PORT');
  buffer = Buffer.alloc(0);
  // Read data that is available but keep the stream in "paused mode"
  SerialPort.onReceived(msg => {
    buffer = Buffer.concat([buffer, msg]);
    let message = buffer.toString('hex');
    let posstart = message.indexOf('fafb');
    let txt = '';
    if (posstart >= 0) {
      if (buffer.length > posstart / 2 + 4) {
        let packlength = Number(
          vmcCmd.base10(
            String(message[posstart + 6]) + String(message[posstart + 7]),
          ),
        );
        if (buffer.length >= packlength + 4) {
          txt = buffer.slice(posstart / 2, posstart / 2 + packlength + 5);
          if (txt.length == packlength + 5) {
            buffer = buffer.slice(posstart / 2 + packlength + 5);
            decodeMessage(Buffer.from(txt, 'hex'));
          }
        }
      }
    }
  });
}

function decodeMessage(buffer) {
  console.log(buffer.toString('hex'));
  if (buffer.length == 0) return; //   No data;
  let data = {message: buffer, text: buffer.toString('hex')};
  // buffer = Buffer.alloc(0); // Clear Buffer
  let decode = vmcCmd.decodeText(data.text);
  // console.log('decode ==>',decode);
  if (!decode) {
    //  sendCommand(vmcCmd.act);   No act when Not sure message
  } else {
    if (decode.command == '41') {
      // 41 = POLL form VMC
      if (q_cmd) {
        console.log('Sending command : ', q_cmd.command.toString('hex'));
        sendCommand(q_cmd.command); // UPC send command in queue
      } else {
        sendCommand(vmcCmd.act); // UPC have to act back too.
      }
    } else if (decode.command == '42') {
      // VMC Act then Clear cmd Queue
      clearTimeout(globaltimeout);
      if (q_cmd) {
        q_cmd.resolve({
          result: true,
          message: 'VMC Received Command',
          code: '00',
        }); // Resolve Promise
        console.log('VMC Received Command ');
      }
      q_cmd = false; // Clear in Queue
    } else {
      if (decode.command == '31') {
        console.log('synchronization : ', decode.message);
        sendCommand(vmcCmd.act); // UPC have to act back too.
        maincontroll.synchronization();
      } else {
        /// Detect Function
        sendCommand(vmcCmd.act); // UPC have to act back too.

        if (lastmessage == decode.message) return; // checking duplicate data
        lastmessage = decode.message;

        if (decode.command == '02') {
          console.log('decode 02 ==>', decode);
          let d = {
            result: ['01', '02'].indexOf(decode.status) > -1 ? true : false,
            title: decode.title,
            message: decode.statusText,
            selectionNumber: decode.selectionNumber,
            status: decode.status,
            code: `5${decode.command}${decode.status}`,
          };
          if (event_name_waiting) event_name_waiting('selectionnumber', d);
          if (mainevent.selectionnumber) mainevent.selectionnumber(d);
        } else if (decode.command == '04') {
          console.log('decode 04 ==>', decode);
          let d = {
            result:
              ['01', '02', '10', '11', '24', '40', '41', '42'].indexOf(
                decode.status,
              ) > -1
                ? true
                : false,
            title: decode.title,
            selectionNumber: decode.selectionNumber,
            status: decode.status,
            message: decode.statusText,
            code: `5${decode.command}${decode.status}`,
          };
          if (mainevent.dispense) mainevent.dispense(d);
          if (event_name_waiting) event_name_waiting('dispense', d);
          if (
            ['01', '02', '10', '11', '40', '41'].indexOf(decode.status) == -1
          ) {
            // waitingevent
          }
        } else if (decode.command == '21') {
          console.log('decode 21 ==>', decode);
          let evname = decode.mode == '8' ? 'resetmoney' : 'receivemoney';
          let d = {
            result: true,
            title: decode.title,
            message: 'ok',
            mode: decode.modeText,
            amount:
              decode.amount.toString().length > 2
                ? decode.amount
                    .toString()
                    .substring(0, decode.amount.toString().length - 2)
                : decode.amount,
            code: `1${decode.command}00`,
          };
          if (mainevent[evname]) mainevent[evname](d);
          if (event_name_waiting) event_name_waiting(evname, d);
        } else if (decode.command == '23') {
          console.log('decode 23 ==>', decode);
          let d = {
            result: true,
            title: decode.title,
            message: 'ok',
            amount:
              decode.amount.toString().length > 2
                ? decode.amount
                    .toString()
                    .substring(0, decode.amount.toString().length - 2)
                : decode.amount,
            code: `1${decode.command}00`,
          };
          if (mainevent.currentamount) mainevent.currentamount(d);
          if (event_name_waiting) event_name_waiting('currentamount', d);
        } else if (decode.command == '26') {
          console.log('decode 26 ==>', decode);
          let d = {
            result: true,
            title: decode.title,
            message: 'ok',
            coinChange:
              decode.coinChange.toString().length > 2
                ? decode.coinChange
                    .toString()
                    .substring(0, decode.coinChange.toString().length - 2)
                : decode.coinChange,
            billChange:
              decode.billChange.toString().length > 2
                ? decode.billChange
                    .toString()
                    .substring(0, decode.billChange.toString().length - 2)
                : decode.billChange,
            code: `1${decode.command}00`,
          };
          if (mainevent.givechange) mainevent.givechange(d);
          if (event_name_waiting) event_name_waiting('givechange', d);
        } else if (decode.command == '29') {
          console.log('decode 29 ==>', decode);
          let d = {
            result: true,
            title: decode.title,
            message: decode.statusText,
            status: decode.status,
            code: `6${decode.command}${decode.status}`,
          };
          if (mainevent.setacceptreceivemoney)
            mainevent.setacceptreceivemoney(d);
          if (event_name_waiting)
            event_name_waiting('setacceptreceivemoney', d);
        } else if (decode.command == '33') {
          console.log('decode 33 ==>', decode);
          let d = {
            result: true,
            title: 'User push cancel',
            message: 'Push cancel',
            status: '00',
            code: `6${decode.command}00`,
          };
          if (mainevent.usercancel) mainevent.usercancel(d);
        } else if (decode.command == '52') {
          // console.log('decode 52 ==>', decode);
          let d = {
            result: true,
            title: decode.title,
            message: 'ok',
            status: '00',
            billAccept: decode.billAccept,
            coinAccept: decode.coinAccept,
            temperature: decode.temperatureText,
            doorStatus: decode.doorStatusText,
            billChange:
              Number(decode.billChangeText) > 0
                ? Number(decode.billChangeText) / 100
                : decode.billChangeText,
            coinChange:
              Number(decode.coinChangeText) > 0
                ? Number(decode.coinChangeText) / 100
                : decode.coinChangeText,
            productInsideElevatorText: decode.productInsideElevatorText,
            pickupDoorText: decode.pickupDoorText,
            code: `1${decode.command}00`,
          };
          ``;
          if (mainevent.matchinestatus) mainevent.matchinestatus(d);
        } else if (decode.command == '71') {
          if (decode.commandType == '01') {
            console.log('decode 01 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                coinsystemtype: decode.coinsystemtypeText,
                code: `2${decode.command}${decode.commandType}00`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.coinsystemsetting) mainevent.coinsystemsetting(d);
            if (event_name_waiting) event_name_waiting('coinsystemsetting', d);
          } else if (decode.commandType == '02') {
            console.log('decode 02 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                selectionmode: decode.selectionmodeText,
                code: `2${decode.command}${decode.commandType}00`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.selectionmodesetting)
              mainevent.selectionmodesetting(d);
            if (event_name_waiting)
              event_name_waiting('selectionmodesetting', d);
          } else if (decode.commandType == '03') {
            console.log('decode 03 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                motorAD: decode.motorADText,
                code: `2${decode.command}${decode.commandType}00`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.motoradsetting) mainevent.motoradsetting(d);
            if (event_name_waiting) event_name_waiting('motoradsetting', d);
          } else if (decode.commandType == '04') {
            console.log('decode 04 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                couplingstatus: decode.couplingstatusText,
                code: `2${decode.command}${decode.commandType}00`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.selectioncouplingsetting)
              mainevent.selectioncouplingsetting(d);
            if (event_name_waiting)
              event_name_waiting('selectioncouplingsetting', d);
          } else if (decode.commandType == '05') {
            console.log('decode 05 ==>', decode);
            let d = {
              result: decode.status == '00' ? true : false,
              title: decode.title,
              message: decode.statusText,
              status: decode.status,
              code: `2${decode.command}${decode.commandType}${decode.status}`,
            };
            if (mainevent.clearselectioncoupling)
              mainevent.clearselectioncoupling(d);
            if (event_name_waiting)
              event_name_waiting('clearselectioncoupling', d);
          } else if (decode.commandType == '12') {
            console.log('decode 12 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                connectlift: decode.connectliftText,
                overcurrentprotection: decode.overcurrentprotectionText,
                code: `2${decode.command}${decode.commandType}00`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.connectliftsetting) mainevent.connectliftsetting(d);
            if (event_name_waiting) event_name_waiting('connectliftsetting', d);
          } else if (decode.commandType == '18') {
            console.log('decode 18 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                billvalueacceptedonmachine:
                  decode.billvalueacceptedonmachineText,
                code: `2${decode.command}${decode.commandType}00`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.setacceptreceivemoney)
              mainevent.setacceptreceivemoney(d);
            if (event_name_waiting)
              event_name_waiting('setacceptreceivemoney', d);
            if (mainevent.billvalueaccept) mainevent.billvalueaccept(d);
          } else if (decode.commandType == '28') {
            console.log('decode 28 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                mode: decode.modeText,
                temperature: decode.temperatureText,
                minTemperature: decode.minTemperatureText,
                maxTemperature: decode.maxTemperature,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.temperaturecontroller)
              mainevent.temperaturecontroller(d);
            if (event_name_waiting)
              event_name_waiting('temperaturecontroller', d);
          } else if (decode.commandType == '32') {
            console.log('decode 32 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                status: '00',
                selectionNumber: decode.selectionNumber,
                jammedSelectionN: decode.jammedSelectionN,
                selectionNumber: decode.selectionNumber2,
                beltSelectionSelfTestFailureN:
                  decode.beltSelectionSelfTestFailureN,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.clearselectionjammed)
              mainevent.clearselectionjammed(d);
            if (event_name_waiting)
              event_name_waiting('clearselectionjammed', d);
          } else if (decode.commandType == '33') {
            console.log('decode 33 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                status: '00',
                selectionNumber: decode.selectionNumber,
                motorErrorN: decode.motorErrorN,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.clearmotorerror) mainevent.clearmotorerror(d);
            if (event_name_waiting) event_name_waiting('clearmotorerror', d);
          } else if (decode.commandType == '34') {
            console.log('decode 34 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                status: '00',
                lifterrortimes: decode.lifterrortimes,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.clearmotorerror) mainevent.clearlifterror(d);
            if (event_name_waiting) event_name_waiting('clearlifterror', d);
          } else if (decode.commandType == '36') {
            console.log('decode 36 ==>', decode);
            let d = {
              result: decode.status == '00' ? true : false,
              title: decode.title,
              message: decode.statusText,
              temperature: decode.temperatureText,
              temperaturecontrollerstatus:
                decode.temperaturecontrollerstatusText,
              status: decode.status,
              code: `2${decode.command}${decode.commandType}${decode.status}`,
            };
            if (mainevent.temperaturecontrollerstatus)
              mainevent.temperaturecontrollerstatus(d);
            if (event_name_waiting)
              event_name_waiting('temperaturecontrollerstatus', d);
          } else if (decode.commandType == '38') {
            console.log('decode 38 ==>', decode);
            let d = {
              result: decode.status == '00' ? true : false,
              title: decode.title,
              message: decode.statusText,
              status: decode.status,
              code: `2${decode.command}${decode.commandType}${decode.status}`,
            };
            if (mainevent.selectiontest) mainevent.selectiontest(d);
            if (event_name_waiting) event_name_waiting('selectiontest', d);
          } else if (decode.commandType == '40') {
            console.log('decode 40 ==>', decode);
            let d = {
              result: true,
              message: decode.title,
              total: decode.totalCoinAmount,
              coin1: decode.coin1,
              coin5: decode.coin5,
              coin10: decode.coin10,
              code: `2${decode.command}${decode.commandType}${decode.status}`,
            };
            if (mainevent.querycoinnumber) mainevent.querycoinnumber(d);
            if (event_name_waiting) event_name_waiting('querycoinnumber', d);
          } else if (decode.commandType == '51') {
            console.log('decode 51 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                pulse: Number(decode.pulseValue) / 100,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                locationStatus: decode.locationStatusText,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.liftlocation) mainevent.liftlocation(d);
            if (event_name_waiting) event_name_waiting('liftlocation', d);
          } else if (decode.commandType == '52') {
            //console.log('decode 52 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                liftspeed: decode.liftspeedText,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.liftspeed) mainevent.liftspeed(d);
            if (event_name_waiting) event_name_waiting('liftspeed', d);
          } else if (decode.commandType == '53') {
            console.log('decode 53 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                liftsensitivity: decode.liftsensitivityText,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.liftsensitivity) mainevent.liftsensitivity(d);
            if (event_name_waiting) event_name_waiting('liftsensitivity', d);
          } else if (decode.commandType == '54') {
            console.log('decode 54 ==>', decode);
            let d = {
              result: decode.status == '00' ? true : false,
              title: decode.title,
              message: decode.statusText,
              status: decode.status,
              testresult: decode.testresultText,
              code: `2${decode.command}${decode.commandType}${decode.status}`,
            };
            if (mainevent.lifttest) mainevent.lifttest(d);
            if (event_name_waiting) event_name_waiting('lifttest', d);
          } else if (decode.commandType == '55') {
            console.log('decode 55 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                layerPulse: Number(decode.layerPulseText) / 100,
                lunchboxPulse: Number(decode.lunchboxPulseText) / 100,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.liftlocationonlunchbox)
              mainevent.liftlocationonlunchbox(d);
            if (event_name_waiting)
              event_name_waiting('liftlocationonlunchbox', d);
          } else if (decode.commandType == '60') {
            console.log('decode 60 ==>', decode);
            let d = {};
            if (decode.operationType == '00') {
              d = {
                result: true,
                title: decode.title,
                message: 'ok',
                connecttemperaturecontroller:
                  decode.connecttemperaturecontrollerText,
                code: `2${decode.command}${decode.commandType}00`,
              };
            } else {
              d = {
                result: decode.status == '00' ? true : false,
                title: decode.title,
                message: decode.statusText,
                status: decode.status,
                code: `2${decode.command}${decode.commandType}${decode.status}`,
              };
            }
            if (mainevent.temperaturecontrollerconnect)
              mainevent.temperaturecontrollerconnect(d);
            if (event_name_waiting)
              event_name_waiting('temperaturecontrollerconnect', d);
          }
        } else {
          // console.log('decode other ==>',decode);
          if (mainevent.vmcdata) mainevent.vmcdata(decode);
        }
      }
    }
  }
}

var maincontroll = {self: this};

/// Event from VMC to Android
maincontroll.on = function (e, cb) {
  mainevent[e] = cb;
};

/// delete from VMC to Android
maincontroll.off = function (e) {
  mainevent[e] = false;
  console.log('delete from VMC to Android:', mainevent[e]);
  console.log('dispense status:', mainevent.dispense);
};

/// Send command from android to VMC ///
async function sendAndWait(d) {
  let result = new Promise((resolve, reject) => {
    if (q_cmd) return reject('Other Command existing'); // existing Queue
    q_cmd = {
      command: vmcCmd.genCommand(d),
      resolve: resolve,
      reject: reject,
    };
    globaltimeout = setTimeout(() => {
      q_cmd = false;
      resolve({result: false, message: 'VMC Not Response', code: '104001'});
    }, 5000);
  });
  return result;
}

maincontroll.selectionnumber = async SlotId => {
  if (!(Number(SlotId) > 0)) {
    return {result: false, message: 'Selection Number Invalid', code: '1003'};
  }
  const vmcact = sendAndWait({
    e: 'selectionnumber',
    cmd: '01',
    text: `${vmcCmd.base16(SlotId, 4)}`,
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('selectionnumber', vmcact);
};

maincontroll.dispense = async SlotId => {
  if (!(Number(SlotId) > 0)) {
    return {result: false, message: 'Selection Number Invalid', code: '1003'};
  }
  const slot = await maincontroll.selectionnumber(SlotId);
  console.log('Dispense Selection Number :', slot);
  if (slot && slot.result == true) {
    const vmcact = sendAndWait({
      e: 'dispense',
      cmd: '06',
      text: `0101${vmcCmd.base16(SlotId, 4)}`,
      ts: Math.floor(Number(new Date())),
    });
    console.log('Dispensing :', slot);
    return await calwaitingevent('dispense');
  } else {
    return slot;
  }
};

maincontroll.givechange = async amount => {
  if (isNaN(amount)) {
    return {result: false, message: 'Change Amount Invalid', code: '1004'};
  }
  const vmcact = await sendAndWait({
    e: 'givechange',
    cmd: '25',
    text: amount > 0 ? `${vmcCmd.base16(amount + '00', 8)}` : '',
    ts: Math.floor(Number(new Date())),
  });
  if (!vmcact || vmcact.result == false) {
    return vmcact;
  } else {
    return await calwaitingevent('givechange');
  }
};

maincontroll.setcoinaccept = async accept => {
  const vmcact = await sendAndWait({
    e: 'setcoinaccept',
    cmd: '28',
    text: `01${accept ? 'ffff' : '0000'}`,
    ts: Math.floor(Number(new Date())),
  });
  if (!vmcact || vmcact.result == false) {
    return vmcact;
  } else {
    console.log('wait setacceptreceivemoney');
    return await calwaitingevent('setacceptreceivemoney');
  }
};

maincontroll.setbillaccept = async accept => {
  let d = {
    e: 'setbillaccept',
    cmd: '28',
    text: `00${accept ? 'ffff' : '0000'}`,
    ts: Math.floor(Number(new Date())),
  };
  if (accept == true) {
    d.cmd = '70';
    d.text = '1801' + vmcCmd.base16(10, 2);
  }

  const vmcact = await sendAndWait(d);
  if (!vmcact || vmcact.result == false) {
    return vmcact;
  } else {
    return await calwaitingevent('setacceptreceivemoney');
  }
};

maincontroll.billvalueaccept = async (action, BillValue) => {
  var vmcact = await sendAndWait({
    e: 'billvalueaccept',
    cmd: '70',
    text: action == 'setting' ? '1801' + vmcCmd.base16(BillValue, 2) : '1800',
    ts: Math.floor(Number(new Date())),
  });
  if (!vmcact || vmcact.result == false) {
    return vmcact;
  }
  return await calwaitingevent('billvalueaccept');
};

maincontroll.resetmoney = async () => {
  var vmcact = await sendAndWait({
    e: 'resetmoney',
    cmd: '27',
    text: `08`,
    ts: Math.floor(Number(new Date())),
  });
  if (!vmcact || vmcact.result == false) {
    return vmcact;
  }
  return await calwaitingevent('resetmoney');
};

maincontroll.coinsystemsetting = async (action, Type) => {
  // type 1 : Coin acceptor
  // type 2 : HOPPER
  var vmcact = await sendAndWait({
    e: 'coinsystemsetting',
    cmd: '70',
    text: action == 'setting' ? `01${vmcCmd.base16(Type, 2)}` : '0100',
    ts: Math.floor(Number(new Date())),
  });
  if (!vmcact || vmcact.result == false) {
    return vmcact;
  }
  return await calwaitingevent('coinsystemsetting');
};

maincontroll.selectionmodesetting = async (action, LayerNumber, Mode) => {
  //Mode: 1 = Spiral 2 = Belt 3 = Hook
  var vmcact = sendAndWait({
    e: 'selectionmodesetting',
    cmd: '70',
    text:
      action == 'setting'
        ? `0201${vmcCmd.base16(LayerNumber, 2)}${vmcCmd.base16(Mode, 2)}`
        : '0200' + vmcCmd.base16(LayerNumber, 2),
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('selectionmodesetting');
};

maincontroll.motoradsetting = async (action, MotorAD) => {
  var vmcact = sendAndWait({
    e: 'motoradsetting',
    cmd: '70',
    text: action == 'setting' ? `0301${vmcCmd.base16(MotorAD, 2)}` : '030000',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('motoradsetting');
};

maincontroll.selectioncouplingsetting = async (
  action,
  SlotId,
  CouplingStatus,
) => {
  // CouplingStatus 1(No Coupling) , 2 , 3
  var vmcact = sendAndWait({
    e: 'selectioncouplingsetting',
    cmd: '70',
    text:
      action == 'setting'
        ? `0401${vmcCmd.base16(SlotId, 2)}${vmcCmd.base16(CouplingStatus, 2)}`
        : '0400' + vmcCmd.base16(SlotId, 2),
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('selectioncouplingsetting');
};

maincontroll.clearselectioncoupling = async () => {
  var vmcact = sendAndWait({
    e: 'clearselectioncoupling',
    cmd: '70',
    text: '0501',
    ts: Math.floor(Number(new Date())),
  });

  return await calwaitingevent('clearselectioncoupling');
};

maincontroll.querycoinnumber = async () => {
  var vmcact = await sendAndWait({
    e: 'querycoinnumber',
    cmd: '70',
    text: `4000`,
    ts: Math.floor(Number(new Date())),
  });
  if (!vmcact || vmcact.result == false) {
    return vmcact;
  }
  return await calwaitingevent('querycoinnumber');
};

maincontroll.setselectionjammed = async (action, LayerNumber) => {
  var vmcact = sendAndWait({
    e: 'setselectionjammed',
    cmd: '70',
    text:
      action == 'get'
        ? `2700${vmcCmd.base16(LayerNumber, 2)}`
        : action == 'set'
        ? `2700${vmcCmd.base16(LayerNumber, 2)}02`
        : `2700${vmcCmd.base16(LayerNumber)}01`,
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('setselectionjammed');
};

maincontroll.clearselectionjammed = async action => {
  var vmcact = sendAndWait({
    e: 'clearselectionjammed',
    cmd: '70',
    text: action == 'clear' ? '3201' : '3200',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('clearselectionjammed');
};

maincontroll.clearmotorerror = async action => {
  var vmcact = sendAndWait({
    e: 'clearmotorerror',
    cmd: '70',
    text: action == 'clear' ? '3301' : '3300',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('clearmotorerror');
};

maincontroll.selectiontest = async SlotId => {
  var vmcact = sendAndWait({
    e: 'selectiontest',
    cmd: '70',
    text: `380101${vmcCmd.base16(SlotId, 4)}`,
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('selectiontest');
};

maincontroll.lifttest = async LayerNumber => {
  var vmcact = await sendAndWait({
    e: 'lifttest',
    cmd: '70',
    text: `5400${vmcCmd.base16(LayerNumber, 2)}`,
    ts: Math.floor(Number(new Date())),
  });
  if (!vmcact || vmcact.result == false) {
    return vmcact;
  }
  return await calwaitingevent('lifttest');
};

maincontroll.liftlocation = async (action, LayerNumber, Pulse) => {
  var vmcact = sendAndWait({
    e: 'liftlocation',
    cmd: '70',
    text:
      action == 'setting'
        ? '510100' +
          vmcCmd.base16(LayerNumber, 2) +
          vmcCmd.base16(Number(Pulse) * 100, 4)
        : '510000' + vmcCmd.base16(LayerNumber, 2),
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('liftlocation');
};

maincontroll.liftlocationonlunchbox = async (
  action,
  LayerPulse,
  LunchBoxPulse,
) => {
  var vmcact = sendAndWait({
    e: 'liftlocationonlunchbox',
    cmd: '70',
    text:
      action == 'setting'
        ? '5501' +
          vmcCmd.base16(Number(LayerPulse) * 100, 4) +
          vmcCmd.base16(Number(LunchBoxPulse) * 100, 4) +
          '0000'
        : '55000000',
    ts: Math.floor(Number(new Date())),
  });

  return await calwaitingevent('liftlocationonlunchbox');
};

maincontroll.temperaturecontroller = async (action, mode, temperature) => {
  var vmcact = sendAndWait({
    e: 'temperaturecontroller',
    cmd: '70',
    text:
      action == 'setting'
        ? '280100' + mode + vmcCmd.base16(temperature, 2)
        : '280000',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('temperaturecontroller');
};

maincontroll.temperaturecontrollerstatus = async () => {
  var vmcact = sendAndWait({
    e: 'temperaturecontrollerstatus',
    cmd: '70',
    text: '360000',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('temperaturecontrollerstatus');
};

maincontroll.temperaturecontrollerconnect = async (action, connect) => {
  var vmcact = sendAndWait({
    e: 'temperaturecontrollerconnect',
    cmd: '70',
    text:
      action == 'setting'
        ? '600100' + (connect == true ? '00' : '01')
        : '600000',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('temperaturecontrollerconnect');
};

maincontroll.connectliftsetting = async (action, connect, overcurrent) => {
  var vmcact = sendAndWait({
    e: 'connectliftsetting',
    cmd: '70',
    text:
      action == 'setting'
        ? '120100' +
          (connect == true ? '01' : '02') +
          (overcurrent == true ? '00' : '01')
        : '120000',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('connectliftsetting');
};

maincontroll.clearlifterror = async action => {
  var vmcact = sendAndWait({
    e: 'clearlifterror',
    cmd: '70',
    text: action == 'setting' ? '340100' : '340000',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('clearlifterror');
};

maincontroll.liftspeed = async (action, speed) => {
  var vmcact = sendAndWait({
    e: 'liftspeed',
    cmd: '70',
    text: action == 'setting' ? '520100' + vmcCmd.base16(speed, 2) : '520000',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('liftspeed');
};

maincontroll.liftsensitivity = async (action, sensitivity) => {
  var vmcact = sendAndWait({
    e: 'liftsensitivity',
    cmd: '70',
    text:
      action == 'setting' ? '530100' + vmcCmd.base16(sensitivity, 4) : '530000',
    ts: Math.floor(Number(new Date())),
  });
  return await calwaitingevent('liftsensitivity');
};

maincontroll.synchronization = async () => {
  return await sendAndWait({
    e: 'synchronization',
    cmd: '31',
    text: ``,
    ts: Math.floor(Number(new Date())),
  });
};

maincontroll.waitEvent = async ename => {
  return await calwaitingevent(ename);
};

maincontroll.delay2 = async () => {
  let result = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
  return result;
};

maincontroll.clearwait = function () {
  clearTimeout(eventchecktimeout);
  event_name_waiting = false; // clear self function;
};

maincontroll.open = async () => {
  console.log('open');
  return await OpenPort();
};

module.exports = maincontroll;
