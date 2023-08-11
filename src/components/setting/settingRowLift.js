import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
const maincontroll = require('../../../maincontroll');

const SettingRowLift = () => {
  const [rowdata, setRowdata] = React.useState(0);
  const [hdata, setHdata] = React.useState(1);
  const [getRow, setGetRow] = React.useState('');

  React.useEffect(() => {
    runApp();
  }, []);

  const runApp = async () => {
    let setText = '';
    for (let i = 0; i < 10; i++) {
      const callback = await maincontroll.liftlocation('', i, '');
      console.log('ROW=>', i, callback);
      setText += ` row${i} = ${callback.pulse} cm`;
    }
    console.log('setText=>', setText);
    setGetRow(setText);
  };

  const saveValue = async () => {
    const callback = await maincontroll.liftlocation(
      'setting',
      Number(rowdata),
      hdata,
    );
    console.log('======>', callback);
    setTimeout(() => {
      runApp();
    }, 3000);
  };

  return (
    <>
      <RN.View style={{paddingLeft: 20, paddingTop: 20}}>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          ตั้งค่าความสูงของลิฟท์แต่ละชั้น
        </RN.Text>
        <RN.Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
          ความสูงแต่ละชั้น : {getRow}
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
            width: '30%',
            padding: 20,
            justifyContent: 'center',
            height: 100,
          }}>
          <RN.Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
            แถว
          </RN.Text>
          <RN.TextInput
            placeholder="แถว"
            onChangeText={setRowdata}
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
        </RN.View>
      </RN.View>
    </>
  );
};

export default SettingRowLift;
