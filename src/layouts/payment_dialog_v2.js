/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Styles} from '../styles/payment_style_v2';
import {BarIndicator} from 'react-native-indicators';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

import {useRecoilState, useSetRecoilState} from 'recoil';
import * as GOLBAL from '../globalState';
import PaymentTimeout from '../components/payment/paymentTimeout';
import BlinkView from '../components/payment/BlinkView';
import POST from '../protocol';
import CashPaymentScreen from './cash_payment_fragment';
import QRPaymentScreen from './qr_payment_fragment';
import CardPaymentScreen from './card_payment_fragment';
import G from '../globalVar';
import PaymentButton from '../components/payment/paymentButton';

var timeout = 10;
var countProd = 1;
const PaymentV2 = ({dismiss, prod}) => {
  const [product] = React.useState(prod);
  const [selectPay, setSelectPay] = React.useState(true);
  const [selectCash, setSelectCash] = React.useState(false);
  const [selectQr, setSelectQr] = React.useState(false);
  const [selectCard, setSelectCard] = React.useState(false);
  const [stopTimeout, setStopTimeout] = React.useState(false);
  const [tranID, setTranID] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [maketransTO, setMakeTransTO] = React.useState(10);
  const [acceptErr, setacceptErr] = React.useState(false);
  const [showCountProd, setShowCountProd] = React.useState(1);
  const [sumTotal, setSumTotal] = React.useState(
    product.price.sale > 0 ? product.price.sale : product.price.normal,
  );

  const [cashStatus] = useRecoilState(GOLBAL.cash_method);
  const TRAN_SUCCESS = useSetRecoilState(GOLBAL.TRAN_SUCCESS);
  const [mqttClient] = useRecoilState(GOLBAL.mqttClient);
  const maincontroll = require('../../maincontroll');
  console.log(product.slotID);
  console.log(':::::', cashStatus);

  const openCoinAndBill = async type => {
    if (type === 'Cash') {
      console.log('OPEN Accept!!!');
      let active = true;
      const callbackCoin = await maincontroll.setcoinaccept(active);
      const callbackBill = await maincontroll.setbillaccept(active);
      console.log('COIN:', callbackCoin);
      console.log('BILL:', callbackBill);
      if (!callbackCoin.result || !callbackBill.result) {
        console.log('Bill and Cash fail');
        return false;
      }
    }
    handleTransaction(type);
    return true;
  };

  const handleTransaction = type => {
    console.log('PROD==========>', product);
    G.startSuccess = false;
    G.PaymentSuccess = false;
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
        //stopIntervalMaketrans();
        timeout = 10;
        setLoading(false);
        if (type === 'Cash') {
          setTranID(data.transactionID);
          setSelectQr(false);
          setSelectCash(true);
          setSelectCard(false);
        } else if (type === 'ThaiQR') {
          setTranID(data);
          setSelectQr(true);
          setSelectCash(false);
          setSelectCard(false);
        } else if (type === 'Card') {
          setTranID(data);
          setSelectQr(false);
          setSelectCash(false);
          setSelectCard(true);
        }
      } else {
        dismiss();
      }
    });
  };

  const updateTransaction = (postdata, action, req) => {
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
    console.log('product.slotID', product.slotID, 'CASH');
    setStopTimeout(true);
    G.paymentReady = true;
    setSelectPay(false);
    setLoading(true);
    var openAccept = false;
    try {
      openAccept = await openCoinAndBill('Cash');
    } catch (error) {
      console.log('openCoinAndBill:::', error);
    }
    console.log('openAccept', openAccept);
    if (openAccept !== true) {
      timeout--;
      setMakeTransTO(timeout);
      if (timeout <= 0) {
        setacceptErr(true);
        setTimeout(() => {
          setacceptErr(false);
          dismiss();
        }, 3500);
        timeout = 10;
      } else {
        setTimeout(() => {
          onSelectCash();
        }, 1000);
      }
      return;
    }
  };

  const onSelectQr = payType => {
    G.paymentReady = true;
    if (payType.type === 'card') {
      G.QRPaymentResult = {};
      setStopTimeout(true);
      G.paymentReady = true;
      setSelectPay(false);
      setLoading(true);
      handleTransaction('Card');
    } else {
      G.QRPaymentResult = {};
      setStopTimeout(true);
      G.paymentReady = true;
      setSelectPay(false);
      setLoading(true);
      handleTransaction('ThaiQR');
    }
  };

  const onCloseSelectPayment = () => {
    setStopTimeout(false);
    G.paymentReady = false;
    setSelectPay(true);
    setSelectCash(false);
    setSelectQr(false);
    setSelectCard(false);
    console.log('onCloseSelectPayment');
  };

  const onPaymentSccess = () => {
    G.paymentReady = false;
    dismiss();
    G.QRPaymentResult = {};
    TRAN_SUCCESS(true);
    setTimeout(() => {
      TRAN_SUCCESS(false);
    }, 5000);
  };

  const onPaymentFail = () => {
    G.paymentReady = false;
    dismiss();
    G.QRPaymentResult = {};
  };

  const onPaymentCancel = () => {
    console.log('onPaymentCancel');
    G.paymentReady = false;
    onCloseSelectPayment();
    G.QRPaymentResult = {};
  };

  const onPaymentTimeOut = () => {
    G.paymentReady = false;
    dismiss();
  };

  return (
    <LinearGradient
      style={Styles.flex}
      colors={['#F1F1F1', '#F1F1F1', '#F1F1F1']}>
      <RN.View style={Styles.container}>
        <RN.View style={Styles.product_container}>
          {product.productImage != 'https://noimageurl' ? (
            <RN.Image
              source={{uri: product.productImage}}
              style={Styles.product_image}
            />
          ) : (
            <RN.Image
              source={require('../../assets/images/box.png')}
              style={Styles.product_image_not_found}
            />
          )}
          <RN.View style={Styles.product_content}>
            {product.price.sale > 0 && (
              <LinearGradient
                colors={['#dd1818', '#ED213A', '#dd1818']}
                style={Styles.product_promotion_content}>
                <RN.Text style={Styles.product_promotion}>SALE</RN.Text>
              </LinearGradient>
            )}
            <RN.View style={Styles.product_price_container}>
              <RN.View style={Styles.product_name_content}>
                <RN.Text style={Styles.product_name_text}>
                  {product.productName}
                </RN.Text>
              </RN.View>
              <RN.View style={Styles.product_price_content}>
                <RN.Text style={Styles.product_price_text}>
                  {product.price.sale > 0
                    ? product.price.sale
                    : product.price.normal}{' '}
                  บาท
                </RN.Text>
              </RN.View>
            </RN.View>
            <RN.View style={Styles.product_detail_content}>
              <RN.ScrollView>
                <RN.Text style={Styles.product_detail_text}>
                  {product.description}
                </RN.Text>
              </RN.ScrollView>
            </RN.View>
          </RN.View>
        </RN.View>
        {selectPay ? (
          <>
            <RN.View style={Styles.paymentTitle_content}>
              <RN.Text style={Styles.payment_title_text}>
                เลือกวิธีการชำระเงิน
              </RN.Text>
              <RN.View style={Styles.payment_line} />
            </RN.View>
            <PaymentButton
              selectQrType={onSelectQr}
              onSelectCash={onSelectCash}
              product={product}
            />
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
              <RN.View style={[Styles.w100, Styles.set_center]}>
                <BarIndicator
                  color="#021B79"
                  count={5}
                  size={100}
                  style={Styles.mt45per}
                />
                <RN.Text style={Styles.make_transaction_text}>
                  กำลังสร้างรายการ
                </RN.Text>
                <RN.Text style={Styles.timeout_make_transaction}>
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
      <Modal isVisible={acceptErr} style={Styles.al_center}>
        <RN.Image
          source={require('../../assets/images/coinbill_fail.png')}
          style={Styles.coinbill_fail_image}
        />
        <BlinkView blinkDuration={400}>
          <RN.Text style={Styles.coinbill_fail_text}>
            เกิดข้อผิดพลาดกับเครื่องรับเหรียญและรับแบงค์
          </RN.Text>
        </BlinkView>
      </Modal>
    </LinearGradient>
  );
};

export default PaymentV2;
