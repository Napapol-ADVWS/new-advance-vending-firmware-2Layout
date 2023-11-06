import * as React from 'react';
import * as RN from 'react-native';
import G from '../../globalVar';
import {Styles} from '../../styles/settingbill_style';
import STORE from '../../storage';
const maincontroll = require('../../../maincontroll');

const SettingBill = () => {
  const [msgSetting, setMsgSetting] = React.useState('เปิดทั้งหมด');

  React.useEffect(() => {
    if (G.blockBill == 1) {
      setMsgSetting('เปิดทั้งหมด');
    } else if (G.blockBill == 2) {
      setMsgSetting('ปิด 100 500 1000');
    } else if (G.blockBill == 3) {
      setMsgSetting('ปิด 500 1000');
    } else if (G.blockBill == 4) {
      setMsgSetting('ปิด 1000');
    }
  }, []);

  const onSelectBill = sel => {
    switch (Number(sel)) {
      case 1:
        STORE.setItem('BLOCKBILL', String(sel), response => {
          if (response.result) {
            G.blockBill = 1;
            setMsgSetting('เปิดทั้งหมด');
          }
        });
        break;
      case 2:
        STORE.setItem('BLOCKBILL', String(sel), response => {
          if (response.result) {
            G.blockBill = 2;
            setMsgSetting('ปิด 100 500 1000');
          }
        });
        break;
      case 3:
        STORE.setItem('BLOCKBILL', String(sel), response => {
          if (response.result) {
            G.blockBill = 3;
            setMsgSetting('ปิด 500 1000');
          }
        });
        break;
      case 4:
        STORE.setItem('BLOCKBILL', String(sel), response => {
          if (response.result) {
            G.blockBill = 4;
            setMsgSetting('ปิด 1000');
          }
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <RN.View style={Styles.contaniner}>
        <RN.View style={Styles.title_content}>
          <RN.Text style={{color: '#000', fontWeight: 'bold', fontSize: 22}}>
            Block Bill :
          </RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          style={Styles.btn_setbill_content}
          onPress={() => onSelectBill(1)}>
          <RN.Text style={{color: '#000', fontWeight: 'bold', fontSize: 18}}>
            เปิดทั้งหมด
          </RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={Styles.btn_setbill_content}
          onPress={() => onSelectBill(2)}>
          <RN.Text style={{color: '#000', fontWeight: 'bold', fontSize: 18}}>
            ปิด 100 500 1000
          </RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={Styles.btn_setbill_content}
          onPress={() => onSelectBill(3)}>
          <RN.Text style={{color: '#000', fontWeight: 'bold', fontSize: 18}}>
            ปิด 500 1000
          </RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={Styles.btn_setbill_content}
          onPress={() => onSelectBill(4)}>
          <RN.Text style={{color: '#000', fontWeight: 'bold', fontSize: 18}}>
            ปิด 1000
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.Text
        style={{
          color: '#000',
          fontWeight: 'bold',
          fontSize: 18,
          marginLeft: 50,
        }}>
        คำสั่งที่เลือก :{' '}
        <RN.Text style={{color: '#56ab2f'}}>{msgSetting}</RN.Text>
      </RN.Text>
    </>
  );
};

export default SettingBill;
