import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
const maincontroll = require('../../../maincontroll');

const ClearJammed = () => {
  const [jamStatus, setJamStatus] = React.useState('nonActive');

  const clearJAM = async () => {
    setJamStatus('loading');
    const callback = await maincontroll.clearselectionjammed('clear');
    if (callback.result) {
      setJamStatus('activated');
    } else {
      setJamStatus('error');
    }
    console.log('CLEAR JAM:::', callback);
  };

  return (
    <RN.View style={Styles.btn_clearJam_container}>
      <RN.TouchableOpacity
        style={Styles.btn_clearJam_content}
        onPress={() => clearJAM(true)}>
        <RN.Text style={Styles.btn_settingDevice_text}>
          เคลียร์ช่องสินค้า
        </RN.Text>
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
          {jamStatus === 'nonActive' && (
            <RN.Text style={{color: '#9e9e9e'}}>Non Active</RN.Text>
          )}
          {jamStatus === 'activated' && (
            <RN.Text style={{color: '#3FC61A'}}>Clear Success</RN.Text>
          )}
          {jamStatus === 'error' && (
            <RN.Text style={{color: 'red'}}>Clear Unsuccess</RN.Text>
          )}
          {jamStatus === 'loading' && <RN.ActivityIndicator size="large" />}
        </RN.Text>
      </RN.View>
    </RN.View>
  );
};

export default ClearJammed;
