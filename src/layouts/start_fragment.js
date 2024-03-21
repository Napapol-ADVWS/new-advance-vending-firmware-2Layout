/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as RN from 'react-native';
import * as navigate from '../navigator/RootNavigation';
import STORE from '../storage';
import * as GLOBAL from '../globalState';
import {useSetRecoilState, useRecoilState} from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import POST from '../protocol';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import MQTTConnection from '../MQTTConnection';
import Script from '../script';
import {Styles} from '../styles/splash_style';
import LinearGradient from 'react-native-linear-gradient';
import Signal from '../components/shelf/Signal';
import G from '../globalVar';

const maincontroll = require('../../maincontroll');
let optionsMqtt = {};
let onlyfirsttime = false;
var checkInMQTT = false;
export default function StartScreen() {
  const [isLoading, setIsLoading] = React.useState(0);
  const [isInventory] = useRecoilState(GLOBAL.inventory);
  const [isPaymentMethod] = useRecoilState(GLOBAL.payment_method);
  const inventory = useSetRecoilState(GLOBAL.inventory);
  const ads = useSetRecoilState(GLOBAL.ads);
  const payment_method = useSetRecoilState(GLOBAL.payment_method);
  const cash_method = useSetRecoilState(GLOBAL.cash_method);
  const category = useSetRecoilState(GLOBAL.category);
  const inventoryAll = useSetRecoilState(GLOBAL.inventoryAll);
  const productInsideElevator = useSetRecoilState(GLOBAL.productInsideElevator);
  const pickupDoor = useSetRecoilState(GLOBAL.pickupDoor);
  const temperature = useSetRecoilState(GLOBAL.temperature);
  const videoReady = useSetRecoilState(GLOBAL.videoReady);
  const blockRefundMoney = useSetRecoilState(GLOBAL.blockRefundMoney);
  const setSignal = useSetRecoilState(GLOBAL.signals);
  const adsDownload = useSetRecoilState(GLOBAL.adsDownload);
  const adsDownloadPer = useSetRecoilState(GLOBAL.adsDownloadPer);
  const startDownlaod = useSetRecoilState(GLOBAL.startDownlaod);

  React.useEffect(() => {
    clearInterval(checkInMQTT);
    runApp();
  }, []);

  const runApp = () => {
    STORE.getItem('BLOCKREFUND', call => {
      setIsLoading(10);
      console.log('BLOCKREFUND===>', call, typeof call.data);
      G.blockRefundMoney = call.data;
      blockRefundMoney(call.data);
      Script.vendingStatus(productInsideElevator, pickupDoor, temperature);
      getKisokData(res => {
        console.log('START:::', res);
        if (res) {
          if (isInventory.length <= 0 && isPaymentMethod.length <= 0) {
            setIsLoading(30);
            console.log(optionsMqtt);
            checkToken();
          } else {
            console.log('isInventory:', isInventory);
            console.log('isPaymentMethod:', isPaymentMethod);
            setIsLoading(100);
          }
        } else {
          setIsLoading(100);
          navigate.navigate('Setting');
        }
      });
    });
  };

  const getKisokData = cb => {
    let checkKioskID = false;
    let checkRegisterKey = false;
    STORE.getItem('KIOSKID', res1 => {
      if (res1.result) {
        setIsLoading(10);
        optionsMqtt.kiosk = res1.data;
        G.KIOSKID = res1.data;
        checkKioskID = true;
      }
      STORE.getItem('REGISTERKEY', res2 => {
        if (res2.result) {
          setIsLoading(20);
          optionsMqtt.registerKey = res2.data;
          G.REGISTERKEY = res2.data;
          checkRegisterKey = true;
        }
        if (checkKioskID && checkRegisterKey) {
          cb(true);
        } else {
          cb(false);
        }
      });
    });
  };

  const checkToken = async () => {
    let tokendata = await AsyncStorage.getItem('TOKEN');
    console.log('get:', tokendata);
    if (!tokendata) {
      registerServer();
    } else {
      let decodedToken = jwt_decode(tokendata);
      if (decodedToken.exp < moment().unix()) {
        setIsLoading(40);
        registerServer();
      } else {
        setIsLoading(40);
        optionsMqtt.token = tokendata;
        optionsMqtt.publish = decodedToken.publish;
        optionsMqtt.subscribe = decodedToken.subscribe;
        G.TOKEN = tokendata;
        G.OWNER = decodedToken.owner;
        G.PUBLISH = decodedToken.publish;
        G.SUBSCRIBE = decodedToken.subscribe;
        G.decodeToken = decodedToken;
        connectMQTT(tokendata);
        console.log('decode::::', decodedToken);
      }
    }
  };

  const registerServer = () => {
    let postdata = {
      kioskID: optionsMqtt.kiosk,
      registerKey: optionsMqtt.registerKey,
    };
    POST.register(postdata, callback => {
      console.log('renew token', callback);
      setIsLoading(50);
      if (callback.code === 200 && callback.data) {
        optionsMqtt.token = callback.data.token;
        optionsMqtt.publish = callback.data.publish;
        optionsMqtt.subscribe = callback.data.subscribe;
        thisSetToken(callback.data.token);
        G.OWNER = callback.data.owner;
        G.PUBLISH = callback.data.publish;
        G.SUBSCRIBE = callback.data.subscribe;
        G.decodeToken = callback.data;
        connectMQTT(callback.data.token);
      }
    });
  };

  const thisSetToken = token => {
    setIsLoading(60);
    STORE.setItem('TOKEN', token, response => {
      if (response.result) {
        G.TOKEN = response.data;
      }
    });
  };

  const connectMQTT = token => {
    setIsLoading(70);
    console.log(optionsMqtt);
    console.log('checkConnectMQTT');
    checkConnectMQTT();
    MQTTConnection.connect(
      optionsMqtt.token,
      String(optionsMqtt.kiosk),
      optionsMqtt.subscribe,
      optionsMqtt.publish,
      async callback => {
        console.log('MQTT callback::', callback);
        switch (callback.cmd) {
          case 'restart_app':
            console.log('restart', typeof callback);
            let payload = G.decodeToken;
            let objData = JSON.stringify(callback.data);
            payload.payload = {cronID: objData.cronID};
            // publicCron(ClientData, payload, result => {
            //   if (result) {
            //     Restart.restart();
            //   }
            // });
            break;
          case 'setup_inventory':
            inventory(callback.inventory);
            inventoryAll(callback.inventory);
            let arrayCategory = [
              {
                _id: 'all',
                categoryName: 'ALL',
              },
            ];
            if (callback.category) {
              arrayCategory = arrayCategory.concat(callback.category);
            }
            category(arrayCategory);
            onlyfirsttime = true;
            setIsLoading(100);
            break;
          case 'setup_ads':
            if (
              callback.config.ads &&
              typeof callback.config.ads === 'string'
            ) {
              if (callback.config.ads === '') {
                console.log('close ads');
                videoReady(false);
              } else {
                console.log('setup_ads:', callback.config.ads);
                Script.checkURLVideo(
                  callback.config.ads,
                  adsDownload,
                  adsDownloadPer,
                  ads,
                  videoReady,
                  startDownlaod,
                  res => {
                    console.log(res);
                    // if (res) {
                    //   ads(res);
                    //   videoReady(true);
                    // }
                  },
                );
              }
            }
            break;
          case 'setup_qr_payment_method':
            payment_method(callback.method);
            break;
          case 'open_cash_payment':
            console.log('APP OPEN CASH');
            cash_method(true);
            break;
          case 'qr_payment_result':
            console.log('SAVE QR RESULT');
            G.QRPaymentResult = callback.result;
            break;
          case 'clear_jammed':
            const callbackClearJammed = await maincontroll.clearselectionjammed(
              'clear',
            ); // No need to wait result
            const callbackClearMotor = await maincontroll.clearmotorerror(
              'clear',
            );
            const callbackClearLift = await maincontroll.clearlifterror(
              'setting',
            );
            console.log(
              'clear jammed:',
              callbackClearJammed,
              'clear motor:',
              callbackClearMotor,
              'clear lift:',
              callbackClearLift,
            );
            break;
          case 'close_cash_payment':
            console.log('APP CLOSE CASH');
            cash_method(false);
            break;
          case 'checkin-cb':
            if (G.startServerData > 0) {
              let pingData = Date.now() - G.startServerData;
              G.pingMS = pingData;
            } else {
              G.pingMS = Date.now();
            }
            break;
        }
      },
    );
  };

  const checkConnectMQTT = () => {
    if (onlyfirsttime) {
      startCheckInMQTT();
      navigate.navigate('Shelf');
    } else {
      setTimeout(() => {
        checkConnectMQTT();
      }, 3000);
    }
  };

  const startCheckInMQTT = () => {
    checkInMQTT = setInterval(() => {
      G.startServerData = Date.now();
      Script.checkSignal(G.pingMS, setSignal);
      var payload = {
        coinStack: G.coinStack,
        boardStatus: true,
        mdbStatus: true,
        temperature: G.temperature,
        ping: G.pingMS,
        testping: true,
        blockRefund: G.blockRefundMoney,
      };
      console.log('checkin:::', payload);
      MQTTConnection.publicCheckin(G.mqttClient, payload);
    }, 30000);
  };

  return (
    <>
      <LinearGradient
        style={Styles.flex}
        colors={['#021B79', '#2B32B2', '#021B79']}>
        <RN.TouchableOpacity style={Styles.btn_screen} activeOpacity={1}>
          <RN.View style={Styles.signal_container}>
            <Signal />
          </RN.View>
          <RN.ImageBackground
            source={require('../../assets/images/bg_splash.png')}
            style={Styles.bg_container}
            imageStyle={Styles.bg_image}>
            <RN.Image
              source={require('../../assets/images/logo.png')}
              style={Styles.logo_image}
            />
            <RN.ProgressBarAndroid
              styleAttr="Horizontal"
              animating={true}
              //color={this.checkStock(item.allremain, item.allcapacity)}
              color={'#fff'}
              indeterminate={false}
              progress={isLoading / 100}
              style={{width: '90%', top: '20%'}}
            />
            <RN.Text
              style={{
                top: '22%',
                color: '#fff',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              LOADING...
            </RN.Text>
          </RN.ImageBackground>
        </RN.TouchableOpacity>
      </LinearGradient>
    </>
  );
}
