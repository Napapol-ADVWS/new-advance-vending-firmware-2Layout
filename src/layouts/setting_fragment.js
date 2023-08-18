import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useRecoilState, useSetRecoilState} from 'recoil';
import Modal from 'react-native-modal';
import {Styles} from '../styles/setting_style';
import POST from '../protocol';
import STORE from '../storage';
import * as GLOBAL from '../globalState';
import InputServiceMode from '../components/setting/inputServiceMode';
import CoinBillVaildator from '../components/setting/coinBillValidator';
import DispenseProd from '../components/setting/dispenseProd';
import GiveChange from '../components/setting/giveChange';
import TransactionTest from '../components/setting/transactionTest';
import {useNavigation} from '@react-navigation/native';
import ClearJammed from '../components/setting/clearJam';
import Motortest from '../components/setting/motorTest';
import SettingCenterLift from '../components/setting/settingCenterLift';
import SettingRowLift from '../components/setting/settingRowLift';
import ClearMotor from '../components/setting/clearMotor';
import ClearLiftError from '../components/setting/clearLiftError';
import LiftTest from '../components/setting/liftTest';
import Script from '../script';
import Restart from 'react-native-restart';
import MQTTConnection from '../MQTTConnection';
import RNFS from 'react-native-fs';

const maincontroll = require('../../maincontroll');

