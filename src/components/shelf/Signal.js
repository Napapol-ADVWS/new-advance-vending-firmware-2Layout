/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/signal_style';
import {useRecoilState} from 'recoil';
import * as GOLBAL from '../../globalState';
import images from '../../../assets/images';

const signalDisplay = () => {
  const [signal] = useRecoilState(GOLBAL.signals);
  const [signalImage, setSignalImage] = React.useState([
    {image: images.lv0, seq: 0},
    {image: images.lv1, seq: 1},
    {image: images.lv2, seq: 2},
    {image: images.lv3, seq: 3},
    {image: images.lv4, seq: 4},
  ]);

  return (
    <RN.View style={Styles.signal_content}>
      <RN.Image
        source={signalImage[signal].image}
        style={Styles.signal_image}
      />
    </RN.View>
  );
};

export default signalDisplay;
