/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/qrtype_style';
import {useRecoilState} from 'recoil';
import * as GOLBAL from '../../globalState';

const PaymentButton = ({selectQrType, onSelectCash, product}) => {
  const [paymentMethod] = useRecoilState(GOLBAL.payment_method);
  const [cashStatus] = useRecoilState(GOLBAL.cash_method);
  const [qrMethod, setQrMethod] = React.useState([]);

  console.log(paymentMethod);

  React.useEffect(() => {
    let methods = [
      {
        _id: 0,
        active: cashStatus ? false : true,
        logo_image: cashStatus
          ? require('../../../assets/images/money_th_icon.png')
          : require('../../../assets/images/money_th_icon_disable.png'),
        name: 'เงินสด',
        type: 'Cash',
        color: '#fff',
      },
    ];
    paymentMethod.map(item => {
      console.log(item.name, item.active);
      if (item.type === 'qr' && item.active === 1) {
        console.log(methods.map(e => e.type).indexOf(item.type));
        if (methods.map(e => e.type).indexOf(item.type) === -1) {
          let obj = {
            _id: item._id,
            active: false,
            logo_image: require('../../../assets/images/thaiqr_logo.png'),
            name: item.name,
            type: item.type,
            color: '#1b3463',
          };
          methods.push(obj);
        }
      } else if (item.type === 'card' && item.active === 1) {
        let obj = {
          _id: item._id,
          active: false,
          logo_image: require('../../../assets/images/visa_logo.png'),
          name: 'Credit Card',
          type: item.type,
          color: '#fff',
        };
        methods.push(obj);
      } else if (item.type == 'e-member') {
        let obj = {
          _id: item._id,
          active: false,
          logo_image: require('../../../assets/images/e_member_point.png'),
          name: 'Member Point',
          type: item.type,
          color: '#fff',
        };
        methods.push(obj);
      } else if (item.type === 'other' && item.active === 1) {
        methods.push(item);
      } else if (item.type == 'true' && item.active == 1) {
        let obj = {
          _id: item._id,
          active: false,
          logo_image: require('../../../assets/images/true_wallet_logo.png'),
          name: 'True Wallet',
          type: item.type,
          color: '#fff',
        };
        methods.push(obj)
      }
    });
    setQrMethod(methods);
    console.log('setQrMethod', qrMethod);
  }, []);

  const renderItem = ({item}) => (
    <>
      <RN.TouchableOpacity
        disabled={item.active}
        style={[Styles.btn_qr_type, {backgroundColor: item.color}]}
        onPress={() =>
          item.type == 'Cash' ? onSelectCash() : onSelectType(item)
        }>
        <RN.Image style={Styles.image_qr_type} source={item.logo_image} />
        <RN.Text style={Styles.payment_button_text}>{item.name}</RN.Text>
      </RN.TouchableOpacity>
    </>
  );

  const onSelectType = item => {
    selectQrType(item);
  };

  return (
    <RN.View style={Styles.container}>
      <RN.View style={Styles.content}>
        <RN.FlatList
          columnWrapperStyle={Styles.flex_start}
          numColumns={3}
          data={qrMethod}
          renderItem={item => renderItem(item)}
        />
      </RN.View>
    </RN.View>
  );
};

export default PaymentButton;
