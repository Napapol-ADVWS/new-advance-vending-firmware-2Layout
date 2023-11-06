// V.2.6.0

const stx = 'fafb'; // Start of packet
var queue = []; // Command queue
var Buffer = require('buffer/').Buffer;

var runningPackage = 1;
var vmcact = 0;

function vmcCmd() {
  self = this;
}

vmcCmd.prototype.selectionNumber = function (n) {
  this.selectionNumber = n;
};

/// Internal Function
function CRC(d) {
  let b = Buffer.from(d, 'hex');
  let crc = 0;
  for (let x = 0; x < b.length; x++) {
    crc ^= b[x];
  }
  return crc;
}
///////////////

vmcCmd.act = Buffer.from('fafb420043', 'hex'); // Act Package

vmcCmd.base10 = function (n) {
  return parseInt(n, 16).toString();
};

vmcCmd.base16 = function (n, s) {
  return Number(n).toString(16).padStart(s, '0');
};

vmcCmd.getPackage = function () {
  if (runningPackage && runningPackage + 1 > 255) {
    runningPackage = 1;
    return 1;
  } else {
    return runningPackage + 1;
  }
};

vmcCmd.genCommand = function (q) {
  let packages = this.getPackage(); // + 30;
  runningPackage++;
  if (!packages || packages > 255) return '1001';
  //let q = this.getQueue();
  if (!q) return '1002';
  let cl = this.base16(
    Buffer.from(this.base16(packages, 2) + q.text, 'hex').length,
    2,
  );
  let content = stx + q.cmd + cl + this.base16(packages, 2) + q.text;
  return Buffer.concat([
    Buffer.from(content, 'hex'),
    Buffer.from(this.base16(CRC(content) & 0xff, 2), 'hex'),
  ]);
};

vmcCmd.decodeText = function (message) {
  let s = message.indexOf(stx) == 0 ? 0 : 0;
  let l = Number(vmcCmd.base10(message.substring(s + 6, s + 8))) * 2;
  let e = l + 10;
  let nextstx = message.indexOf(stx, 1);
  if (nextstx != -1) e = nextstx;
  let mess = message.substring(s, e);
  if (mess.length == l + 10) {
    let d = {
      message: mess,
      command: mess.substring((s += 4), (s += 2)),
      length: mess.substring(s, (s += 2)),
      packNo: mess.substring(s, (s += 2)),
      text: mess.substring(s, mess.length - 2),
      crc: mess.substring(mess.length - 2, e),
    };
    d = defineStatus(d);
    return d;
  } else {
    return false;
  }
};

