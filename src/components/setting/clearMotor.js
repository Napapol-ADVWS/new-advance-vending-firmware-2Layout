import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
const maincontroll = require('../../../maincontroll');

const ClearMotor = () => {
  const [motorStatus, setMotortatus] = React.useState('nonActive');

  const clearMotors = async () => {
    setMotortatus('loading');
    const callback = await maincontroll.clearmotorerror('clear');
    if (callback.result) {
      setMotortatus('activated');
    } else {
      setMotortatus('error');
    }
    console.log('CLEAR MOTOR:::', callback);
  };

  return (
    <RN.View style={Styles.btn_clearJam_container}>
      <RN.TouchableOpacity
        style={Styles.btn_clearJam_content}
        onPress={() => clearMotors(true)}>
        <RN.Text style={Styles.btn_settingDevice_text}>เคลียร์มอเตอร์</RN.Text>
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
          {motorStatus === 'nonActive' && (
            <RN.Text style={{color: '#9e9e9e'}}>Non Active</RN.Text>
          )}
          {motorStatus === 'activated' && (
            <RN.Text style={{color: '#3FC61A'}}>Clear Success</RN.Text>
          )}
          {motorStatus === 'error' && (
            <RN.Text style={{color: 'red'}}>Clear Unsuccess</RN.Text>
          )}
          {motorStatus === 'loading' && <RN.ActivityIndicator size="large" />}
        </RN.Text>
      </RN.View>
    </RN.View>
  );
};

export default ClearMotor;
