import React from 'react';
import AllNavigator from './src/navigator';
import {RecoilRoot} from 'recoil';
import {LogBox} from 'react-native';
import Script from './src/script';

const maincontroll = require('./maincontroll');

export default function App() {
  LogBox.ignoreAllLogs();
  async function connectMDB() {
    await maincontroll.open();
    setTimeout(async () => {
      const callbackCoin = await maincontroll.setcoinaccept(false);
      const callbackBill = await maincontroll.setbillaccept(false);
      console.log(callbackCoin);
      console.log(callbackBill);
    }, 1000);
  }
  React.useEffect(() => {
    console.log('APP CONNECT MDB');
    connectMDB();
  }, []);
  return (
    <RecoilRoot>
      <AllNavigator />
    </RecoilRoot>
  );
}