function defineStatus(data) {
  let s = 0;
  let txt = data.text;
  if (data.command == '02') {
    data.title = 'Selection Number';
    data.status = txt.substring(s, (s += 2));
    data.statusText = '';
    switch (data.status) {
      case '01':
        data.statusText = 'Normal';
        break;
      case '02':
        data.statusText = 'Out of stock';
        break;
      case '03':
        data.statusText = 'selection doesn’t exist';
        break;
      case '04':
        data.statusText = 'selection pause';
        break;
      case '05':
        data.statusText = 'There is product inside elevator';
        break;
      case '06':
        data.statusText = 'Delivery door unlocked';
        break;
      case '07':
        data.statusText = 'Elevator error';
        break;
      case '08':
        data.statusText = 'Elevator self-checking faulty';
        break;
      case '09':
        data.statusText = 'Microwave oven delivery door closing error';
        break;
      case '10':
        data.statusText = 'Microwave oven inlet door opening error';
        break;
      case '11':
        data.statusText = 'Microwave oven inlet door closing error';
        break;
      case '12':
        data.statusText = 'Didn’t detect box lunch';
        break;
      case '13':
        data.statusText = 'Box lunch is heating';
        break;
      case '14':
        data.statusText = 'Microwave oven delivery door opening error';
        break;
      case '15':
        data.statusText = ' Please take out the lunch box in the microwave';
        break;
      case '16':
        data.statusText = 'Staypole return error';
        break;
      case '17':
        data.statusText = 'Main motor fault';
        break;
      case '18':
        data.statusText = 'Translation motor fault';
        break;
      case '19':
        data.statusText = 'Staypole push error';
        break;
      case '21':
        data.statusText = 'Elevator entering microwave oven error';
        break;
      case '22':
        data.statusText = 'Pushrod pushing error in microwave oven';
        break;
      case '23':
        data.statusText = 'Pushrod returning error in microwave oven';
        break;
      default:
        'Unknown Status';
    }
    data.selectionNumber = vmcCmd.base10(txt.substring(s));
  } else if (data.command == '04') {
    data.title = 'Dispensing Status';
    data.status = txt.substring(s, (s += 2));
    data.selectionNumber = vmcCmd.base10(txt.substring(s, (s += 4)));
    data.microwaveNumber = txt.substring(s);
    let status = '';
    switch (data.status) {
      case '01':
        status = 'Dispensing';
        break;
      case '02':
        status = 'Dispensing successfully';
        break;
      case '03':
        status = 'Selection jammed';
        break;
      case '04':
        status = 'Motor doesn’t stop normally';
        break;
      case '06':
        status = 'Motor doesn’t exist';
        break;
      case '07':
        status = 'Elevator error';
        break;
      case '10':
        status = 'Elevator is ascending';
        break;
      case '11':
        status = 'Elevator is descending';
        break;
      case '12':
        status = 'Elevator ascending error';
        break;
      case '13':
        status = 'Elevator descending error';
        break;
      case '14':
        status = 'Microwave delivery door is closing';
        break;
      case '15':
        status = 'Microwave delivery door closing error';
        break;
      case '16':
        status = 'Microwave inlet door is opening';
        break;
      case '17':
        status = 'Microwave inlet door opening error';
        break;
      case '18':
        status = 'Pushing lunch box into microwave';
        break;
      case '19':
        status = 'Microwave inlet door is closing';
        break;
      case '20':
        status = 'Microwave inlet door closing error';
        break;
      case '21':
        status = 'Don’t detect lunch box in microwave';
        break;
      case '22':
        status = 'Lunch box is heating';
        break;
      case '23':
        status = 'Lunch box heating remaining time, second';
        break;
      case '24':
        status = 'Please take out the lunch box (successful purchase)';
        break;
      case '25':
        status = 'Staypole return error';
        break;
      case '26':
        status = 'Microwave delivery door is opening';
        break;
      case '28':
        status = 'Staypole push error';
        break;
      case '29':
        status = 'Elevator entering microwave oven error';
        break;
      case '30':
        status = 'Elevator exiting microwave oven error';
        break;
      case '31':
        status = 'Pushrod pushing error in microwave oven';
        break;
      case '32':
        status = 'Pushrod returing error in microwave oven';
        break;
      case '40':
        status = 'product was picked up from delivery box';
        break;
      case '41':
        status = 'delivery door is opened';
        break;
      case '42':
        status = 'delivery door is closed';
        break;
      case 'ff':
        status = 'Purchase terminated';
        break;
      default:
        'Unknown Status';
    }
    data.statusText = status;
  } else if (data.command == '11') {
    data.title = 'Selection Price, Inventory, Capacity And Product ID';
    data.selectionNumber = vmcCmd.base10(txt.substring(s, (s += 4))).toString();
    data.selectionPrice = vmcCmd.base10(txt.substring(s, (s += 8))).toString();
    data.selectionInventory = txt.substring(s, (s += 2));
    data.selectionCapacity = txt.substring(s, (s += 2));
    data.selectionCommodityNumber = txt.substring(s, (s += 4));
    data.selectionStatus = txt.substring(s);
  } else if (data.command == '21') {
    data.title = 'Receives Money';
    data.mode = vmcCmd.base10(txt.substring(s, (s += 2)));
    data.amount = txt !== '' ? vmcCmd.base10(txt.substring(s, (s += 8))) : '';
    data.cardNumber = txt.substring(s);
    let txtMode = '';
    switch (data.mode.toString()) {
      case '1':
        txtMode = 'Bill';
        break;
      case '2':
        txtMode = 'Coin';
        break;
      case '3':
        txtMode = 'IC card';
        break;
      case '4':
        txtMode = 'Bank card';
        break;
      case '5':
        txtMode = 'Wechat payment';
        break;
      case '6':
        txtMode = 'Alipay';
        break;
      case '7':
        txtMode = 'Jingdong Pay';
        break;
      case '8':
        txtMode = 'Swallowing money';
        break;
      case '9':
        txtMode = 'Union scan pay';
        break;
      default:
        'Unknown Mode';
    }
    data.modeText = txtMode;
  } else if (data.command == '23') {
    data.title = 'Current Amount';
    data.amount = vmcCmd.base10(txt);
  } else if (data.command == '26') {
    data.title = 'Returns Amount VMC Gives';
    data.billChange = vmcCmd.base10(txt.substring(s, (s += 8)));
    data.coinChange = vmcCmd.base10(txt.substring(s));
  } else if (data.command == '29') {
    data.title = 'Sets whether notes and coins are Received';
    data.status = txt.substring(s);
    data.statusText =
      data.status == '00'
        ? 'setting succeeded'
        : data.status == '01'
        ? 'setting failed'
        : 'Unknown';
  } else if (data.command == '52') {
    data.title = 'Acquire Machine Status';
    data.billAcceptStatus = txt.substring(s, (s += 2));
    data.billAccept = data.billAcceptStatus == '00' ? 'yes' : 'no';
    data.coinAcceptStatus = txt.substring(s, (s += 2));
    data.coinAccept = data.coinAcceptStatus == '00' ? 'yes' : 'no';
    data.cardReaderStatus = txt.substring(s, (s += 2));
    data.cardReader = data.cardReaderStatus == '00' ? 'yes' : 'no';
    data.temperatureControllerStatus = txt.substring(s, (s += 2));
    data.temperatureController =
      data.temperatureControllerStatus == '00' ? 'yes' : 'no';
    data.temperature = txt.substring(s, (s += 2));
    data.temperatureText =
      data.temperature != '' ? vmcCmd.base10(data.temperature) : '';
    if (Number(data.temperatureText) > 100) {
      data.temperatureText = Number(data.temperatureText) - 256;
    }
    data.doorStatus = txt.substring(s, (s += 2));
    data.doorStatusText = data.doorStatus == '00' ? 'close' : 'open';
    data.billChange = txt.substring(s, (s += 8));
    data.billChangeText = vmcCmd.base10(data.billChange);
    data.coinChange = txt.substring(s, (s += 8));
    data.coinChangeText = vmcCmd.base10(data.coinChange);
    data.machineIdNumber = txt.substring(s, (s += 20));
    data.machineHumidity = txt.substring(s, (s += 16));
    data.productInsideElevator = txt.substring(s, (s += 2));
    data.productInsideElevatorText =
      data.productInsideElevator == '00' ? 'no' : 'yes';
    data.pickupDoor = txt.substring(s, (s += 2));
    data.pickupDoorText = data.pickupDoor == '00' ? 'open' : 'close';
  } else if (data.command == '71') {
    data.commandType = txt.substring(0, (s += 2));
    data.operationType = txt.substring(s, (s += 2));
    data = defineStatusM(data);
  }

  return data;
}

