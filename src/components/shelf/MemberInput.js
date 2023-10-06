import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as navigate from '../../navigator/RootNavigation';

import {Styles} from '../../styles/staffmode_style';
import storage from '../../storage';

const MemberInput = ({dismiss}) => {
  const [mobileno, setMobileNo] = React.useState('');
  const [numpad] = React.useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [msgError, setMsgError] = React.useState(false);

  const renderItem = ({item}) => (
    <RN.TouchableOpacity
      onPress={() => inputPassword(item)}
      style={Styles.btn_numpad}>
      <RN.Text style={Styles.btn_numpad_text}>{item}</RN.Text>
    </RN.TouchableOpacity>
  );

  const inputPassword = num => {
    if (mobileno.length < 10) {
      var str = mobileno;
      str += num;
      setMobileNo(str);
    }
  };

  const onEnter = () => {
    setMsgError(false);
    storage.getItem('PIN', res => {
      if (res.result) {
        if (res.data === mobileno) {
          dismiss();
          navigate.navigate('Setting');
        }
      } else {
        setMsgError(true);
      }
    });
  };

  return (
    <RN.View style={Styles.flex}>
      <LinearGradient
        style={Styles.container}
        colors={['#fff', '#E0EAFC', '#fff']}>
        <RN.View style={Styles.star_image_container}>
          <RN.Image
            source={require('../../../assets/images/star.png')}
            style={Styles.star_image}
          />
        </RN.View>
        <RN.View style={Styles.close_container}>
          <RN.TouchableOpacity onPress={() => dismiss()}>
            <Icon name="close" size={50} color={'#8f8f8f'} />
          </RN.TouchableOpacity>
        </RN.View>
        <RN.Text style={Styles.title_point_text}>ได้รับ 0 Point</RN.Text>
        <RN.Text style={Styles.title_text}>กรุณาระบุเบอร์โทรศัพท์</RN.Text>
        <RN.Text>ระบุเบอร์โทรศัพท์สำหรับสะสมแต้มสมาชิก</RN.Text>
        <RN.View style={Styles.inputBox_container}>
          <RN.View style={Styles.inputBox}>
            <RN.Text style={Styles.password_text}>{mobileno}</RN.Text>
          </RN.View>
          <RN.TouchableOpacity
            style={Styles.w15}
            onPress={() => setMobileNo('')}>
            <LinearGradient
              style={Styles.btn_clear}
              colors={['#021B79', '#2B32B2', '#021B79']}>
              <RN.Text style={Styles.btn_clear_text}>C</RN.Text>
            </LinearGradient>
          </RN.TouchableOpacity>
        </RN.View>
        <RN.View style={Styles.w100}>
          <RN.FlatList
            style={Styles.numpad_container}
            numColumns={3}
            data={numpad}
            renderItem={item => renderItem(item)}
          />
          <RN.View style={Styles.zero_container}>
            <RN.TouchableOpacity
              onPress={() => inputPassword(0)}
              style={[Styles.btn_numpad]}>
              <RN.Text style={Styles.btn_numpad_text}>0</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
        <RN.TouchableOpacity style={Styles.w100} onPress={() => onEnter()}>
          <LinearGradient
            style={Styles.btn_enter_content}
            colors={['#021B79', '#2B32B2', '#021B79']}>
            <RN.Text style={Styles.btn_enter_text}>ENTER</RN.Text>
          </LinearGradient>
        </RN.TouchableOpacity>
      </LinearGradient>
    </RN.View>
  );
};

export default MemberInput;
