import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {Styles} from '../../styles/cash_style';
import POST from '../../protocol/index';
import {BarIndicator} from 'react-native-indicators';
import ERRORS from '../../msgError';
import BlinkView from './BlinkView';

const maincontroll = require('../../../maincontroll');
export default class cash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 60,
      inputValue: 0,
      coinInput: {
        c1: 0,
        c2: 0,
        c5: 0,
        c10: 0,
      },
      billInput: {
        b20: 0,
        b50: 0,
        b100: 0,
        b500: 0,
        b1000: 0,
      },
      moneyInput: {coin: 0, bill: 0, total: 0},
      changeMoney: 0,
      changeMoneyStatus: false,
      transactionID: 0,
      loadTran: true,
      LoadDispense: false,
      dispenseError: false,
      errorMsg: '',
      mdbStatus: [],
      pickupAction: false,
      sold_out: false,
      timeoutRefund: 20,
      processStatus: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.handleTransaction();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.MdbTurnOff();
  }

  handleTransaction = () => {
    console.log('PROD', this.props.product);
    if (this._isMounted) {
      this.setState(prevState => ({pickupAction: false, processStatus: true}));
      let prodPrice =
        this.props.product.price.sale > 0
          ? this.props.product.price.sale
          : this.props.product.price.normal;
      let postdata = {
        payment: {
          type: 'Cash',
          price: prodPrice,
        },
        slot: {
          col: this.props.product.slot.col,
          row: this.props.product.slot.row,
        },
      };
      console.log(postdata);
      console.log(this.props.mqttClient);
      POST.postJson('makeTransaction', postdata, async callback => {
        console.log('TRANSACTION:', callback);
        var data = await callback;
        if (data.code === 200) {
          let active = true;
          const callbackCoin = await maincontroll.setcoinaccept(active);
          await maincontroll.delay2();
          const callbackBill = await maincontroll.setbillaccept(active);
          console.log('COIN:', callbackCoin);
          console.log('BILL:', callbackBill);
          this.dispenseStatus();
          this.setState(prevState => ({
            transactionID: data.transactionID,
            loadTran: false,
          }));
          this.timerInterval = setInterval(this.countdownPayment, 1000);
          this.checkInputMoney();
        }
      });
    }
  };

  dispenseStatus = () => {
    maincontroll.on('dispense', async res => {
      console.log('dispense status:', res);
      switch (res.code) {
        case '50401':
          this.setState({LoadDispense: true});
          let active = false;
          break;
        case '50402':
          this.setState({
            LoadDispense: false,
            sold_out: true,
            processStatus: false,
          });
          maincontroll.off('dispense');
          await this.transactionSuccess();
          break;
        case '50204':
          this.setState({
            dispenseError: true,
            msgError: ERRORS.msgError(res.code),
          });
          maincontroll.off('dispense');
          this.refundMoneyTotal();
          break;
        case '50410':
          this.setState({LoadDispense: true});
          break;
        case '50411':
          this.setState({LoadDispense: true, pickupAction: true});
          break;
        case '50441':
          this.setState({LoadDispense: true});
          break;
        case '50403':
          this.setState({
            dispenseError: true,
            msgError: ERRORS.msgError(res.code),
          });
          maincontroll.off('dispense');
          this.refundMoneyTotal();
          break;
        case '50205':
          this.setState({
            dispenseError: true,
            msgError: ERRORS.msgError(res.code),
          });
          maincontroll.off('dispense');
          this.refundMoneyTotal();
          break;
        case '50207':
          this.setState({
            dispenseError: true,
            msgError: ERRORS.msgError(res.code),
          });
          maincontroll.off('dispense');
          this.refundMoneyTotal();
          break;
        default:
          break;
      }
    });
  };

  countdownPayment = () => {
    let timeout = this.state.timer;
    timeout -= 1;
    this.setState({
      timer: timeout,
    });
    if (timeout <= 0) {
      this.dismiss();
    }
  };

  checkInputMoney = () => {
    console.log('START', 'checkInputMoney');
    maincontroll.on('receivemoney', MadRes => {
      console.log('AMOUNT:::::', MadRes);
      this.checkTypeMoney(MadRes.amount, async data => {
        this.setState({
          inputValue: this.state.inputValue + Number(MadRes.amount),
          coinInput: data.coinInputSet,
          billInput: data.billInputSet,
          moneyInput: data.moneyInputSet,
          timer: 60,
        });
        console.log(this.state.inputValue);
        let prod_price =
          this.props.product.price.sale > 0
            ? this.props.product.price.sale
            : this.props.product.price.normal;
        if (this.state.inputValue >= prod_price) {
          let changeMoney = Number(this.state.inputValue) - Number(prod_price);
          if (Number(changeMoney) > 0) {
            this.setState({changeMoney: changeMoney});
          }
          // if (this.state.processStatus) {
          //   this.dispenseProduct();
          // }
          //setTimeout(() => {
          let active = false;
          await maincontroll.setcoinaccept(active);
          await maincontroll.delay2();
          await maincontroll.setbillaccept(active);
          await maincontroll.delay2();
          await maincontroll.clearwait();
          await this.dispenseProduct();
          //}, 2000);
        }
      });
    });
  };

  checkTypeMoney = (amount, cb) => {
    let coinInputSet = this.state.coinInput;
    let billInputSet = this.state.billInput;
    let moneyInputSet = this.state.moneyInput;
    switch (Number(amount)) {
      case 1:
        coinInputSet.c1 += 1;
        moneyInputSet.coin += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      case 2:
        coinInputSet.c2 += 1;
        moneyInputSet.coin += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      case 5:
        coinInputSet.c5 += 1;
        moneyInputSet.coin += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      case 10:
        coinInputSet.c10 += 1;
        moneyInputSet.coin += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      case 20:
        billInputSet.b20 += 1;
        moneyInputSet.bill += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      case 50:
        billInputSet.b50 += 1;
        moneyInputSet.bill += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      case 100:
        billInputSet.b100 += 1;
        moneyInputSet.bill += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      case 500:
        billInputSet.b500 += 1;
        moneyInputSet.bill += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      case 1000:
        billInputSet.b1000 += 1;
        moneyInputSet.bill += Number(amount);
        moneyInputSet.total += Number(amount);
        break;
      default:
        break;
    }
    let callback = {
      coinInputSet: coinInputSet,
      billInputSet: billInputSet,
      moneyInputSet: moneyInputSet,
    };
    cb(callback);
  };

  dispenseProduct = async () => {
    this.MdbTurnOff();
    let active = false;
    const callbackCoin = await maincontroll.setcoinaccept(active);
    const callbackBill = await maincontroll.setbillaccept(active);
    console.log('COIN:', callbackCoin);
    console.log('BILL:', callbackBill);
    const callbackDispense = await maincontroll.dispense(
      Number(this.props.product.slot.col),
    );
    if (!callbackDispense.result && callbackDispense.code === '104001') {
      this.setState({
        LoadDispense: true,
        dispenseError: true,
        msgError: ERRORS.msgError(callbackDispense.code),
      });
      setTimeout(() => {
        this.refundMoneyTotal();
      }, 5000);
    } else if (!callbackDispense.result && callbackDispense.code === '50204') {
      this.setState({
        LoadDispense: true,
        dispenseError: true,
        msgError: ERRORS.msgError(callbackDispense.code),
      });
      setTimeout(() => {
        this.refundMoneyTotal();
      }, 5000);
    }
  };

  transactionSuccess = () => {
    let postdata = {
      action: 'complete',
      payment: {
        coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
        type: 'Cash',
        moneyInput: {
          coin: this.state.coinInput,
          bill: this.state.billInput,
        },
        amount: this.state.moneyInput,
        changeMoney: this.state.changeMoney,
      },
      transactionID: this.state.transactionID,
      kioskStatus: {msg: 'success', code: '2000'},
    };
    POST.postJson('updateTransaction', postdata, callback => {
      console.log('updateTransaction:', callback);
      this.setState({transactionID: 0});
      if (callback.code === 200) {
        if (this.state.changeMoney > 0) {
          this.setState({changeMoneyStatus: true});
          this.changeMoneyTotal();
        } else {
          const {onPaymentSccess} = this.props;
          this.onPaymentSccess = onPaymentSccess;
          this.onPaymentSccess();
          this.setState({sold_out: false});
        }
      }
    });
  };

  changeMoneyTotal = async () => {
    console.log('CHANGE  MONEY!!!', this.state.changeMoney);
    await maincontroll.delay2();
    await maincontroll.clearwait();
    const callback = await maincontroll.givechange(
      Number(this.state.changeMoney),
    );
    console.log('givechange::', callback);
    if (callback.result) {
      await maincontroll.resetmoney();
      this.MdbTurnOff();
      const {onPaymentSccess} = this.props;
      this.onPaymentSccess = onPaymentSccess;
      this.onPaymentSccess();
      this.setState({sold_out: false});
    } else {
      this.setState({
        sold_out: false,
        LoadDispense: true,
        dispenseError: true,
        changeMoneyStatus: false,
        msgError: ERRORS.msgError(callback.code),
      });
      const {onPaymentSccess} = this.props;
      this.onPaymentSccess = onPaymentSccess;
      this.onPaymentSccess();
      this.setState({sold_out: false});
    }
  };

  refundMoneyTotal = async () => {
    console.log('refundMoneyTotal', this.state.inputValue);
    const callback = await maincontroll.givechange(
      Number(this.state.inputValue),
    );
    console.log('refundMoneyTotal SUCCESS', callback);
    if (callback.result) {
      // clearInterval(this.timeoutRefundInterval);
      // this.setState({timeoutRefund: 20});
      await maincontroll.resetmoney();
      const {onPaymentFail} = this.props;
      this.onPaymentFail = onPaymentFail;
      this.onPaymentFail();
    } else {
      this.setState({
        sold_out: false,
        LoadDispense: true,
        dispenseError: true,
        changeMoneyStatus: false,
        msgError: ERRORS.msgError(callback.code),
      });
      const {onPaymentFail} = this.props;
      this.onPaymentFail = onPaymentFail;
      this.onPaymentFail();
      this.setState({sold_out: false});
    }
    //});
  };

  // refundTimeOut = () => {
  //   if (this.state.timeoutRefund <= 0) {
  //     clearInterval(this.timeoutRefundInterval);
  //     this.setState({timeoutRefund: 20});
  //     let postdata = {
  //       action: 'cancel',
  //       payment: {
  //         coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
  //         type: 'Cash',
  //         moneyInput: {
  //           coin: this.state.coinInput,
  //           bill: this.state.billInput,
  //         },
  //         amount: this.state.moneyInput,
  //         changeMoney: this.state.changeMoney,
  //       },
  //       transactionID: this.state.transactionID,
  //     };
  //     POST.postJson('updateTransaction', postdata, async callback => {
  //       console.log('updateTransaction:', callback);
  //       await maincontroll.resetmoney();
  //       let active = false;
  //       clearInterval(this.timerInterval);
  //       await maincontroll.setcoinaccept(active);
  //       await maincontroll.setbillaccept(active);
  //       const {dismiss} = this.props;
  //       this.dismiss = dismiss;
  //       this.dismiss();
  //     });
  //   } else {
  //     let timeout = this.state.timeoutRefund - 1;
  //     this.setState({timeoutRefund: timeout});
  //   }
  // };

  dismiss = async () => {
    clearInterval(this.timerInterval);
    if (this.state.transactionID !== 0) {
      let active = false;
      let postdata = {
        action: 'cancel',
        payment: {
          coinStack: {C1: 0, C2: 0, C5: 0, C10: 0},
          type: 'Cash',
          moneyInput: {
            coin: this.state.coinInput,
            bill: this.state.billInput,
          },
          amount: this.state.moneyInput,
          changeMoney: this.state.changeMoney,
        },
        transactionID: this.state.transactionID,
      };
      POST.postJson('updateTransaction', postdata, async callback => {
        //let callback = await POST.postJsonAwait('updateTransaction', postdata);
        console.log('updateTransaction:', callback);
        console.log('refund Amount', Number(this.state.inputValue));
        if (Number(this.state.inputValue) > 0) {
          const callbackChange = await maincontroll.givechange(
            Number(this.state.inputValue),
          );
          console.log('dismiss refund', callbackChange);
          await maincontroll.resetmoney();
          if (callbackChange.result) {
            this.closeDismiss();
          } else {
            this.closeDismiss();
          }
        } else {
          this.closeDismiss();
        }
      });
    } else {
      this.closeDismiss();
    }
  };

  closeDismiss = async () => {
    let active = false;
    this.MdbTurnOff();
    await maincontroll.setcoinaccept(active);
    await maincontroll.setbillaccept(active);
    const {dismiss} = this.props;
    this.dismiss = dismiss;
    this.dismiss();
  };

  MdbTurnOff = () => {
    clearInterval(this.timerInterval);
    maincontroll.off('receivemoney');
    // maincontroll.off('dispense');
  };

  render() {
    return (
      <RN.View style={[Styles.body_container]}>
        <RN.View style={Styles.container}>
          {this.state.LoadDispense ? (
            <>
              {this.state.dispenseError ? (
                <RN.View style={Styles.error_container}>
                  <RN.Image
                    source={require('../../../assets/images/vending_error.png')}
                    style={Styles.error_image}
                  />
                  <RN.Text style={Styles.error_text}>
                    เกิดข้อผิดพลาด {this.state.msgError}
                  </RN.Text>
                  <RN.Text style={Styles.error_refund_text}>
                    เครื่องกำลังคืนเงินให้ท่าน ...
                  </RN.Text>
                  <RN.Image
                    source={require('../../../assets/images/change_money.gif')}
                    style={Styles.changeMoney_image}
                  />
                </RN.View>
              ) : (
                <RN.View style={Styles.error_container}>
                  <RN.Image
                    source={require('../../../assets/images/vending_process2.gif')}
                    style={Styles.vending_process_image}
                  />
                  <RN.Text style={Styles.vending_process_text}>
                    เครื่องกำลังจ่ายของให้ท่าน ...
                  </RN.Text>
                  <RN.Image
                    source={require('../../../assets/images/down_gif.gif')}
                    style={Styles.down_iamge}
                  />
                  {this.state.pickupAction && (
                    <BlinkView blinkDuration={400}>
                      <RN.View style={Styles.pickup_container}>
                        <RN.View style={Styles.row}>
                          <Icon2
                            name="hand-holding"
                            size={40}
                            color={'#fff'}
                            style={Styles.icon_pickup}
                          />
                          <RN.Text style={Styles.pickup_text}>
                            {' '}
                            กรุณารับสินค้า
                          </RN.Text>
                        </RN.View>
                      </RN.View>
                    </BlinkView>
                  )}
                </RN.View>
              )}
            </>
          ) : (
            <>
              <RN.View style={[Styles.title_content]}>
                <RN.Text style={Styles.title_text}>
                  กรุณายอดเงินสดตามจำนวน
                </RN.Text>
              </RN.View>
              <RN.View style={Styles.product_price_container}>
                <RN.View style={Styles.price_text_content}>
                  <RN.Text style={Styles.price_text}>
                    ฿{' '}
                    {this.props.product.price.sale > 0
                      ? this.props.product.price.sale
                      : this.props.product.price.normal}
                  </RN.Text>
                </RN.View>
                <RN.View style={Styles.prduct_image_content}>
                  <RN.Image
                    source={{uri: this.props.product.productImage}}
                    style={Styles.product_image}
                  />
                  <RN.Text style={Styles.prduct_name_text}>
                    {this.props.product.productName}
                  </RN.Text>
                </RN.View>
              </RN.View>
              <RN.View style={Styles.input_money_container}>
                <RN.Text style={Styles.input_text}>ยอดได้รับ</RN.Text>
                <RN.View style={Styles.input_money_content}>
                  {this.state.loadTran ? (
                    <BarIndicator color="#021B79" count={5} size={60} />
                  ) : (
                    <RN.Text style={Styles.input_money_text}>
                      {this.state.inputValue}
                    </RN.Text>
                  )}
                </RN.View>
              </RN.View>
              <RN.View style={Styles.money_active_container}>
                <RN.View style={Styles.w100}>
                  <RN.Text style={Styles.money_active_text}>
                    ประเภทเหรียญและธนบัตรที่รับ :
                  </RN.Text>
                </RN.View>
                <RN.Image
                  source={require('../../../assets/images/money_active.png')}
                  style={Styles.money_active_image}
                />
              </RN.View>
              {!this.state.sold_out ? (
                <RN.TouchableOpacity
                  style={Styles.btn_cancel_container}
                  onPress={() => this.dismiss()}>
                  <LinearGradient
                    start={{x: 1, y: 0}}
                    style={Styles.btn_cancel_content}
                    colors={['#93291E', '#ED213A', '#93291E']}>
                    <RN.Text style={Styles.btn_cancel_text}>CANCEL</RN.Text>
                  </LinearGradient>
                </RN.TouchableOpacity>
              ) : (
                <RN.View style={Styles.success_container}>
                  <RN.View style={Styles.success_content}>
                    <RN.Text style={Styles.success_text}>
                      ทำรายการสำเร็จ
                    </RN.Text>
                  </RN.View>
                </RN.View>
              )}
              <RN.View style={Styles.timer_container}>
                <RN.View style={Styles.timer_content}>
                  <Icon name="clock-outline" size={35} color={'#FF4B2B'} />
                  <RN.Text style={Styles.timer_text}>
                    {' '}
                    {this.state.timer}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </>
          )}
        </RN.View>
        {this.state.changeMoneyStatus && (
          <RN.View style={Styles.changeMoney_container}>
            <RN.View>
              <RN.Text style={Styles.changeMoney_text}>
                กรุณารับเงินทอนจำนวน{' '}
                <RN.Text style={Styles.change_color}>
                  {this.state.changeMoney}
                </RN.Text>{' '}
                บาท
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
                  source={require('../../../assets/images/change_money.gif')}
                  style={Styles.changeMoney_image}
                />
              </LinearGradient>
            </RN.View>
          </RN.View>
        )}
      </RN.View>
    );
  }
}