function defineStatusM(data) {
  let s = 0;
  let txt = data.text;
  data.commandType = txt.substring(s, (s += 2));
  data.operationType = txt.substring(s, (s += 2));
  if (data.commandType == '01') {
    data.title = 'Coin system setting';
    if (data.operationType == '00') {
      data.status = '00';
      data.statusText = 'ok';
      data.coinsystemtype = txt.substring(s, (s += 2));
      data.coinsystemtypeText =
        data.coinsystemtype == '01'
          ? 'Coin acceptor'
          : data.coinsystemtype == '02'
          ? 'HOPPER'
          : 'Unknown';
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Set failed'
          : 'Unknown';
    }
  } else if (data.commandType == '02') {
    data.title = 'Selection mode setting';
    if (data.operationType == '00') {
      data.status = '00';
      data.statusText = 'ok';
      data.selectionmode = txt.substring(s, (s += 2));
      data.selectionmodeText =
        data.selectionmode == '01'
          ? 'Spiral'
          : data.selectionmode == '02'
          ? 'Belt'
          : data.selectionmode == '03'
          ? 'Belt'
          : 'Unknown';
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Set failed'
          : 'Unknown';
    }
  } else if (data.commandType == '03') {
    data.title = 'Motor AD setting';
    if (data.operationType == '00') {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Read successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
      data.motorAD = txt.substring(s, (s += 2));
      data.motorADText = vmcCmd.base10(data.motorAD);
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
    }
  } else if (data.commandType == '04') {
    data.title = 'Selection coupling setting';
    if (data.operationType == '00') {
      data.status = '00';
      data.statusText = 'ok';
      data.couplingstatus = txt.substring(s, (s += 2));
      data.couplingstatusText =
        data.couplingstatus == '01'
          ? 'No coupling'
          : data.couplingstatus == '02'
          ? '2 selections coupling'
          : data.couplingstatus == '03'
          ? '3 selections coupling'
          : 'Unknown';
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Set failed'
          : 'Unknown';
    }
  } else if (data.commandType == '05') {
    data.title = 'Clear selection coupling';
    data.status = txt.substring(s, (s += 2));
    data.statusText =
      data.status == '00'
        ? 'Set successfully'
        : data.status == '01'
        ? 'Set failed'
        : 'Unknown';
  } else if (data.commandType == '12') {
    data.title = 'Connecting Lift Setting';
    if (data.operationType == '00') {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Read successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
      data.connectlift = txt.substring(s, (s += 2));
      data.connectliftText =
        data.connectlift == '01'
          ? 'YES'
          : data.connectlift == '02'
          ? 'NO'
          : 'Unknown';
      data.overcurrentprotection = txt.substring(s, (s += 2));
      data.overcurrentprotectionText =
        data.overcurrentprotection == '00'
          ? 'YES'
          : data.overcurrentprotection == '01'
          ? 'NO'
          : 'Unknown';
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Set failed'
          : 'Unknown';
    }
  } else if (data.commandType == '18') {
    data.title = 'Bill Value Accepted Setting';
    if (data.operationType == '00') {
      data.status = '00';
      data.statusText = 'ok';
      data.billvalueacceptedonmachine = txt.substring(s, (s += 2));
      data.billvalueacceptedonmachineText = vmcCmd.base10(
        data.billvalueacceptedonmachine,
      );
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Set failed'
          : 'Unknown';
    }
  } else if (data.commandType == '28') {
    data.title = 'Temperature Controller Setting';
    if (data.operationType == '00') {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Read successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
      data.mode = txt.substring(s, (s += 2));
      data.modeText =
        data.mode == '01'
          ? 'Heating mode'
          : data.mode == '02'
          ? 'Refrigeration mode'
          : data.mode == '03'
          ? 'Constant temperature'
          : data.mode == '04'
          ? 'Close'
          : 'Unknown';
      data.temperature = txt.substring(s, (s += 2));
      data.temperatureText =
        data.temperature != '' ? vmcCmd.base10(data.temperature) : '';
      data.minTemperature = txt.substring(s, (s += 2));
      data.minTemperatureText =
        data.minTemperature != '' ? vmcCmd.base10(data.minTemperature) : '';
      data.maxTemperature = txt.substring(s, (s += 2));
      data.maxTemperatureText =
        data.maxTemperature != '' ? vmcCmd.base10(data.maxTemperature) : '';
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
    }
  } else if (data.commandType == '32') {
    data.title = 'Clear Jammed Selection';
    if (data.operationType == '00') {
      data.selectionNumber = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.jammedSelectionN = txt.substring(s, (s += 4));
      data.selectionNumber2 = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.beltSelectionSelfTestFailureN = txt.substring(s, (s += 4));
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Clear successfully'
          : data.status == '01'
          ? 'Clear failed'
          : 'Unknown';
    }
  } else if (data.commandType == '34') {
    data.title = 'Clear Lift Error';
    if (data.operationType == '00') {
      data.status = '00';
      data.statusText = 'ok';
      data.lifterrortimes = txt.substring(s);
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Clear successfully'
          : data.status == '01'
          ? 'Clear failed'
          : 'Unknown';
    }
  } else if (data.commandType == '33') {
    data.title = 'Clear Motor Error';
    if (data.operationType == '00') {
      data.selectionNumber = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.motorErrorN = txt.substring(s);
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Clear successfully'
          : data.status == '01'
          ? 'Clear failed'
          : 'Unknown';
    }
  } else if (data.commandType == '36') {
    data.title = 'Query Temperature Controller Status';
    data.status = txt.substring(s, (s += 2));
    data.statusText =
      data.status == '00'
        ? 'Read successfully'
        : data.status == '01'
        ? 'Slave machine communication error'
        : 'Unknown';
    data.temperature = txt.substring(s, (s += 2));
    data.temperatureText =
      data.temperature != '' ? vmcCmd.base10(data.temperature) : '';
    data.temperaturecontrollerstatus = txt.substring(s, (s += 2));
    data.temperaturecontrollerstatusText =
      data.temperaturecontrollerstatus == '00'
        ? 'Normal'
        : data.temperaturecontrollerstatus == '01'
        ? 'Excessive compressor current'
        : data.temperaturecontrollerstatus == '02'
        ? 'Compressor broken circuit'
        : data.temperaturecontrollerstatus == '03'
        ? 'Excessive current of Evaporating fan'
        : data.temperaturecontrollerstatus == '04'
        ? 'Evaporating fan broken circuit'
        : data.temperaturecontrollerstatus == '05'
        ? 'Excessive current of condensation fan'
        : data.temperaturecontrollerstatus == '06'
        ? 'Condensation fan broken circuit'
        : data.temperaturecontrollerstatus == '07'
        ? 'Temperature sensor error'
        : 'Unknown';
  } else if (data.commandType == '37') {
    data.title = 'Temperature Controller Parameters Setting';
    if (data.operationType == '00') {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Read successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
      data.lowesttemperature = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.highesttemperature = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.returndifferencevalue = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.delaystartingtime = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.sensorcorrection = vmcCmd.base10(txt.substring(s, (s += 2)));
      if (Number(data.sensorcorrection) > 100)
        data.sensorcorrection = Number(data.sensorcorrection) - 255;
      data.defrostingperiod = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.defrostingtime = vmcCmd.base10(txt.substring(s, (s += 2)));
      data.protect = txt.substring(s);
      data.protectText =
        data.protect == '01' ? 'ON' : data.protect == '00' ? 'OFF' : 'unknown';
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
    }
  } else if (data.commandType == '38') {
    data.title = 'Selection Test';
    data.status = txt.substring(s, (s += 2));
    data.statusText =
      data.status == '00'
        ? 'Successful'
        : data.status == '01'
        ? 'The motor can’t stop properly '
        : data.status == '02'
        ? 'Selection doesn’t exist '
        : data.status == '03'
        ? 'Communication error '
        : data.status == '04'
        ? 'Motor short circuit'
        : 'Unknown';
  } else if (data.commandType == '39') {
    data.title = 'Bill Low-change Setting';
    data.status = txt.substring(s, (s += 2));
    data.statusText =
      data.status == '00'
        ? 'Change Completed'
        : data.status == '01'
        ? 'Change Error'
        : 'Unknown';
    data.changeCoinNumber = Number(vmcCmd.base10(txt.substring(s))) / 2;
  } else if (data.commandType == '40') {
    data.title = 'Query Coin Number';
    data.status = txt.substring(s, (s += 2));
    data.statusText =
      data.status == '00'
        ? 'Coin Acceptor Normal'
        : data.status == '01'
        ? 'Coin Acceptor Fully'
        : 'Unknown';
    data.coinAmountText = txt.substring(s, (s += 8));
    data.coinAmount = vmcCmd.base10(data.coinAmountText);
    data.channelAmount = txt.substring(s);
    data.coin1Slot1 = txt.substring(s, (s += 2));
    data.coin1Slot1Text = vmcCmd.base10(data.coin1Slot1);
    data.coin1Slot2 = txt.substring(s, (s += 2));
    data.coin1Slot2Text = vmcCmd.base10(data.coin1Slot2);
    data.coin1Slot3 = txt.substring(s, (s += 2));
    data.coin1Slot3Text = vmcCmd.base10(data.coin1Slot3);
    data.coin5Slot1 = txt.substring(s, (s += 2));
    data.coin5Slot1Text = vmcCmd.base10(data.coin5Slot1);
    data.coin5Slot2 = txt.substring(s, (s += 2));
    data.coin5Slot2Text = vmcCmd.base10(data.coin5Slot2);
    data.coin10Slot1 = txt.substring(s, (s += 2));
    data.coin10Slot1Text = vmcCmd.base10(data.coin10Slot1);
    data.coin10Slot2 = txt.substring(s, (s += 2));
    data.coin10Slot2Text = vmcCmd.base10(data.coin10Slot2);
    data.totalCoinAmount = Number(data.coinAmount) / 100;
    data.coin1 =
      Number(data.coin1Slot1Text) +
      Number(data.coin1Slot2Text) +
      Number(data.coin1Slot3Text);
    data.coin2 = Number(data.coin2Slot1Text);
    data.coin5 = Number(data.coin5Slot1Text) + Number(data.coin5Slot2Text);
    data.coin10 = Number(data.coin10Slot1Text) + Number(data.coin10Slot2Text);
    data.other = txt.substring(s);
  } else if (data.commandType == '51') {
    data.title = 'Lift layer-location';
    if (data.operationType == '00') {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Read successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
      data.pulse = txt.substring(s);
      data.pulseValue = vmcCmd.base10(data.pulse);
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
      data.locationStatus = txt.substring(s, (s += 2));
      data.locationStatusText =
        data.locationStatus == '00'
          ? 'Successfully'
          : data.locationStatus == '01'
          ? 'Delivery door isn’t closed'
          : data.locationStatus == '02'
          ? 'Lift self-checking failed'
          : 'Unknown';
    }
  } else if (data.commandType == '52') {
    data.title = 'Lift Speed';
    if (data.operationType == '00') {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Read successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
      data.liftspeed = txt.substring(s);
      data.liftspeedText = vmcCmd.base10(data.liftspeed);
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
    }
  } else if (data.commandType == '53') {
    data.title = 'Lift Sensitivity Setting';
    if (data.operationType == '00') {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Read successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
      data.liftsensitivity = txt.substring(s);
      data.liftsensitivityText = vmcCmd.base10(data.liftsensitivity);
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Slave machine communication error'
          : 'Unknown';
    }
  } else if (data.commandType == '54') {
    data.title = 'Lift Test';
    data.status = txt.substring(s, (s += 2));
    data.statusText =
      data.status == '00'
        ? 'Set successfully'
        : data.status == '01'
        ? 'Slave machine communication error'
        : 'Unknown';
    data.testresult = txt.substring(s, (s += 2));
    data.testresultText =
      data.testresult == '00'
        ? 'Normal'
        : data.testresult == '01'
        ? 'Lift overload'
        : data.testresult == '02'
        ? 'Anti-theft board error'
        : data.testresult == '03'
        ? 'Delivery door unlocked'
        : data.testresult == '04'
        ? 'Translation motor overload'
        : 'Unknown';
  } else if (data.commandType == '55') {
    data.title = 'Microwave Location on Lunch Box Machine';
    if (data.operationType == '00') {
      data.status = '00';
      data.statusText = 'ok';
      data.layerPulse = txt.substring(s, (s += 4));
      data.layerPulseText = vmcCmd.base10(data.layerPulse);
      data.lunchboxPulse = txt.substring(s, (s += 4));
      data.lunchboxPulseText = vmcCmd.base10(data.lunchboxPulse);
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Successfully'
          : data.status == '01'
          ? 'Failed'
          : 'Unknown';
    }
  } else if (data.commandType == '57') {
    data.title = 'Mechanism Function Test on Box Lunch Machine';
    data.status = txt.substring(s, (s += 2));
    data.statusText =
      data.status == '00'
        ? 'Successfully'
        : data.status == '01'
        ? 'Failed'
        : 'Unknown';
  } else if (data.commandType == '58') {
    data.title = 'Lunch Box Machine Test';
    data.status = '00';
    data.statusText = 'ok';
    data.testresult = txt.substring(s, (s += 2));
    data.testresultText =
      data.testresult == '00'
        ? 'Normal'
        : data.testresult == '01'
        ? 'Lift overload'
        : data.testresult == '02'
        ? 'Main Motor overload'
        : data.testresult == '03'
        ? 'Translation motor overload'
        : data.testresult == '04'
        ? 'Back door open error'
        : data.testresult == '05'
        ? 'Back door close error'
        : data.testresult == '06'
        ? 'Front door open error'
        : data.testresult == '07'
        ? 'Front door close error'
        : 'Unknown';
  } else if (data.commandType == '60') {
    data.title = 'Connecting Temperature Controller';
    if (data.operationType == '00') {
      data.connecttemperaturecontroller = txt.substring(s, (s += 2));
      data.connecttemperaturecontrollerText =
        data.connecttemperaturecontroller == '00'
          ? 'YES'
          : data.status == '01'
          ? 'NO'
          : 'Unknown';
    } else {
      data.status = txt.substring(s, (s += 2));
      data.statusText =
        data.status == '00'
          ? 'Set successfully'
          : data.status == '01'
          ? 'Set failed'
          : 'Unknown';
    }
  }

  return data;
}

module.exports = vmcCmd;
