import * as React from 'react';
import * as RN from 'react-native';
import Video from 'react-native-video';
import {Styles} from '../../styles/splash_style';
import {useRecoilState} from 'recoil';
import * as GLOBAL from '../../globalState';

const AdsVideo = () => {
  const [ads] = useRecoilState(GLOBAL.ads);
  const videoError = msg => {
    console.log('MSG Error:', msg);
  };
  const onBuffer = msg => {
    console.log('MSG Buffer', msg);
  };
  console.log('My video:::', ads);
  return (
    <>
      <RN.Image
        source={require('../../../assets/images/logo.png')}
        style={Styles.logo_image2}
      />
      <Video
        source={{uri: ads}}
        repeat={true}
        style={Styles.video_container}
        resizeMode="contain"
        onError={videoError}
        onBuffer={onBuffer}
        controls={false}
        // onEnd={() => {
        //   countVideo++;
        //   playVideo();
        // }}
      />
    </>
  );
};

export default AdsVideo;
