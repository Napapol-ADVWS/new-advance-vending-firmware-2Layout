import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
const maincontroll = require('../../../maincontroll');

const ClearLiftError = () => {
  const [liftStatus, setLiftStatus] = React.useState('nonActive');

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
    await maincontroll.multiselectiontest(1, 70, true);
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
    </RN.View>
  );
};

export default ClearLiftError;
