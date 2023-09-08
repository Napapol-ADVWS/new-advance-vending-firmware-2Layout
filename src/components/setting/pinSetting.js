import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
import Icon from 'react-native-vector-icons/FontAwesome';
import STORE from '../../storage';

const PinSetting = () => {
  const [msgSave, setMsgSave] = React.useState('');
  const [colorSave, setColorSave] = React.useState('#000');
  const [PIN, setPIN] = React.useState(0);
  const [secure, setSecure] = React.useState(true);

  const savePin = () => {
    STORE.setItem('PIN', String(PIN), res => {
      console.log(res);
      if (res.result) {
        setMsgSave('บันทึกสำเร็จ');
        setColorSave('green');
      } else {
        setMsgSave('บันทึกไม่สำเร็จ');
        setColorSave('red');
      }
    });
  };

  const setSecureTextEntry = () => {
    if (secure) {
      setSecure(false);
    } else {
      setSecure(true);
    }
  };

  return (
    <RN.View style={[Styles.btn_clearJam_container, {width: '80%'}]}>
      <RN.TouchableOpacity
        style={[Styles.btn_clearJam_content, {width: '30%'}]}
        onPress={() => savePin()}>
        <RN.Text style={Styles.btn_settingDevice_text}>บันทึก</RN.Text>
      </RN.TouchableOpacity>
      <RN.View
        style={{
          width: '50%',
          padding: 20,
          justifyContent: 'center',
          height: 80,
        }}>
        <RN.Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
          ระบุ Pin สำหรับเข้า Service Mode
        </RN.Text>
        <RN.TextInput
          placeholder="ช่องสินค้า"
          secureTextEntry={secure}
          maxLength={6}
          keyboardType="number-pad"
          onChangeText={setPIN}
          style={{
            width: '100%',
            backgroundColor: '#fff',
            justifyContent: 'center',
            color: '#000',
            padding: 10,
            marginTop: 10,
            height: 40,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 'bold',
            elevation: 5,
          }}
        />
        <RN.Text
          style={{
            fontSize: 16,
            color: colorSave,
            fontWeight: 'bold',
            marginTop: 5,
          }}>
          {msgSave}
        </RN.Text>
      </RN.View>
      <RN.TouchableOpacity
        style={[
          Styles.btn_clearJam_content,
          {width: 50, height: 50, marginTop: 25},
        ]}
        onPress={() => setSecureTextEntry()}>
        {secure ? (
          <Icon name="eye" color="#000" size={20} />
        ) : (
          <Icon name="eye-slash" color="#000" size={20} />
        )}
      </RN.TouchableOpacity>
    </RN.View>
  );
};

export default PinSetting;
