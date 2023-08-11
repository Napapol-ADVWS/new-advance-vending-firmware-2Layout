import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
const maincontroll = require('../../../maincontroll');

const liftTest = () => {
  const [liftStatus, setLiftStatus] = React.useState('nonActive');

  const testLift = async () => {
    setLiftStatus('loading');
    const callback = await maincontroll.lifttest(0);
    if (callback.result) {
      setLiftStatus('activated');
    } else {
      setLiftStatus('error');
    }
    console.log('CLEAR LIFT:::', callback);
  };

  return (
    <RN.View style={Styles.btn_clearJam_container}>
      <RN.TouchableOpacity
        style={Styles.btn_clearJam_content}
        onPress={() => testLift(true)}>
        <RN.Text style={Styles.btn_settingDevice_text}>ทดสอบลิฟท์</RN.Text>
      </RN.TouchableOpacity>
      <RN.View
        style={{
          width: '50%',
          padding: 20,
          justifyContent: 'center',
          height: 80,
        }}>
        {/* <RN.Text style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>
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
        </RN.Text> */}
      </RN.View>
    </RN.View>
  );
};

export default liftTest;
