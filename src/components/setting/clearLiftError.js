import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
import Modal from 'react-native-modal';
import G from '../../globalVar';
import * as GLOBAL from '../../globalState';
import {useSetRecoilState, useRecoilState} from 'recoil';
const maincontroll = require('../../../maincontroll');

var checkSuccess = false;
const ClearLiftError = () => {
  const [liftStatus, setLiftStatus] = React.useState('nonActive');
  const [startTest, setStartTest] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [motor] = useRecoilState(GLOBAL.motorDisplay);
  const setMotor = useSetRecoilState(GLOBAL.motorDisplay);

  const clearLift = async () => {
    setLiftStatus('loading');
    const callback = await maincontroll.clearlifterror('setting');
    if (callback.result) {
      setLiftStatus('activated');
    } else {
      setLiftStatus('error');
    }
    console.log('CLEAR LIFT:::', callback);
  };

  const testAllMotor = async () => {
    setStartTest(true);
    setLoading(true);
    const callback = await maincontroll.multiselectiontest(1, 70, true);
    console.log('callback::::', callback);
    checkSuccess = setInterval(() => {
      checkMotorTest();
    }, 1000);
  };

  const checkMotorTest = () => {
    console.log('COUNT:', G.testMotor.length);
    if (G.testMotor.length >= 70) {
      console.log('SUCCESS');
      clearInterval(checkSuccess);
      setLoading(false);
      setMotor(G.testMotor);
    }
  };

  const renderItem = ({item, index}) => (
    <RN.View
      style={{
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <RN.View
        style={{
          width: 50,
          height: 50,
          backgroundColor: checkStatus(item.status),
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <RN.Text style={{color: '#fff'}}>{index + 1}</RN.Text>
      </RN.View>
      <RN.Text style={{color: checkStatus(item.status), textAlign: 'center'}}>
        {item.statusText}
      </RN.Text>
    </RN.View>
  );

  const checkStatus = status => {
    let active = '#ddd';
    if (status == '00') {
      active = 'green';
    } else if (status == '02') {
      active = 'red';
    } else {
      active = '#ddd';
    }
    return active;
  };

  const closeTestMotor = () => {
    G.testMotor = [];
    setMotor([]);
    setStartTest(false);
    setLoading(false);
  };

  return (
    <RN.View style={Styles.btn_clearJam_container}>
      <RN.TouchableOpacity
        style={Styles.btn_clearJam_content}
        onPress={() => clearLift(true)}>
        <RN.Text style={Styles.btn_settingDevice_text}>เคลียร์ลิฟท์</RN.Text>
      </RN.TouchableOpacity>
      <RN.View
        style={{
          width: '50%',
          padding: 20,
          justifyContent: 'center',
          height: 80,
        }}>
        <RN.Text style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>
          Status :{' '}
          {liftStatus === 'nonActive' && (
            <RN.Text style={{color: '#9e9e9e'}}>Non Active</RN.Text>
          )}
          {liftStatus === 'activated' && (
            <RN.Text style={{color: '#3FC61A'}}>Clear Success</RN.Text>
          )}
          {liftStatus === 'error' && (
            <RN.Text style={{color: 'red'}}>Clear Unsuccess</RN.Text>
          )}
          {liftStatus === 'loading' && <RN.ActivityIndicator size="large" />}
        </RN.Text>
      </RN.View>
      <RN.TouchableOpacity
        style={Styles.btn_clearJam_content}
        onPress={() => testAllMotor()}>
        <RN.Text style={Styles.btn_settingDevice_text}>
          ทดสอบมอร์เตอร์ทั้งหมด
        </RN.Text>
      </RN.TouchableOpacity>
      <Modal
        isVisible={startTest}
        style={{alignItems: 'center', justifyContent: 'center', padding: 20}}>
        {!loading ? (
          <RN.View
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              alignItems: 'center',
              padding: 20,
              borderRadius: 20,
              elevation: 10,
            }}>
            <RN.Text
              style={{
                color: '#000',
                fontSize: 28,
                fontWeight: 'bold',
                marginTop: 40,
                marginBottom: 40,
              }}>
              ผลทดสอบ Motor
            </RN.Text>
            <RN.FlatList
              columnWrapperStyle={{alignItems: 'center'}}
              numColumns={10}
              data={motor}
              renderItem={item => renderItem(item)}
            />
            <RN.TouchableOpacity
              style={[
                Styles.btn_clearJam_content,
                {marginTop: 40, width: '30%'},
              ]}
              onPress={() => closeTestMotor()}>
              <RN.Text style={Styles.btn_settingDevice_text}>ปิด</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        ) : (
          <>
            <RN.ActivityIndicator size={150} color="#fff" />
            <RN.Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
              กำลังทำการทดสอบ Motor
            </RN.Text>
          </>
        )}
      </Modal>
    </RN.View>
  );
};

export default ClearLiftError;
