/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useRecoilState} from 'recoil';
import * as GOLBAL from '../globalState';
import {Styles} from '../styles/qr_style';
import {BarIndicator} from 'react-native-indicators';
import ERR from '../msgError';
import moment from 'moment';
import Script from '../script';

const maincontroll = require('../../maincontroll');

const QRPaymentScreen = ({product, transaction, updateTransaction}) => {
  const [LoadDispense, setLoadDispense] = React.useState(false);
  const [dispenseError, setDispenseError] = React.useState(false);
  const [msgError, setMsgError] = React.useState('กรุณารับเงินทอนจำนวน');
  const [inputValue, setInputValue] = React.useState(0);
  const [timer, setTimer] = React.useState(transaction.qr.expireTimeSeconds);
  const [refundMoneyStatus, setRefundMoneyStatus] = React.useState(false);
  const [moneyRefund, setMoneyRefund] = React.useState(0);
  const [vendingStatus, setVendingStatus] = React.useState('');
  const [disableCancel, setDisableCancel] = React.useState(false);
  const [loadTran, setLoadTran] = React.useState(true);
  const [QrPayment, setQrPayment] = React.useState('data:image/png;base64,');
  const [startSuccess, setStartSucess] = React.useState(false);
  const [PaymentSuccess, setPaymentSuccess] = React.useState(false);
  const [statusCode, setStatusCode] = React.useState('');
  const [msgMdb, setMsgMdb] = React.useState('');
  const [turnOff, setTurnOff] = React.useState(false);

  const [QRPaymentResult] = useRecoilState(GOLBAL.QRPaymentResult);
  const [paymentReady] = useRecoilState(GOLBAL.paymentReady);

  let moneyInput = {coin: 0, bill: 0, total: 0};

  React.useEffect(() => {
    startMDB();
    checkInputQRPayment();
    const interval = setInterval(() => {
      setTimer(prevCount => prevCount - 1);
    }, 1000);
    if (timer <= 0) {
      clearInterval(interval);
      closePayment();
    }
    if (disableCancel) {
      clearInterval(interval);
    }
    return () => {
      console.log('Clear !!!!');
      clearInterval(interval);
    };
  }, [timer, disableCancel]);

  const startMDB = () => {
    console.log('startMDB');
    if (!startSuccess) {
      console.log(startSuccess);
      let tempBase64 = QrPayment;
      let imageQr = tempBase64 + transaction.qr.imageWithBase64;
      setQrPayment(imageQr);
      setVendingStatus('Ready');
      setLoadTran(false);
      setStartSucess(true);
    }
  };

  const checkInputQRPayment = async () => {
    if (QRPaymentResult.status === 'success' && paymentReady) {
      dispenseStatus();
      if (!PaymentSuccess) {
        console.log('PaymentSuccess::', QRPaymentResult);
        setPaymentSuccess(true);
        setDisableCancel(true);
        const callbackDispense = await maincontroll.dispense(
          Number(product.slot.col),
        );
        console.log('callbackDispense::', callbackDispense);
        if (callbackDispense && !callbackDispense.result) {
          if (!callbackDispense.result && callbackDispense.code === '104001') {
            setVendingStatus(callbackDispense.message);
            setLoadDispense(true);
            setDispenseError(true);
            setMsgError(ERR.msgError(callbackDispense.code));
            setStatusCode(callbackDispense.code);
            setMsgMdb(callbackDispense.message);
            setTimeout(async () => {
              await refundMoney(
                'error',
                callbackDispense.message,
                callbackDispense.code,
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
            setStatusCode(callbackDispense.code);
            setMsgMdb(callbackDispense.message);
            setTimeout(async () => {
              await refundMoney(
                'error',
                callbackDispense.message,
                callbackDispense.code,
              );
            }, 3000);
          } else if (
            !callbackDispense.result &&
            callbackDispense.code === '50205'
          ) {
            setVendingStatus(callbackDispense.message);
            setLoadDispense(true);
            setDispenseError(true);
            setMsgError(ERR.msgError(callbackDispense.code));
            setPaymentSuccess(false);
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
            setStatusCode(callbackDispense.code);
            setMsgMdb(callbackDispense.message);
            setTimeout(async () => {
              await refundMoney(
                'error',
                callbackDispense.message,
                callbackDispense.code,
              );
            }, 3000);
          } else {
            if (!callbackDispense.result) {
              setVendingStatus(callbackDispense.message);
              setLoadDispense(true);
              setDispenseError(true);
              setMsgError(ERR.msgError(callbackDispense.code));
              setStatusCode(callbackDispense.code);
              setMsgMdb(callbackDispense.message);
              setTimeout(async () => {
                await refundMoney(
                  'error',
                  callbackDispense.message,
                  callbackDispense.code,
                );
              }, 3000);
            } else {
              setVendingStatus('Process Error .');
              setLoadDispense(true);
              setDispenseError(true);
              setMsgError('เกิดข้อผิดพลาดในการทำรายการ .');
              setStatusCode('9999');
              setMsgMdb('Process Error .');
              errorTransaction();
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
          setTurnOff(true);
          onPaymentSuccess();
          break;
        case '50203':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));
          setStatusCode(String(res.code));
          setMsgMdb(res.message);
          maincontroll.off('dispense');
          await refundMoney('error', res.message, res.code);
          break;
        case '50204':
          setVendingStatus(res.message);
          setDispenseError(true);
          setLoadDispense(true);
          setMsgError(ERR.msgError(res.code));
          setStatusCode(res.code);
          setMsgMdb(res.message);
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
          setPaymentSuccess(false);
          break;
        case '50441':
          setVendingStatus(res.message);
          break;
        case '50403':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));
          setStatusCode(res.code);
          setMsgMdb(res.message);
          maincontroll.off('dispense');
          await refundMoney('error', res.message, res.code);
          break;
        case '50205':
          setVendingStatus(res.message);
          setLoadDispense(true);
          setDispenseError(true);
          setMsgError(ERR.msgError(res.code));
          //await maincontroll.off('dispense');
          //refundMoney();
          break;
        case '50207':
          setVendingStatus(res.message);
          setDispenseError(true);
          setLoadDispense(true);
          setMsgError(ERR.msgError(res.code));
          setStatusCode(res.code);
          setMsgMdb(res.message);
          maincontroll.off('dispense');
          await refundMoney('error', res.message, res.code);
          break;
        default:
          break;
      }
    });
  };

  const onPaymentSuccess = async () => {
    MdbTurnOff();
    let postdata = {
      action: 'complete',
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'Cash',
        amount: moneyInput,
        changeMoney: 0,
      },
      transactionID: transaction.transactionID,
      kioskStatus: {msg: 'success', code: '2000'},
    };
    updateTransaction(postdata, 'complete');
  };

  const MdbTurnOff = async () => {
    // clearInterval(this.timerInterval);
    await maincontroll.off('receivemoney');
  };

  const refundMoney = async action => {
    console.log('start refund');
    MdbTurnOff();
    let postdata = {
      action: action,
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'ThaiQR',
        amount: moneyInput,
        changeMoney: 0,
      },
      transactionID: transaction.transactionID,
      kioskStatus: {msg: msgMdb, code: statusCode},
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

  const errorTransaction = async () => {
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
      kioskStatus: {msg: msgMdb, code: statusCode},
    };
    updateTransaction(postdata, 'cancel', 'error');
  };

  const closePayment = async () => {
    MdbTurnOff();
    setDisableCancel(true);
    let postdata = {
      action: 'cancel',
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'ThaiQR',
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
                    source={require('../../assets/images/mobile_banking.png')}
                    style={Styles.mobile_banking_image}
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
    </RN.View>
  );
};

export default QRPaymentScreen;
