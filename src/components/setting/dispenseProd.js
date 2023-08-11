import * as React from 'react';
import * as RN from 'react-native';
import accessControl from '../../accessControl';
import ERRORS from '../../msgError';
import Row1 from './slots/row1';
import Row2 from './slots/row2';
import Row3 from './slots/row3';
import Row4 from './slots/row4';
import Row5 from './slots/row5';
import Row6 from './slots/row6';
import Row7 from './slots/row7';

const maincontroll = require('../../../maincontroll');
let counter = 1;
let logData = '';
const DispenseProd = () => {
  const scrollViewRef = React.useRef(null);
  const [slotNo, setSlotNo] = React.useState(0);
  const [msgVending, setMsgVending] = React.useState('');
  const [action, setAction] = React.useState(false);
  const [inprocess, setInprocess] = React.useState(false);
  const [selectAll, setSelectAll] = React.useState(false);

  React.useEffect(() => {
    runApp();
  }, []);

  const runApp = () => {
    checkDispense();
  };

  const activeSlot = async (item, cb) => {
    console.log(item);
    setMsgVending('');
    setSlotNo(Number(item));
    const callback = await maincontroll.dispense(Number(item));
    console.log(callback);
    logData += `log: ${JSON.stringify(callback)}\n`;
    scrollToBottom();
    setMsgVending(callback.message);
    cb(callback);
  };

  const checkDispense = () => {
    maincontroll.on('dispense', async res => {
      logData += `log: ${JSON.stringify(res)}\n`;
      scrollToBottom();
      switch (res.code) {
        case '50401':
          setMsgVending(res.message);
          break;
        case '50402':
          setMsgVending(res.message);
          if (selectAll) {
            counter++;
            allAcitveSlot();
          } else {
            await maincontroll.off('dispense');
          }
          break;
        case '50204':
          setMsgVending(res.message);
          await maincontroll.off('dispense');
          break;
        case '50410':
          setMsgVending(res.message);
          break;
        case '50411':
          setMsgVending(res.message);
          break;
        case '50441':
          setMsgVending(res.message);
          break;
        case '50403':
          setMsgVending(res.message);
          await maincontroll.off('dispense');
          break;
        case '50205':
          setMsgVending(res.message);
          await maincontroll.off('dispense');
          break;
        default:
          setMsgVending(res.message);
          break;
      }
    });
  };

  const allAcitveSlot = () => {
    if (counter <= 70) {
      activeSlot(counter, callback => {
        console.log('activeSlot:::', callback);
      });
    } else {
      setSelectAll(false);
      counter = 1;
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  return (
    <>
      <RN.View style={{paddingLeft: 20, paddingTop: 20}}>
        <RN.Text style={{fontSize: 24, color: '#000', fontWeight: 'bold'}}>
          ทดสอบปล่อยสินค้า{' '}
          <RN.Text style={{color: 'blue'}}>
            {slotNo > 0 ? `ช่องที่ ${slotNo} ${msgVending}` : ''}
          </RN.Text>
        </RN.Text>
      </RN.View>
      <RN.View style={{alignItems: 'center'}}>
        <RN.ScrollView
          ref={scrollViewRef}
          style={{height: 200, width: '95%', backgroundColor: '#fff'}}>
          <RN.View style={{width: '100%', height: '100%'}}>
            <RN.Text>{logData}</RN.Text>
          </RN.View>
        </RN.ScrollView>
      </RN.View>
      <RN.View style={{width: '100%', padding: 20}}>
        <Row1 activeSlot={activeSlot} action={action} />
        <Row2 activeSlot={activeSlot} action={action} />
        <Row3 activeSlot={activeSlot} action={action} />
        <Row4 activeSlot={activeSlot} action={action} />
        <Row5 activeSlot={activeSlot} action={action} />
        <Row6 activeSlot={activeSlot} action={action} />
        <Row7 activeSlot={activeSlot} action={action} />
        {/* <RN.TouchableOpacity
          onPress={() => {
            setSelectAll(true);
            allAcitveSlot();
          }}
          style={{
            width: '30%',
            height: 80,
            backgroundColor: '#fff',
            elevation: 2,
            marginTop: '3%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <RN.Text style={{fontSize: 18, fontWeight: 'bold'}}>
            ทดสอบปล่อยสินค้าทั้งหมด
          </RN.Text>
        </RN.TouchableOpacity> */}
      </RN.View>
      <RN.View
        style={{width: '100%', borderBottomColor: '#fff', borderBottomWidth: 1}}
      />
    </>
  );
};

export default DispenseProd;
