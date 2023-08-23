/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SkypeIndicator} from 'react-native-indicators';
import {Styles} from '../styles/cash_style';
import ERR from '../msgError';
import Script from '../script';
import G from '../globalVar';

const maincontroll = require('../../maincontroll');

var inputMoney = 0;

const CashPaymentScreen = ({product, transactionID, updateTransaction}) => {
  const [LoadDispense, setLoadDispense] = React.useState(false);
  const [dispenseError, setDispenseError] = React.useState(false);
  const [msgError, setMsgError] = React.useState('');
  const [inputValue, setInputValue] = React.useState(0);
  const [timer, setTimer] = React.useState(60);
  const [changeMoneyStatus, setChangeMoneyStatus] = React.useState(false);
  const [changeMoney, setChangeMoney] = React.useState(0);
  const [vendingStatus, setVendingStatus] = React.useState('');
  const [disableCancel, setDisableCancel] = React.useState(false);
  const [showCancel, setShowCancel] = React.useState(false);

  let moneyInput = {coin: 0, bill: 0, total: 0};
  let firstload = false;
  let time_counter = false;
  React.useEffect(() => {
    if (!firstload) {
      startMDB();
      firstload = true;
    }
    if (disableCancel) return ()=>{clearTimeout(time_counter)};
    if (timer <= 0) {
      closePayment();
      return ()=>{clearTimeout(time_counter)};
    }
    time_counter = setTimeout(() => {
        setTimer(prevCount => prevCount - 1);
        console.log('timer cash : ', timer);
    }, 1000);
     return ()=>{clearTimeout(time_counter)};
  }, [timer, disableCancel]);

  const startMDB = () => {
    if (!G.startSuccess) {
      setVendingStatus('Ready');
      receiveMoney();
      G.startSuccess = true;
    }
  };

  const dispenseStatus = () => {
    maincontroll.on('dispense', async res => {
      console.log('dispense status:', res);
      switch (res.code) {
        case '50401':
          setVendingStatus(res.message);
          break;
        case '50402':
          setVendingStatus(res.message);
          maincontroll.off('dispense');
          setTimeout(() => {
            checkChangeMoney();
          }, 3000);
          break;
        case '50203':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));
          maincontroll.off('dispense');
          await refundMoney('error', 'selection doesn’t exist', '50203');
          break;
        case '50204':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));

          maincontroll.off('dispense');
          await refundMoney('error', 'selection pause', '50204');
          break;
        case '50410':
          setLoadDispense(true);
          setDispenseError(false);
          setVendingStatus(res.message);
          break;
        case '50411':
          setVendingStatus(res.message);
          break;
        case '50440':
          setVendingStatus(res.message);
          break;
        case '50441':
          setVendingStatus(res.message);
          break;
        case '50403':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));

          maincontroll.off('dispense');
          await refundMoney('error', 'selection doesn’t exist', '50403');
          break;
        case '50205':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));

          maincontroll.off('dispense');
          await refundMoney(
            'error',
            'There is product inside elevator',
            '50205',
          );
          break;
        case '50207':
          setVendingStatus(res.message);
          setDispenseError(true);
          setLoadDispense(true);
          setMsgError(ERR.msgError(res.code));

          maincontroll.off('dispense');
          await refundMoney('error', 'Elevator error', '50207');
          break;
        default:
          break;
      }
    });
  };

  const receiveMoney = () => {
    maincontroll.on('receivemoney', async res => {
      //inputMoney = inputValue;
      clearTimeout(time_counter);
      setTimer(60);
      console.log('MONEY:', inputMoney);
      console.log('AMOUNT:::::', res);
      let prodPrice =
        product.price.sale > 0 ? product.price.sale : product.price.normal;
      inputMoney += Number(res.amount);
      console.log('SUM:::', inputMoney);
      checkTypeMoney(Number(res.amount));
      setInputValue(inputMoney);
      console.log('displayMoney', inputMoney);
      if (Number(inputMoney) >= Number(prodPrice)) {
        MdbTurnOff();
        setDisableCancel(true);
        try {
          const callbackCoin2 = await maincontroll.setcoinaccept(false);
          const callbackBill2 = await maincontroll.setbillaccept(false);
          console.log('callbackCoin:', callbackCoin2);
          console.log('callbackBill:', callbackBill2);
          maincontroll.clearwait();
          dispenseStatus();
          await dispenseProduct();
        } catch (error) {
          maincontroll.clearwait();
          dispenseStatus();
          //await dispenseProduct();   Do something else
        }
      }
    });
  };

  const checkTypeMoney = amount => {
    switch (Number(amount)) {
      case 1:
        moneyInput.coin += Number(amount);
        moneyInput.total += Number(amount);
        break;
      case 2:
        moneyInput.coin += Number(amount);
        moneyInput.total += Number(amount);
        break;
      case 5:
        moneyInput.coin += Number(amount);
        moneyInput.total += Number(amount);
        break;
      case 10:
        moneyInput.coin += Number(amount);
        moneyInput.total += Number(amount);
        break;
      case 20:
        moneyInput.bill += Number(amount);
        moneyInput.total += Number(amount);
        break;
      case 50:
        moneyInput.bill += Number(amount);
        moneyInput.total += Number(amount);
        break;
      case 100:
        moneyInput.bill += Number(amount);
        moneyInput.total += Number(amount);
        break;
      case 500:
        moneyInput.bill += Number(amount);
        moneyInput.total += Number(amount);
        break;
      case 1000:
        moneyInput.bill += Number(amount);
        moneyInput.total += Number(amount);
        break;
      default:
        break;
    }
  };

  const checkChangeMoney = async m => {
    let prodPrice =
      product.price.sale > 0 ? product.price.sale : product.price.normal;
    let CheckChange = Number(inputMoney) - Number(prodPrice);
    console.log('Input:', inputMoney, 'Change:', prodPrice);
    console.log('Change Total :', CheckChange);
    if (CheckChange > 0) {
      setChangeMoney(CheckChange);
      setChangeMoneyStatus(true);
      const changeCallback = await maincontroll.givechange(Number(CheckChange));
      const coinStack = await Script.checkCoinStack();
      console.log('givechange res =>', changeCallback);
      let postdata = {
        action: 'complete',
        payment: {
          coinStack: coinStack,
          type: 'Cash',
          amount: moneyInput,
          changeMoney: Number(CheckChange),
        },
        transactionID: transactionID,
        kioskStatus: {msg: 'success', code: '2000'},
      };
      inputMoney = 0;
      console.log('data update transaction', postdata);
      updateTransaction(postdata, 'complete');
    } else {
      const coinStack = await Script.checkCoinStack();
      let postdata = {
        action: 'complete',
        payment: {
          coinStack: coinStack,
          type: 'Cash',
          amount: moneyInput,
          changeMoney: Number(CheckChange),
        },
        transactionID: transactionID,
        kioskStatus: {msg: 'success', code: '2000'},
      };
      inputMoney = 0;
      console.log('data update transaction', postdata);
      updateTransaction(postdata, 'complete');
    }
  };

  const dispenseProduct = async () => {
    console.log('dispense start', product.slot.col);
    const callbackDispense = await maincontroll.dispense(
      Number(product.slot.col),
    );
    console.log('dispenseProduct:::', callbackDispense);
    if (callbackDispense && !callbackDispense.result) {
      if (callbackDispense.code === '104001') {
        setVendingStatus(callbackDispense.message);
        setLoadDispense(true);
        setDispenseError(true);
        setMsgError(ERR.msgError(callbackDispense.code));
        setTimeout( () => {
           refundMoney('error', 'No VMC Event: selectionnumber', '104001');
        }, 3000);
      } else if (callbackDispense.code === '50204') {
        setVendingStatus(callbackDispense.message);
        setLoadDispense(true);
        setDispenseError(true);
        setMsgError(ERR.msgError(callbackDispense.code));

        setTimeout( () => {
           refundMoney('error', 'selection pause', '50204');
        }, 3000);
      } else if (callbackDispense.code === '50205') {
        setLoadDispense(true);
        setDispenseError(true);
        setMsgError(ERR.msgError(callbackDispense.code));

        // setTimeout(() => {    ????
        //   dispenseProduct();
        // }, 3000);
      } else if (callbackDispense.code === '50203') {
        setVendingStatus(callbackDispense.message);
        setLoadDispense(true);
        setDispenseError(true);
        setMsgError(ERR.msgError(callbackDispense.code));
        setTimeout( () => {
           refundMoney('error', 'selection doesn’t exist', '50203');
        }, 3000);
      } else if (callbackDispense.code === '50207') {
        setVendingStatus(callbackDispense.message);
        setLoadDispense(true);
        setDispenseError(true);
        setMsgError(ERR.msgError(callbackDispense.code));
        setTimeout( () => {
           refundMoney('error', 'Elevator error', '50207');
        }, 3000);
      } else {
          setVendingStatus(callbackDispense.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(callbackDispense.code));
          setTimeout( () => {
             refundMoney('error', 'Process Error .', '9999');
          }, 3000);
      }
    }else{
      setVendingStatus('Process Error .');
      setLoadDispense(true);
      setDispenseError(true);
      setMsgError('เกิดข้อผิดพลาดในการทำรายการ .');
      errorTransaction('Process Error .', '9999');
    }
  };

  const MdbTurnOff = () => {
    // clearInterval(this.timerInterval);
    maincontroll.off('receivemoney');
  };

  const refundMoney = async (action, msg, codeStatus) => {
    let postdata = {
      action: action,
      payment: {
        coinStack: {},
        type: 'Cash',
        amount: moneyInput,
        changeMoney: 0,
      },
      transactionID: transactionID,
      kioskStatus: {msg: msg, code: codeStatus},
    };
    console.log('amount inputMoney', inputMoney);
    if (Number(inputMoney > 0)) {
      const givechange = await maincontroll.givechange(Number(inputMoney));
      const coinStack = await Script.checkCoinStack();
      postdata.payment.coinStack = coinStack;
      console.log('refundMoney=>', givechange);
      inputMoney = 0;
      console.log('data update transaction', postdata);
      updateTransaction(postdata, 'cancel', action);
    } else {
      const coinStack = await Script.checkCoinStack();
      inputMoney = 0;
      postdata.payment.coinStack = coinStack;
      console.log('data update transaction', postdata);
      updateTransaction(postdata, 'cancel', action);
    }
  };

  const errorTransaction = (msg, code) => {
    MdbTurnOff();
    let postdata = {
      action: 'error',
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'Cash',
        amount: moneyInput,
        changeMoney: 0,
      },
      transactionID: transactionID,
      kioskStatus: {msg: msg, code: code},
    };
    updateTransaction(postdata, 'cancel', 'error');
  };

  const closePayment = async () => {
    setDisableCancel(true);
    setShowCancel(true);
    MdbTurnOff();
    try {
      const callbackCoin = await maincontroll.setcoinaccept(false);
      const callbackBill = await maincontroll.setbillaccept(false);
      console.log('callbackCoin:', callbackCoin);
      console.log('callbackBill:', callbackBill);
      await refundMoney('cancel');
    } catch (error) {
      await refundMoney('cancel');
    }
  };

  return (
    <RN.View style={[Styles.body_container]}>
      <RN.View style={[Styles.container]}>
        <>
          <RN.View style={[Styles.title_content]}>
            <RN.Text style={Styles.title_text}>กรุณายอดเงินสดตามจำนวน</RN.Text>
          </RN.View>
          <RN.View style={Styles.product_price_container}>
            <RN.View style={Styles.price_text_content}>
              <RN.Text style={Styles.price_text}>
                ฿{' '}
                {product.price.sale > 0
                  ? product.price.sale
                  : product.price.normal}
              </RN.Text>
            </RN.View>
            <RN.View style={Styles.prduct_image_content}>
              <RN.Image
                source={{uri: product.productImage}}
                style={Styles.product_image}
              />
              <RN.Text style={Styles.prduct_name_text}>
                {product.productName}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={Styles.input_money_container}>
            {LoadDispense ? (
              <>
                {dispenseError ? (
                  <RN.View style={{bottom: 30, height: 250}}>
                    <RN.Image
                      source={require('../../assets/images/vending_error.png')}
                      style={Styles.vending_error_image}
                    />
                  </RN.View>
                ) : (
                  <RN.View
                    style={{flexDirection: 'row', bottom: 90, height: 250}}>
                    <RN.Image
                      source={require('../../assets/images/vending_process2.gif')}
                      style={Styles.vending_process_image}
                    />
                    <RN.Image
                      source={require('../../assets/images/down_gif.gif')}
                      style={Styles.down_iamge}
                    />
                  </RN.View>
                )}
              </>
            ) : (
              <>
                {showCancel ? (
                  <>
                    <RN.Text style={Styles.input_text}></RN.Text>
                    <RN.View style={Styles.input_money_content}>
                      <SkypeIndicator color="#E6503C" count={5} size={70} />
                      <RN.Text style={Styles.cancel_text}>
                        กำลังยกเลิกรายการ
                      </RN.Text>
                    </RN.View>
                  </>
                ) : (
                  <>
                    <RN.Text style={Styles.input_text}>ยอดได้รับ</RN.Text>
                    <RN.View style={Styles.input_money_content}>
                      <RN.Text style={Styles.input_money_text}>
                        {inputValue}
                      </RN.Text>
                    </RN.View>
                  </>
                )}
              </>
            )}
          </RN.View>
          <RN.View style={Styles.money_active_container}>
            {!LoadDispense ? (
              <>
                <RN.View style={Styles.w100}>
                  <RN.Text style={Styles.money_active_text}>
                    ประเภทเหรียญและธนบัตรที่รับ :
                  </RN.Text>
                </RN.View>
                <RN.Image
                  source={require('../../assets/images/money_active.png')}
                  style={Styles.money_active_image}
                />
              </>
            ) : (
              <>
                {!dispenseError ? (
                  <RN.View style={[Styles.w100, {alignItems: 'center'}]}>
                    <RN.Text style={Styles.vending_process_text}>
                      เครื่องกำลังจ่ายของให้ท่าน ...
                    </RN.Text>
                  </RN.View>
                ) : (
                  <RN.View style={[Styles.w100, {alignItems: 'center'}]}>
                    <RN.Text style={Styles.vending_error_text}>
                      {msgError}
                    </RN.Text>
                  </RN.View>
                )}
              </>
            )}
          </RN.View>
          {!disableCancel ? (
            <RN.TouchableOpacity
              style={Styles.btn_cancel_container}
              onPress={() => closePayment()}>
              <LinearGradient
                start={{x: 1, y: 0}}
                style={Styles.btn_cancel_content}
                colors={['#93291E', '#ED213A', '#93291E']}>
                <RN.Text style={Styles.btn_cancel_text}>CANCEL</RN.Text>
              </LinearGradient>
            </RN.TouchableOpacity>
          ) : (
            <RN.View style={Styles.success_container}>
              <LinearGradient
                start={{x: 1, y: 0}}
                style={Styles.btn_cancel_content}
                colors={['#ddd', '#ddd', '#ddd']}>
                <RN.Text style={Styles.btn_cancel_text}>CANCEL</RN.Text>
              </LinearGradient>
            </RN.View>
          )}
          <RN.View style={Styles.timer_container}>
            <RN.View style={Styles.timer_content}>
              <Icon name="clock-outline" size={40} color={'#FF4B2B'} />
              <RN.Text style={Styles.timer_text}> {timer}</RN.Text>
            </RN.View>
            <RN.View style={Styles.vending_status_container}>
              <RN.Text style={Styles.vending_status_text}>
                สถานะตู้ : {vendingStatus}
              </RN.Text>
            </RN.View>
          </RN.View>
        </>
      </RN.View>
      {changeMoneyStatus && (
        <RN.View style={Styles.changeMoney_container}>
          <RN.View>
            <RN.Text style={Styles.changeMoney_text}>
              กรุณารับเงินทอนจำนวน{' '}
              <RN.Text style={Styles.change_color}>{changeMoney}</RN.Text> บาท
            </RN.Text>
            <RN.Text style={Styles.changeMoney_process_text}>
              เครื่องกำลังทอนเงิน ...
            </RN.Text>
          </RN.View>
          <RN.View style={Styles.changeMoney_image_container}>
            <LinearGradient
              start={{x: 1, y: 0}}
              style={Styles.changeMoney_image_content}
              colors={['#141E30', '#243B55', '#141E30']}>
              <RN.Image
                source={require('../../assets/images/change_money.gif')}
                style={Styles.changeMoney_image}
              />
            </LinearGradient>
          </RN.View>
        </RN.View>
      )}
    </RN.View>
  );
};

export default CashPaymentScreen;
