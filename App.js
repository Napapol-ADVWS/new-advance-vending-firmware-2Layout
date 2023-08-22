import React from 'react';
import AllNavigator from './src/navigator';
import {RecoilRoot} from 'recoil';
import {LogBox} from 'react-native';

const maincontroll = require('./maincontroll');

export default function App() {
  LogBox.ignoreAllLogs();
  async function connectMDB() {
    await maincontroll.open();
    setTimeout(async () => {
      await maincontroll.setcoinaccept(false);
      await maincontroll.setbillaccept(false);
      await maincontroll.clearselectionjammed('clear');
      await maincontroll.clearmotorerror('clear');
      await maincontroll.clearlifterror('clear');
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
