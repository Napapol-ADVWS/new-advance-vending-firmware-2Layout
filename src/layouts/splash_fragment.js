/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {Animated} from 'react-native';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Styles} from '../styles/splash_style';
import * as navigate from '../navigator/RootNavigation';
import * as GLOBAL from '../globalState';
import {useSetRecoilState, useRecoilState} from 'recoil';
import Signal from '../components/shelf/Signal';
import AdsVideo from '../components/splash/ads_video';
import Script from '../script';
import MQTTConnection from '../MQTTConnection';
import G from '../globalVar';

var checkInMQTT = false;
export default function Splash() {
  const width = new Animated.Value(250);
  const height = new Animated.Value(250);
  const [isVideoReady, setIsVideoReady] = useRecoilState(GLOBAL.videoReady);
  const [isVideo, setIsVideo] = React.useState('');
  const setSignal = useSetRecoilState(GLOBAL.signals);

  React.useEffect(() => {
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
      };
      console.log('checkin:::', payload);
      MQTTConnection.publicCheckin(G.mqttClient, payload);
    }, 30000);

    return () => {
      clearInterval(checkInMQTT);
    };
  }, []);

  Animated.loop(
    Animated.timing(width, {
      toValue: 270,
      duration: 1000,
      useNativeDriver: false,
    }),
    Animated.timing(height, {
      toValue: 270,
      duration: 1000,
      useNativeDriver: false,
    }),
  ).start();

  const onclickScreen = () => {
    navigate.navigate('Shelf');
  };

  return (
    <>
      <LinearGradient
        style={Styles.flex}
        colors={['#021B79', '#2B32B2', '#021B79']}>
        <RN.TouchableOpacity
          style={Styles.btn_screen}
          activeOpacity={1}
          onPress={() => onclickScreen()}>
          <RN.View style={Styles.signal_container}>
            <Signal />
          </RN.View>
          <RN.ImageBackground
            source={require('../../assets/images/bg_splash.png')}
            style={Styles.bg_container}
            imageStyle={Styles.bg_image}>
            {!isVideoReady ? (
              <RN.Image
                source={require('../../assets/images/logo.png')}
                style={Styles.logo_image}
              />
            ) : (
              <>
                <AdsVideo />
              </>
            )}
            {!isVideoReady && (
              <>
                <RN.View style={Styles.btn_tap_container}>
                  <RN.Text style={Styles.btn_tap_text_en}>
                    TAP TO BUY PRODUCT
                  </RN.Text>
                  <RN.Text style={Styles.btn_tap_text_th}>
                    แตะเพื่อซื้อสินค้า
                  </RN.Text>
                </RN.View>
                <RN.View style={Styles.icon_container}>
                  <Animated.Image
                    source={require('../../assets/images/tab_icon.png')}
                    style={[Styles.icon_image, {width: width, height: height}]}
                  />
                </RN.View>
              </>
            )}
          </RN.ImageBackground>
        </RN.TouchableOpacity>
      </LinearGradient>
    </>
  );
}
