import * as React from 'react';
import * as RN from 'react-native';
const maincontroll = require('../../../maincontroll');

const GiveChange = () => {
  const [moneys, setMoneys] = React.useState(0);
  const [displayMoney, setDisplayMoney] = React.useState(0);
  const [openInput, setOpenInput] = React.useState(false);
  let inputMoney = 0;

  const onSetMoney = async () => {
    const callbackCoin = await maincontroll.setcoinaccept(true);
    //await maincontroll.delay2();
    const callbackBill = await maincontroll.setbillaccept(true);
    console.log('callbackCoin:', callbackCoin);
    console.log('callbackBill:', callbackBill);
    setOpenInput(true);
    //await maincontroll.delay2();
    maincontroll.on('receivemoney', res => {
      console.log('AMOUNT:::::', res);
      inputMoney += Number(res.amount);
      console.log('SUM:::', inputMoney);
      setDisplayMoney(inputMoney);
      console.log('displayMoney', displayMoney);
      if (Number(inputMoney) > Number(moneys)) {
        let change = inputMoney - moneys;
        changeMoney(change);
      }
    });
  };

  const changeMoney = async m => {
    console.log('changeMoney::', m);
    const callbackCoin = await maincontroll.setcoinaccept(false);
    //await maincontroll.delay2();
    const callbackBill = await maincontroll.setbillaccept(false);
    console.log('callbackCoin:', callbackCoin);
    console.log('callbackBill:', callbackBill);
    //await maincontroll.delay2();
    await maincontroll.givechange(Number(m), res => {
      console.log('givechange res =>', res);
      setOpenInput(false);
      inputMoney = 0;
      setDisplayMoney(0);
    });
    await maincontroll.setcoinaccept(false);
  };

  const refundMoney = async () => {
    const givechange = await maincontroll.givechange(Number(inputMoney));
    console.log(givechange);
  };

  return (
    <>
      <RN.View style={{paddingLeft: 20, paddingTop: 20}}>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          ทดสอบทอนเงิน
        </RN.Text>
      </RN.View>
      <RN.View style={{width: '100%', padding: 20, flexDirection: 'row'}}>
        <RN.TextInput
          editable={openInput ? false : true}
          keyboardType="number-pad"
          onChangeText={setMoneys}
          style={{
            width: 250,
            height: 80,
            padding: 20,
            backgroundColor: '#fff',
            margin: 10,
            borderRadius: 10,
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
            Set Money
          </RN.Text>
        </RN.TouchableOpacity>
        {openInput && (
          <>
            <RN.View
              style={{
                width: 260,
                height: 80,
                padding: 20,
                margin: 10,
                backgroundColor: '#fff',
                alignItems: 'flex-start',
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
                ยอดได้รับ : {displayMoney}
              </RN.Text>
            </RN.View>
            <RN.TouchableOpacity
              onPress={() => {
                refundMoney();
              }}
              style={{
                width: 140,
                height: 80,
                padding: 20,
                margin: 10,
                backgroundColor: '#ED213A',
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
                REFUND
              </RN.Text>
            </RN.TouchableOpacity>
          </>
        )}
      </RN.View>
      <RN.View
        style={{width: '100%', borderBottomColor: '#fff', borderBottomWidth: 1}}
      />
    </>
  );
};

export default GiveChange;
