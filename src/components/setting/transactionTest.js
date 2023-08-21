import * as React from 'react';
import * as RN from 'react-native';

const maincontroll = require('../../../maincontroll');

const TransactionTest = ({dismissModal}) => {
  const [change, setChange] = React.useState(0);
  const [moneys, setMoneys] = React.useState('');
  const [displayMoney, setDisplayMoney] = React.useState(0);
  const [openInput, setOpenInput] = React.useState(false);
  const [msgVending, setMsgVending] = React.useState('');
  const [slot, setSolt] = React.useState('');
  let inputMoney = 0;

  const onSetMoney = async () => {
    const callbackCoin = await maincontroll.setcoinaccept(true);
    //await maincontroll.delay2();
    const callbackBill = await maincontroll.setbillaccept(true);
    console.log('callbackCoin:', callbackCoin);
    console.log('callbackBill:', callbackBill);
    //await maincontroll.delay2();
    dispenseStatus();
    setMsgVending('Ready');
    maincontroll.on('receivemoney', async res => {
      console.log('AMOUNT:::::', res);
      inputMoney += Number(res.amount);
      console.log('SUM:::', inputMoney);
      setDisplayMoney(inputMoney);
      console.log('displayMoney', displayMoney);
      if (Number(inputMoney) >= Number(moneys)) {
        // let change = inputMoney - moneys;
        // changeMoney(change);
        MdbTurnOff();
        const callbackCoin2 = await maincontroll.setcoinaccept(false);
        const callbackBill2 = await maincontroll.setbillaccept(false);
        console.log('callbackCoin:', callbackCoin2);
        console.log('callbackBill:', callbackBill2);
        maincontroll.clearwait();
        await dispenseProduct();
      }
    });
  };

  const MdbTurnOff = () => {
    clearInterval(this.timerInterval);
    maincontroll.off('receivemoney');
    // maincontroll.off('dispense');
  };

  const dispenseProduct = async () => {
    const callbackDispense = await maincontroll.dispense(Number(slot));
    if (!callbackDispense.result && callbackDispense.code === '104001') {
      setMsgVending(callbackDispense.message);
      setTimeout(() => {
        refundMoney();
      }, 5000);
    } else if (!callbackDispense.result && callbackDispense.code === '50204') {
      setMsgVending(callbackDispense.message);
      setTimeout(() => {
        refundMoney();
      }, 5000);
    }
  };

  const changeMoney = async m => {
    console.log('changeMoney::', m);
    const callbackCoin = await maincontroll.setcoinaccept(false);
    await maincontroll.delay2();
    const callbackBill = await maincontroll.setbillaccept(false);
    console.log('callbackCoin:', callbackCoin);
    console.log('callbackBill:', callbackBill);
    await maincontroll.delay2();
    let CheckChange = Number(inputMoney) - Number(moneys);
    console.log(CheckChange);
    setChange(CheckChange);
    if (CheckChange > 0) {
      const changeCallback = await maincontroll.givechange(Number(CheckChange));
      console.log('givechange res =>', changeCallback);
      inputMoney = 0;
      setDisplayMoney(0);
      setMsgVending('');
      setChange(0);
      dismissModal();
    }
  };

  const dispenseStatus = () => {
    maincontroll.on('dispense',  res => {
      console.log('dispense status:', res);
      switch (res.code) {
        case '50401':
          setMsgVending(res.message);
          break;
        case '50402':
          setMsgVending(res.message);
          maincontroll.off('dispense');
          changeMoney();
          break;
        case '50204':
          setMsgVending(res.message);
           maincontroll.off('dispense');
          refundMoney();
          break;
        case '50410':
          setMsgVending(res.message);
          break;
        case '50411':
          setMsgVending(res.message);
          break;
        case '50441':
          setMsgVending(res.message);
          break;
        case '50403':
          setMsgVending(res.message);
           maincontroll.off('dispense');
          refundMoney();
          break;
        case '50205':
          setMsgVending(res.message);
           maincontroll.off('dispense');
          refundMoney();
          break;
        default:
          break;
      }
    });
  };

  const refundMoney = async () => {
    const givechange = await maincontroll.givechange(Number(inputMoney));
    console.log(givechange);
    dismissModal();
  };

  return (
    <RN.View style={{backgroundColor: '#fff'}}>
      <RN.View style={{paddingLeft: 20, paddingTop: 20}}>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          ทดสอบทำรายการ
        </RN.Text>
      </RN.View>
      <RN.View style={{width: '100%', padding: 20, flexDirection: 'row'}}>
        <RN.TextInput
          value={slot}
          keyboardType="number-pad"
          onChangeText={setSolt}
          placeholder="ระบุช่องสินค้า"
          maxLength={2}
          style={{
            width: 150,
            height: 80,
            padding: 20,
            backgroundColor: '#fff',
            margin: 10,
            borderRadius: 10,
            elevation: 5,
          }}
        />
        <RN.TextInput
          value={moneys}
          keyboardType="number-pad"
          onChangeText={setMoneys}
          placeholder="ระบุราคาสินค้า"
          maxLength={2}
          style={{
            width: 250,
            height: 80,
            padding: 20,
            backgroundColor: '#fff',
            margin: 10,
            borderRadius: 10,
            elevation: 5,
          }}
        />
        <RN.TouchableOpacity
          disabled={openInput}
          onPress={() => {
            onSetMoney();
          }}
          style={{
            width: 200,
            height: 80,
            padding: 20,
            margin: 10,
            backgroundColor: openInput ? '#ddd' : '#fff',
            alignItems: 'center',
            borderRadius: 10,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
            justifyContent: 'center',
          }}>
          <RN.Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
            }}>
            TEST
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View style={{paddingLeft: 20, marginBottom: 20}}>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          ยอดที่ได้รับ : {displayMoney}
        </RN.Text>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          เงินทอน : {change}
        </RN.Text>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          สถานะเครื่อง : {msgVending}
        </RN.Text>
      </RN.View>
      <RN.View
        style={{width: '100%', borderBottomColor: '#fff', borderBottomWidth: 1}}
      />
      <RN.TouchableOpacity
        disabled={openInput}
        onPress={() => {
          dismissModal();
        }}
        style={{
          width: 200,
          height: 80,
          padding: 20,
          margin: 10,
          backgroundColor: 'red',
          alignItems: 'center',
          borderRadius: 10,
          shadowColor: 'black',
          shadowOpacity: 0.3,
          shadowOffset: {width: 2, height: 0},
          shadowRadius: 10,
          elevation: 3,
          justifyContent: 'center',
        }}>
        <RN.Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff',
          }}>
          ปิด
        </RN.Text>
      </RN.TouchableOpacity>
    </RN.View>
  );
};

export default TransactionTest;
