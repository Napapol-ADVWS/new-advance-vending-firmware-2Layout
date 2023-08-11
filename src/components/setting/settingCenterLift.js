import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
const maincontroll = require('../../../maincontroll');

const SettingCenterLift = () => {
  const [hdata, setHdata] = React.useState(27.6);

  const saveValue = async () => {
    const callback = await maincontroll.liftlocationonlunchbox(
      'setting',
      Number(hdata),
      10,
    );
    console.log('saveValue', callback);
  };

  return (
    <>
      <RN.View style={{paddingLeft: 20, paddingTop: 20}}>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          ตั้งค่าจุดปล่อยสินค้าของลิฟท์
        </RN.Text>
      </RN.View>
      <RN.View style={Styles.btn_clearJam_container}>
        <RN.TouchableOpacity
          style={Styles.btn_clearJam_content}
          onPress={() => saveValue()}>
          <RN.Text style={Styles.btn_settingDevice_text}>
            บันทึกการตั้งค่า
          </RN.Text>
        </RN.TouchableOpacity>
        <RN.View
          style={{
            width: '50%',
            padding: 20,
            justifyContent: 'center',
            height: 100,
          }}>
          <RN.Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
            ระบุความสูงลิฟท์ (CM)
          </RN.Text>
          <RN.TextInput
            placeholder="ความสูง"
            onChangeText={setHdata}
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
          <RN.Text style={{fontSize: 14, fontWeight: 'bold', marginTop: 20}}>
            * สำหรับตู้ประเภทสายพาน {'\n'} (ค่าพื้นฐาน 27.6 CM)
          </RN.Text>
        </RN.View>
      </RN.View>
    </>
  );
};

export default SettingCenterLift;
