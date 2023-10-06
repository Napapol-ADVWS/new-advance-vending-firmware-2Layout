import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Styles} from '../../styles/staffmode_style';

const MemberSuccess = () => {
  return (
    <RN.View style={Styles.flex}>
      <RN.Image
        source={require('../../../assets/images/rank_bg.png')}
        style={Styles.bg_success_image}
      />
      <LinearGradient
        style={Styles.container2}
        colors={['#021B79', '#2B32B2', '#021B79']}>
        <RN.View style={Styles.star_success_image_container}>
          <RN.Image
            source={require('../../../assets/images/star.png')}
            style={Styles.star_success_image}
          />
        </RN.View>
        <RN.Text style={Styles.congrat_text}>ยินดีด้วย !</RN.Text>
        <RN.Text style={Styles.point_text}>
          คุณได้รับ <RN.Text style={Styles.gold_color}>0</RN.Text> Point
        </RN.Text>
        <RN.Text style={Styles.discripton_text}>
          Point ที่ได้รับจะถูกจัดเก็บไว้ที่เบอร์โทรศัพท์ของคุณ
        </RN.Text>
      </LinearGradient>
    </RN.View>
  );
};

export default MemberSuccess;
