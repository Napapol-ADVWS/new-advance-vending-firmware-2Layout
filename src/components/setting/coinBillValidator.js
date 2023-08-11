import * as React from 'react';
import * as RN from 'react-native';
const maincontroll = require('../../../maincontroll');

const CoinBillVaildator = () => {
  const [COIN, setCOIN] = React.useState(false);
  const [BILL, setBILL] = React.useState(false);
  const [COIN_STATUS, setCOIN_STATUS] = React.useState('');
  const [BILL_STATUS, setBILL_STATUS] = React.useState('');

  const controlCoin = async () => {
    if (COIN) {
      // await maincontroll.setcoinaccept(false, res => {
      //   console.log('COIN:', res);
      //   setCOIN(false);
      // });
      const callback = await maincontroll.setcoinaccept(false);
      console.log('COIN', callback);
      setCOIN_STATUS(callback.message);
      if (callback.result) {
        setCOIN(false);
      }
    } else {
      // await maincontroll.setcoinaccept(true, res => {
      //   console.log('COIN:', res);
      //   setCOIN(true);
      // });
      const callback = await maincontroll.setcoinaccept(true);
      console.log('COIN', callback);
      setCOIN_STATUS(callback.message);
      if (callback.result) {
        setCOIN(true);
      }
    }
  };

  const controlBill = async () => {
    if (BILL) {
      // await maincontroll.setbillaccept(false, res => {
      //   console.log('BILL:', res);
      //   setBILL(false);
      // });
      const callback = await maincontroll.setbillaccept(false);
      console.log('BILL:', callback);
      setBILL_STATUS(callback.message);
      if (callback.result) {
        setBILL(false);
      }
    } else {
      // await maincontroll.setbillaccept(true, res => {
      //   console.log('BILL:', res);
      //   setBILL(true);
      // });
      const callback = await maincontroll.setbillaccept(true);
      console.log('BILL:', callback);
      if (callback.result) {
        setBILL(true);
      }
    }
  };
  return (
    <>
      <RN.View style={{paddingLeft: 20, paddingTop: 20}}>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          เปิด / ปิด ตัวรับเหรียญและแบงค์
        </RN.Text>
      </RN.View>
      <RN.View style={{width: '100%', padding: 20, flexDirection: 'row'}}>
        <RN.TouchableOpacity
          onPress={() => {
            controlCoin();
          }}
          style={{
            width: 150,
            height: 150,
            padding: 20,
            margin: 10,
            backgroundColor: COIN ? 'green' : 'red',
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
            Coin {COIN ? 'ON' : 'OFF'}
          </RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => {
            controlBill();
          }}
          style={{
            width: 150,
            height: 150,
            padding: 20,
            margin: 10,
            backgroundColor: BILL ? 'green' : 'red',
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
            Bill {BILL ? 'ON' : 'OFF'}
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.Text>สถานะเครื่องรับเหรียญ : {COIN_STATUS}</RN.Text>
      <RN.Text>สถานะเครื่องรับธนบัตร : {BILL_STATUS}</RN.Text>
      <RN.View
        style={{width: '100%', borderBottomColor: '#fff', borderBottomWidth: 1}}
      />
    </>
  );
};

export default CoinBillVaildator;
