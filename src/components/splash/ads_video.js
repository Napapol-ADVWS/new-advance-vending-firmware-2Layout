import * as React from 'react';
import * as RN from 'react-native';
import Video from 'react-native-video';
import {Styles} from '../../styles/splash_style';

const AdsVideo = () => {
  const videoError = msg => {
    console.log('MSG Error:', msg);
  };
  const onBuffer = msg => {
    console.log('MSG Buffer', msg);
  };
  return (
    <>
      <RN.Image
        source={require('../../../assets/images/logo.png')}
        style={Styles.logo_image2}
      />
      <Video
        source={{
          uri: 'https://storage.googleapis.com/video-vending/YL_VDO_MBK_2.mp4',
        }}
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
