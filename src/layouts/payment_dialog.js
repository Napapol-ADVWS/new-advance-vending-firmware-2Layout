/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Styles} from '../styles/payment_style';
import * as navigate from '../navigator/RootNavigation';
import {BarIndicator} from 'react-native-indicators';
import Modal from 'react-native-modal';

import Cash from '../components/payment/cash_select';
import Qr from '../components/payment/qr_select';
import CraditCard from '../components/payment/card_select';
import QrType from '../components/payment/qr_type';

import {useRecoilState, useSetRecoilState} from 'recoil';
import * as GOLBAL from '../globalState';
import PaymentTimeout from '../components/payment/paymentTimeout';
import BlinkView from '../components/payment/BlinkView';
import POST from '../protocol';
import CashPaymentScreen from './cash_payment_fragment';
import QRPaymentScreen from './qr_payment_fragment';
import CardPaymentScreen from './card_payment_fragment';
import Script from '../script';

import moment from 'moment';

var timeout = 30;
const Payment = ({dismiss, prod}) => {
  const [product] = React.useState(prod);
  const [selectPay, setSelectPay] = React.useState(true);
  const [selectCash, setSelectCash] = React.useState(false);
  const [selectQr, setSelectQr] = React.useState(false);
  const [selectCard, setSelectCard] = React.useState(false);
  const [cashAction, setCashAction] = React.useState(false);
  const [prodjammed, setProdjammed] = React.useState(false);
  const [stopTimeout, setStopTimeout] = React.useState(false);
  const [tranID, setTranID] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [maketransTO, setMakeTransTO] = React.useState(30);
  const [acceptErr, setacceptErr] = React.useState(false);

  const [cashStatus] = useRecoilState(GOLBAL.cash_method);
  const TRAN_SUCCESS = useSetRecoilState(GOLBAL.TRAN_SUCCESS);
  const [mqttClient] = useRecoilState(GOLBAL.mqttClient);
  const [QRPaymentResult] = useRecoilState(GOLBAL.QRPaymentResult);
  const setQRPaymentResult = useSetRecoilState(GOLBAL.QRPaymentResult);
  const [paymentReady] = useRecoilState(GOLBAL.paymentReady);
  const setPaymentReady = useSetRecoilState(GOLBAL.paymentReady);
  const intervalTransRef = React.useRef(null);
  const maincontroll = require('../../maincontroll');
  console.log(product.slotID);
  console.log(':::::', cashStatus);

  const startIntervalMaketrans = () => {
    const intervalId = setInterval(() => {
      timeout -= 1;
      setMakeTransTO(timeout);
      console.log('Trans to:', timeout);
      if (timeout <= 0) {
        stopIntervalMaketrans();
        setStopTimeout(false);
        setPaymentReady(false);
        setSelectPay(true);
        setLoading(false);
        setacceptErr(true);
        setTimeout(() => {
          setacceptErr(false);
        }, 3000);
      }
    }, 1000);

    return intervalId;
  };

  const stopIntervalMaketrans = () => {
    if (intervalTransRef.current) {
      clearInterval(intervalTransRef.current);
      intervalTransRef.current = null;
      timeout = 30;
      setMakeTransTO(30);
    }
  };

  const openCoinAndBill = async type => {
    // Script.checkInRecheck(mqttClient);
    console.log('START openCoinAndBill');
    if (!intervalTransRef.current) {
      intervalTransRef.current = startIntervalMaketrans();
    }
    if (type === 'Cash') {
      console.log('OPEN Accept!!!');
      let active = true;
      const callbackCoin = await maincontroll.setcoinaccept(active);
      //await maincontroll.delay2();
      const callbackBill = await maincontroll.setbillaccept(active);
      console.log('COIN:', callbackCoin);
      console.log('BILL:', callbackBill);
    }
    await handleTransaction(type);
  };

  const handleTransaction = async type => {
    console.log('PROD==========>', product);
    let prodPrice =
      product.price.sale > 0 ? product.price.sale : product.price.normal;
    let postdata = {
      payment: {
        type: type,
        price: prodPrice,
      },
      slot: {
        col: product.slot.col,
        row: product.slot.row,
      },
    };
    console.log(postdata);
    console.log(mqttClient);
    // Back Up Post API Call Back

    POST.postJson('makeTransaction', postdata, callback => {
      console.log('TRANSACTION:', callback);
      var data = callback;
      if (data.code === 200) {
        stopIntervalMaketrans();
        setLoading(false);
        if (type === 'Cash') {
          setTranID(data.transactionID);
        } else {
          setTranID(data);
        }
        if (type === 'Cash') {
          setSelectQr(false);
          setSelectCash(true);
          setSelectCard(false);
        } else if (type === 'ThaiQR') {
          setSelectQr(true);
          setSelectCash(false);
          setSelectCard(false);
        } else if (type === 'Card') {
          setSelectQr(false);
          setSelectCash(false);
          setSelectCard(true);
        }
      } else {
        dismiss();
      }
    });
  };

  const updateTransaction = async (postdata, action, req) => {
    if (action === 'complete') {
      onPaymentSccess();
    } else if (action === 'cancel') {
      if (req === 'error') {
        console.log('FAIL : ', req);
        onPaymentFail();
      } else if (req === 'cancel') {
        console.log('CANCEL : ', req);
        onPaymentCancel();
      }
    }
    console.log('POSTDATA', postdata);

    POST.postJson('updateTransaction', postdata, callback => {
      console.log('TRANSACTION:', callback);
    });
  };

  const onSelectCash = async () => {
    console.log('product.slotID', product.slotID);
    setStopTimeout(true);
    setPaymentReady(true);
    setSelectPay(false);
    setLoading(true);
    await openCoinAndBill('Cash');
  };

  const onSelectQr = payType => {
    setPaymentReady(true);
    //maincontroll.selectionnumber(product.slotID, res => {
    // if (res.code !== '50205') {
    //   setProdjammed(false);
    // if (payType.type === 'card') {
    //   setQRPaymentResult({});
    //   setSelectPay(false);
    //   setSelectQr(false);
    //   setSelectCash(false);
    //   setSelectCard(true);
    // } else {
    //   setQRPaymentResult({});
    //   setSelectPay(false);
    //   setSelectQr(true);
    //   setSelectCash(false);
    //   setSelectCard(false);
    // }
    // } else {
    //   setProdjammed(true);
    // }
    //});
    if (payType.type === 'card') {
      setQRPaymentResult({});
      setStopTimeout(true);
      setPaymentReady(true);
      setSelectPay(false);
      setLoading(true);
      handleTransaction('Card');
    } else {
      setQRPaymentResult({});
      setStopTimeout(true);
      setPaymentReady(true);
      setSelectPay(false);
      setLoading(true);
      handleTransaction('ThaiQR');
    }
  };

  const onCloseSelectPayment = () => {
    setStopTimeout(false);
    setPaymentReady(false);
    setSelectPay(true);
    setSelectCash(false);
    setSelectQr(false);
    setSelectCard(false);
    console.log('onCloseSelectPayment');
  };

  const onPaymentSccess = () => {
    setPaymentReady(false);
    dismiss();
    setQRPaymentResult({});
    TRAN_SUCCESS(true);
    setTimeout(() => {
      TRAN_SUCCESS(false);
    }, 5000);
  };

  const onPaymentFail = () => {
    setPaymentReady(false);
    dismiss();
    setQRPaymentResult({});
  };

  const onPaymentCancel = () => {
    console.log('onPaymentCancel');
    setPaymentReady(false);
    onCloseSelectPayment();
    setQRPaymentResult({});
  };

  const onPaymentTimeOut = () => {
    setPaymentReady(false);
    dismiss();
  };

  return (
    <LinearGradient
      style={Styles.flex}
      colors={['#F1F1F1', '#F1F1F1', '#F1F1F1']}>
      <RN.View style={Styles.container}>
        <RN.View style={Styles.product_container}>
          <RN.Image
            source={{
              uri: product.productImage,
            }}
            style={Styles.product_image}
          />
        </RN.View>
        <RN.View style={Styles.product_content}>
          <RN.Text style={Styles.product_name_text}>
            {product.productName}
          </RN.Text>
          <RN.View style={{width: '100%', height: 100}}>
            <RN.ScrollView>
              <RN.Text style={Styles.product_detail_text}>
                {product.description}
              </RN.Text>
            </RN.ScrollView>
          </RN.View>
          <RN.View style={{flexDirection: 'row'}}>
            {product.price.sale > 0 && (
              <LinearGradient
                colors={['#dd1818', '#ED213A', '#dd1818']}
                style={Styles.product_promotion_content}>
                <RN.Text style={Styles.product_promotion}>SALE</RN.Text>
              </LinearGradient>
            )}
            <RN.Text style={Styles.product_price_text}>
              ราคา{' '}
              {product.price.sale > 0
                ? product.price.sale
                : product.price.normal}{' '}
              บาท
            </RN.Text>
          </RN.View>
        </RN.View>
        {selectPay ? (
          <>
            <RN.View style={Styles.paymentTitle_content}>
              <RN.Text style={Styles.payment_title_text}>
                ชำระด้วยเงินสด :
              </RN.Text>
            </RN.View>
            <RN.View style={Styles.btn_payment_content}>
              <RN.TouchableOpacity
                style={Styles.btn_payment}
                disabled={cashStatus ? false : true}
                onPress={async () => await onSelectCash()}>
                <RN.Image
                  source={
                    cashStatus
                      ? require('../../assets/images/money_th_icon.png')
                      : require('../../assets/images/money_th_icon_disable.png')
                  }
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={[Styles.cash_image, {opacity: cashStatus ? 1 : 0.7}]}
                />
              </RN.TouchableOpacity>
            </RN.View>
            <QrType selectQrType={onSelectQr} product={product} />
            {prodjammed ? (
              <BlinkView blinkDuration={400}>
                <RN.Text
                  style={{
                    color: 'red',
                    fontSize: 22,
                    fontWeight: 'bold',
                    marginTop: 40,
                  }}>
                  มีสินค้าอยู่ในลิฟท์ กรุณานำสินค้าออก
                </RN.Text>
              </BlinkView>
            ) : (
              <RN.View style={{width: '100%', height: 70}} />
            )}
            <PaymentTimeout
              dismiss={onPaymentTimeOut}
              stopTimeout={stopTimeout}
            />
            <RN.TouchableOpacity
              activeOpacity={1}
              style={Styles.btn_cancel_container}
              onPress={() => dismiss()}>
              <LinearGradient
                start={{x: 1, y: 0}}
                style={Styles.btn_cancel_content}
                colors={['#93291E', '#ED213A', '#93291E']}>
                <RN.Text style={Styles.cancel_text}>CANCEL</RN.Text>
              </LinearGradient>
            </RN.TouchableOpacity>
          </>
        ) : (
          <>
            {loading && (
              <RN.View
                style={[
                  Styles.w100,
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <BarIndicator
                  color="#021B79"
                  count={5}
                  size={100}
                  style={{marginTop: '45%'}}
                />
                <RN.Text
                  style={{
                    marginTop: '10%',
                    fontSize: 22,
                    color: '#021B79',
                    fontWeight: 'bold',
                  }}>
                  กำลังสร้างรายการ
                </RN.Text>
                <RN.Text
                  style={{
                    marginTop: '40%',
                    fontSize: 16,
                    color: '#021B79',
                    fontWeight: 'bold',
                  }}>
                  {maketransTO}
                </RN.Text>
              </RN.View>
            )}
          </>
        )}
        {selectCash && (
          <RN.View style={Styles.w100}>
            <CashPaymentScreen
              product={product}
              transactionID={tranID}
              updateTransaction={updateTransaction}
            />
          </RN.View>
        )}
        {selectQr && (
          <RN.View style={Styles.w100}>
            <QRPaymentScreen
              product={product}
              transaction={tranID}
              updateTransaction={updateTransaction}
            />
          </RN.View>
        )}
        {selectCard && (
          <RN.View style={Styles.w100}>
            <CardPaymentScreen
              product={product}
              transaction={tranID}
              updateTransaction={updateTransaction}
            />
          </RN.View>
        )}
      </RN.View>
      <Modal isVisible={acceptErr} style={{alignItems: 'center'}}>
        <RN.Image
          source={require('../../assets/images/coinbill_fail.png')}
          style={{
            width: 500,
            height: 500,
            resizeMode: 'contain',
          }}
        />
        <BlinkView blinkDuration={400}>
          <RN.Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 32,
              textAlign: 'center',
            }}>
            เกิดข้อผิดพลาดกับเครื่องรับเหรียญและรับแบงค์
          </RN.Text>
        </BlinkView>
      </Modal>
    </LinearGradient>
  );
};

export default Payment;