const Setting = () => {
  const onSetToken = useSetRecoilState(GLOBAL.TOKEN);
  const onSetKioskID = useSetRecoilState(GLOBAL.KIOSKID);
  const onSetRegisterKey = useSetRecoilState(GLOBAL.REGISTERKEY);

  const [ClientData] = useRecoilState(GLOBAL.mqttClient);
  const [kioskID, setKioskID] = React.useState('');
  const [registerKey, setRegisterKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [numpad, setNumpad] = React.useState(false);
  const [modalTest, setModalTest] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  const navigation = useNavigation();

  React.useEffect(() => {
    runApp();
  }, []);

  const runApp =  () => {
    STORE.getItem('KIOSKID', response => {
      console.log('KIOSKID', response);
      if (response.result) {
        setKioskID(response.data);
        onSetKioskID(response.data);
        STORE.getItem('REGISTERKEY', response2 => {
          console.log('REGISTERKEY', response2.data);
          if (response2.result) {
            setRegisterKey(response2.data);
            onSetRegisterKey(response2.data);
            setIsReady(true);
          }
        });
      }
    });
  };

  const onSaveKiosk =  () => {
    setIsLoading(true);
    var postdata = {
      kioskID: kioskID,
      registerKey: registerKey,
    };
    POST.register(postdata,  callback => {
      console.log(callback);
      if (callback.code === 200 && callback.data) {
        setIsLoading(false);
        setIsReady(true);
        thisSetToken(callback.data.token);
        thisSetKiosk(kioskID);
        thisSetRegisterkey(registerKey);
      } else {
        setIsLoading(false);
      }
    });
  };

  const thisSetToken = token => {
    STORE.setItem('TOKEN', token, response => {
      if (response.result) {
        onSetToken(response.data);
      }
    });
  };

  const thisSetKiosk = data => {
    STORE.setItem('KIOSKID', data, response => {
      if (response.result) {
        onSetKioskID(data);
      }
    });
  };

  const thisSetRegisterkey = data => {
    STORE.setItem('REGISTERKEY', data, response => {
      if (response.result) {
        onSetRegisterKey(data);
      }
    });
  };

  const loginServiceMode = () => {
    setNumpad(true);
  };

  const dismissModal = () => setModalTest(false);

  const rebootApp = () => {
    // try {
    //   await RebootModule.rebootDevice();
    //   console.log('Device is rebooting...');
    // } catch (error) {
    //   console.error('An error occurred while rebooting:', error);
    // }
    RNFS.readFileAssets('reboot_android.sh', 'utf8')
      .then(scriptContent => {
        // สามารถดำเนินการกับเนื้อหาของ script ได้ที่นี่
        // เช่นเรียกใช้โดยใช้ RNFS.writeFile() แล้วเรียกใช้โดยใช้ RNFS.stat()
      })
      .catch(error => {
        console.log('Error reading script file:', error);
      });
  };

  return (
    <LinearGradient
      style={Styles.flex}
      colors={['#C9D6FF', '#E2E2E2', '#C9D6FF']}>
      {numpad ? (
        <RN.ScrollView>
          <RN.View style={Styles.title_cotainer}>
            <RN.View style={Styles.title_content}>
              <RN.Image
                source={require('../../assets/images/setting.png')}
                style={Styles.setting_image}
              />
              <RN.Text style={Styles.title_text}>SETTING</RN.Text>
            </RN.View>
            <RN.View style={Styles.kisok_setting_content}>
              <RN.View style={Styles.kisok_setting_contaniner}>
                <RN.View style={Styles.topic_content}>
                  <RN.View style={Styles.title_input_content}>
                    <RN.Text style={Styles.title_input_text}>KIOSK ID</RN.Text>
                  </RN.View>
                  <RN.TextInput
                    style={Styles.kiosk_input}
                    value={kioskID}
                    onChangeText={setKioskID}
                    keyboardType="number-pad"
                  />
                </RN.View>
                <RN.View style={Styles.topic_content}>
                  <RN.View style={Styles.title_input_content}>
                    <RN.Text style={Styles.title_input_text}>
                      REGISTER KEY
                    </RN.Text>
                  </RN.View>
                  <RN.TextInput
                    style={Styles.kiosk_input}
                    value={registerKey}
                    onChangeText={setRegisterKey}
                    keyboardType="number-pad"
                  />
                </RN.View>
                {isReady ? (
                  <RN.Text style={{color: 'green', top: 40}}>
                    Kiosk Register : Connecting
                  </RN.Text>
                ) : (
                  <RN.Text style={{color: 'red', top: 40}}>
                    Kiosk Register : Disconnecting
                  </RN.Text>
                )}
              </RN.View>
              <RN.TouchableOpacity
                style={Styles.btn_save_content}
                onPress={() => onSaveKiosk()}>
                <RN.Text style={Styles.btn_save_text}>SAVE</RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
          <CoinBillVaildator />
          {/* <GiveChange /> */}
          <DispenseProd />
          <RN.View style={{flexDirection: 'row', width: '100%'}}>
            <ClearJammed />
            <ClearMotor />
          </RN.View>
          <RN.View style={{flexDirection: 'row', width: '100%'}}>
            <ClearLiftError />
          </RN.View>
          <RN.View style={{flexDirection: 'row', width: '100%'}}>
            <Motortest />
            <LiftTest />
          </RN.View>
          <SettingRowLift />
          <SettingCenterLift />
          <RN.View style={Styles.btn_clearJam_container}>
            <RN.TouchableOpacity
              style={Styles.btn_settingDevice_content}
              onPress={() => setModalTest(true)}>
              <RN.Text style={Styles.btn_settingDevice_text}>
                ทดสอบทำรายการ
              </RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={Styles.btn_setting_container}>
            <RN.View style={Styles.btn_settingDevice_container_footer}>
              <RN.TouchableOpacity
                style={Styles.btn_settingDevice_content}
                onPress={() => RN.Linking.openSettings()}>
                <RN.Text style={Styles.btn_settingDevice_text}>
                  Device Setting
                </RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
            <RN.View style={Styles.btn_exit_container}>
              <RN.TouchableOpacity
                style={Styles.btn_exit_content}
                onPress={() => {
                  // if (ClientData && Object.keys(ClientData).length > 0) {
                  //   MQTTConnection.disconnectMQTT(ClientData);
                  // }
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Start'}],
                  });
                  //Restart.restart();
                  //rebootApp();
                }}>
                <RN.Text style={Styles.btn_exit_text}>Exit</RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
        </RN.ScrollView>
      ) : (
        <InputServiceMode login={loginServiceMode} />
      )}
      <Modal isVisible={isLoading}>
        <RN.View style={Styles.modal_loadding}>
          <RN.ActivityIndicator size={150} color="#fff" />
        </RN.View>
      </Modal>
      <Modal isVisible={modalTest}>
        <TransactionTest dismissModal={dismissModal} />
      </Modal>
    </LinearGradient>
  );
};

export default Setting;
