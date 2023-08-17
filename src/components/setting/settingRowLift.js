import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';
const maincontroll = require('../../../maincontroll');

const SettingRowLift = () => {
  const [rowdata, setRowdata] = React.useState(0);
  const [hdata, setHdata] = React.useState(1);
  const [getRow, setGetRow] = React.useState('');
  const [selectRow, setSelectRow] = React.useState('');

  const onSelectRow = async () => {
    let setText = '';
    const callback = await maincontroll.liftlocation('', selectRow, '');
    console.log('ROW=>', selectRow, callback);
    setText = `${callback.pulse} cm`;
    console.log('setText=>', setText);
    setGetRow(setText);
  };

  const saveValue = async () => {
    const callback = await maincontroll.liftlocation(
      'setting',
      Number(selectRow),
      hdata,
    );
    console.log('======>', callback);
  };

  return (
    <>
      <RN.View style={{paddingLeft: 20, paddingTop: 20}}>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          ตั้งค่าความสูงของลิฟท์แต่ละชั้น
        </RN.Text>
        <RN.View
          style={{
            width: '100%',
            padding: 20,
            flexDirection: 'row',
          }}>
          <RN.TouchableOpacity
            style={{
              width: '20%',
              height: 80,
              justifyContent: 'center',
              backgroundColor: '#fff',
              alignItems: 'center',
              borderRadius: 10,
              shadowColor: 'black',
              shadowOpacity: 0.3,
              shadowOffset: {width: 2, height: 0},
              shadowRadius: 10,
              elevation: 3,
            }}
            onPress={() => onSelectRow()}>
            <RN.Text style={Styles.btn_settingDevice_text}>ยืนยัน</RN.Text>
          </RN.TouchableOpacity>
          <RN.View
            style={{
              width: '20%',
              padding: 20,
              justifyContent: 'center',
              height: 80,
            }}>
            <RN.Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
              ระบุชั้นที่ต้องการ
            </RN.Text>
            <RN.TextInput
              placeholder="ชั้นที่ต้องการ"
              onChangeText={setSelectRow}
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
          <RN.TouchableOpacity
            style={{
              width: '20%',
              height: 80,
              justifyContent: 'center',
              backgroundColor: '#fff',
              alignItems: 'center',
              borderRadius: 10,
              shadowColor: 'black',
              shadowOpacity: 0.3,
              shadowOffset: {width: 2, height: 0},
              shadowRadius: 10,
              elevation: 3,
            }}
            onPress={() => saveValue()}>
            <RN.Text style={Styles.btn_settingDevice_text}>
              บันทึกการตั้งค่า
            </RN.Text>
          </RN.TouchableOpacity>
          <RN.View
            style={{
              width: '20%',
              padding: 20,
              justifyContent: 'center',
              height: 80,
            }}>
            <RN.Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
              ระบุความสูงลิฟท์ใหม่ (CM)
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
        <RN.Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
          ความสูงของชั้น {selectRow} : {getRow}
        </RN.Text>
      </RN.View>
    </>
  );
};

export default SettingRowLift;
