/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Styles} from '../styles/qr_style';
import {BarIndicator} from 'react-native-indicators';
import ERR from '../msgError';
import moment from 'moment';
import G from '../globalVar';

const maincontroll = require('../../maincontroll');
let dispenseTimeout = 0;
const CardPaymentScreen = ({product, transaction, updateTransaction}) => {
  const [LoadDispense, setLoadDispense] = React.useState(false);
  const [dispenseError, setDispenseError] = React.useState(false);
  const [msgError, setMsgError] = React.useState('กรุณารับเงินทอนจำนวน');
  const [timer, setTimer] = React.useState(transaction.qr.expireTimeSeconds);
  const [refundMoneyStatus, setRefundMoneyStatus] = React.useState(false);
  const [moneyRefund, setMoneyRefund] = React.useState(0);
  const [vendingStatus, setVendingStatus] = React.useState('');
  const [disableCancel, setDisableCancel] = React.useState(false);
  const [loadTran, setLoadTran] = React.useState(true);
  const [QrPayment, setQrPayment] = React.useState('data:image/png;base64,');

  let moneyInput = {coin: 0, bill: 0, total: 0};
  let firstload = false;
  let time_counter = false;

  React.useEffect(() => {
    if (!firstload) {
      startMDB();
      checkInputQRPayment();
      firstload = true;
    }
    if (disableCancel) return;
    if (timer <= 0) {
      closePayment();
      return;
    }
    time_counter = setTimeout(() => {
      setTimer(prevCount => prevCount - 1);
      console.log('timer qr : ', timer);
    }, 1000);
  }, [timer, disableCancel]);

  const startMDB = () => {
    if (!G.startSuccess) {
      dispenseTimeout = 0;
      let tempBase64 = QrPayment;
      let imageQr = tempBase64 + transaction.qr.imageWithBase64;
      setQrPayment(imageQr);
      setVendingStatus('Ready');
      setLoadTran(false);
      G.startSuccess = true;
    }
  };

  const checkInputQRPayment = async () => {
    if (G.QRPaymentResult.status === 'success' && G.paymentReady) {
      dispenseStatus();
      clearTimeout(time_counter);
      if (!G.PaymentSuccess) {
        console.log('PaymentSuccess::', G.QRPaymentResult);
        G.PaymentSuccess = true;
        setDisableCancel(true);
        var callbackDispense = false;
        try {
          callbackDispense = await maincontroll.dispense(
            Number(product.slot.col),
          );
        } catch (error) {}
        if (callbackDispense.result !== true) {
          if (dispenseTimeout > 3) {
          } else {
            setTimeout(() => {
              dispenseTimeout++;
              G.PaymentSuccess = false;
              checkInputQRPayment();
            }, 3000);
            return;
          }
        }
        if (callbackDispense && !callbackDispense.result) {
          if (!callbackDispense.result && callbackDispense.code === '104001') {
            setVendingStatus(callbackDispense.message);
            setLoadDispense(true);
            setDispenseError(true);
            setMsgError(ERR.msgError(callbackDispense.code));
            setTimeout(async () => {
              await refundMoney(
                'error',
                'No VMC Event: selectionnumber',
                '104001',
              );
            }, 3000);
          } else if (
            !callbackDispense.result &&
            callbackDispense.code === '50204'
          ) {
            setVendingStatus(callbackDispense.message);
            setLoadDispense(true);
            setDispenseError(true);
            setMsgError(ERR.msgError(callbackDispense.code));
            setTimeout(async () => {
              await refundMoney('error', 'selection pause', '50204');
            }, 3000);
          } else if (
            !callbackDispense.result &&
            callbackDispense.code === '50205'
          ) {
            setVendingStatus(callbackDispense.message);
            setLoadDispense(true);
            setDispenseError(true);
            setMsgError(ERR.msgError(callbackDispense.code));
            G.PaymentSuccess = false;
            setTimeout(() => {
              checkInputQRPayment();
            }, 3000);
          } else if (
            !callbackDispense.result &&
            callbackDispense.code === '50207'
          ) {
            setVendingStatus(callbackDispense.message);
            setLoadDispense(true);
            setDispenseError(true);
            setMsgError(ERR.msgError(callbackDispense.code));
            setTimeout(async () => {
              await refundMoney('error', 'Elevator error', '50207');
            }, 3000);
          } else {
            if (!callbackDispense.result) {
              setVendingStatus(callbackDispense.message);
              setLoadDispense(true);
              setDispenseError(true);
              setMsgError(ERR.msgError(callbackDispense.code));
              setTimeout(async () => {
                await refundMoney('error', 'Process Error .', '9999');
              }, 3000);
            } else {
              setVendingStatus('Process Error .');
              setLoadDispense(true);
              setDispenseError(true);
              setMsgError('เกิดข้อผิดพลาดในการทำรายการ .');
              errorTransaction('Process Error .', '9999');
            }
          }
        }
      }
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
            onPaymentSuccess();
          }, 3000);
          break;
        case '50203':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));
          maincontroll.off('dispense');
          await refundMoney('error', res.message, res.code);
          break;
        case '50204':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));
          maincontroll.off('dispense');
          await refundMoney('error', res.message, res.code);
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
          G.PaymentSuccess = false;
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
          await refundMoney('error', res.message, res.code);
          break;
        case '50205':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));
          // await maincontroll.off('dispense');
          // refundMoney();
          break;
        case '50207':
          setVendingStatus(res.message);
          setDispenseError(true);
          setLoadDispense(true);
          setMsgError(ERR.msgError(res.code));
          maincontroll.off('dispense');
          await refundMoney('error', res.message, res.code);
          break;
        default:
          break;
      }
    });
  };

  const onPaymentSuccess = () => {
    MdbTurnOff();
    let postdata = {
      action: 'complete',
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'Card',
        amount: moneyInput,
        changeMoney: 0,
      },
      transactionID: transaction.transactionID,
      kioskStatus: {msg: 'success', code: '2000'},
    };
    updateTransaction(postdata, 'complete');
  };

  const MdbTurnOff = () => {
    // clearInterval(this.timerInterval);
    maincontroll.off('receivemoney');
  };

  const refundMoney = async (action, msg, codeStatus) => {
    MdbTurnOff();
    let postdata = {
      action: action,
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'Card',
        amount: moneyInput,
        changeMoney: 0,
      },
      transactionID: transaction.transactionID,
      kioskStatus: {msg: msg, code: codeStatus},
    };
    setRefundMoneyStatus(true);
    let refund =
      product.price.sale > 0 ? product.price.sale : product.price.normal;
    console.log('amount refund', refund);
    setMoneyRefund(refund);
    const givechange = await maincontroll.givechange(Number(refund));
    console.log('refundMoney=>', givechange);
    updateTransaction(postdata, 'cancel', action);
  };

  const errorTransaction = (msg, codeStatus) => {
    MdbTurnOff();
    let postdata = {
      action: 'error',
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'ThaiQR',
        amount: moneyInput,
        changeMoney: 0,
      },
      transactionID: transaction.transactionID,
      kioskStatus: {msg: msg, code: codeStatus},
    };
    updateTransaction(postdata, 'cancel', 'error');
  };

  const closePayment = () => {
    MdbTurnOff();
    setDisableCancel(true);
    let postdata = {
      action: 'cancel',
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'Card',
        amount: moneyInput,
        changeMoney: 0,
      },
      transactionID: transaction.transactionID,
    };
    updateTransaction(postdata, 'cancel', 'cancel');
  };

  return (
    <RN.View style={[Styles.body_container]}>
      <RN.View style={Styles.container}>
        <>
          <RN.View style={Styles.timer_content}>
            <RN.Text style={Styles.timer_title_text}>Payment Time</RN.Text>
            <RN.Text style={Styles.timer_text}>
              {moment.unix(timer).format('mm:ss')}
            </RN.Text>
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
                    style={{flexDirection: 'row', bottom: 50, height: 250}}>
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
                <RN.View style={Styles.qrcode_container}>
                  <RN.View style={Styles.qrcode_content}>
                    {loadTran ? (
                      <BarIndicator color="#021B79" count={5} size={60} />
                    ) : (
                      <RN.Image
                        source={{uri: QrPayment}}
                        style={Styles.qrcode_image}
                      />
                    )}
                  </RN.View>
                </RN.View>
              </>
            )}
          </RN.View>
          <RN.View style={Styles.footerContainer}>
            {!LoadDispense ? (
              <>
                <RN.View style={Styles.mobile_banking_container}>
                  <RN.Image
                    source={require('../../assets/images/cradit_card.png')}
                    style={Styles.cradit_card_image}
                  />
                  <RN.Text style={Styles.title_text}>
                    กรุณาแสกน QR Payment เพื่อชำระสินค้า
                  </RN.Text>
                </RN.View>
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
          <RN.View style={Styles.vending_status_container}>
            <RN.Text style={Styles.vending_status_text}>
              สถานะตู้ : {vendingStatus}
            </RN.Text>
          </RN.View>
        </>
      </RN.View>
      {refundMoneyStatus && (
        <RN.View style={Styles.changeMoney_container}>
          <RN.View>
            <RN.Text style={Styles.changeMoney_text}>
              กรุณารับเงินคือจำนวน{' '}
              <RN.Text style={Styles.change_color}>{moneyRefund}</RN.Text> บาท
            </RN.Text>
            <RN.Text style={Styles.changeMoney_process_text}>
              เครื่องกำลังคืนเงิน ...
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

export default CardPaymentScreen;
