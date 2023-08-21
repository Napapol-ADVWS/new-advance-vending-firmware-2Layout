import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
const maincontroll = require('../../../maincontroll');
var countSlots = 1;
const Motortest = () => {
  const [slot, setSlot] = React.useState(1);
  const [selectSlot, setSelectSlot] = React.useState(0);

  const testMotor =  () => {
    maincontroll.selectiontest(Number(selectSlot), res => {
      console.log(slot, 'SLOT RESULT', res);
    });
  };

  return (
    <RN.View style={Styles.btn_clearJam_container}>
      <RN.TouchableOpacity
        style={Styles.btn_clearJam_content}
        onPress={() => testMotor()}>
        <RN.Text style={Styles.btn_settingDevice_text}>ทดสอบมอเตอร์</RN.Text>
      </RN.TouchableOpacity>
      <RN.View
        style={{
          width: '50%',
          padding: 20,
          justifyContent: 'center',
          height: 80,
        }}>
        <RN.Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
          ระบุช่องสินค้า
        </RN.Text>
        <RN.TextInput
          placeholder="ช่องสินค้า"
          onChangeText={setSelectSlot}
          style={{
            width: '100%',
            backgroundColor: '#fff',
            justifyContent: 'center',
            padding: 10,
            marginTop: 10,
            height: 40,
            borderRadius: 10,
            elevation: 5,
          }}
        />
      </RN.View>
    </RN.View>
  );
};

export default Motortest;
