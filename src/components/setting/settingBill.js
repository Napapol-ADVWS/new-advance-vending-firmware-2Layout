import * as React from 'react';
import * as RN from 'react-native';
import G from '../../globalVar';
import {Styles} from '../../styles/settingbill_style';
import STORE from '../../storage';
import {useRecoilState, useSetRecoilState} from 'recoil';
import * as GLOBAL from '../../globalState';
const maincontroll = require('../../../maincontroll');

const SettingBill = () => {
  const [msgSetting, setMsgSetting] = React.useState('เปิดทั้งหมด');
  const [blockRefundMoney] = useRecoilState(GLOBAL.blockRefundMoney);
  const setBlockRefundMoney = useSetRecoilState(GLOBAL.blockRefundMoney);

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

  const onSaveBlockRefund = req => {
    STORE.setItem('BLOCKREFUND', req, response => {
      G.blockRefundMoney = req;
      setBlockRefundMoney(req);
    });
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
      <RN.View
        style={{
          width: '100%',
          marginTop: '3%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RN.Text
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: 22,
            marginLeft: 40,
          }}>
          การคืนเงิน :{' '}
        </RN.Text>
        <RN.TouchableOpacity
          style={[
            Styles.btn_setbill_content,
            {backgroundColor: !blockRefundMoney ? 'green' : 'red'},
          ]}
          onPress={() => onSaveBlockRefund(!blockRefundMoney ? true : false)}>
          <RN.Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>
            {!blockRefundMoney ? 'เปิด' : 'ปิด'}
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </>
  );
};

export default SettingBill;
