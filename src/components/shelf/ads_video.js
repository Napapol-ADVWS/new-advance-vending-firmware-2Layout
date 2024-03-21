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
  return (
    <>
      {!ads ? (
        <Video
          source={require('../../../assets/video/vending_video.mp4')}
          repeat={true}
          style={{width: '100%', height: '45%', marginTop: '-12%'}}
          resizeMode="contain"
          onError={videoError}
          onBuffer={onBuffer}
          controls={false}
          // onEnd={() => {
          //   countVideo++;
          //   playVideo();
          // }}
        />
      ) : (
        <Video
          source={{uri: ads}}
          repeat={true}
          style={{width: '100%', height: '45%', marginTop: '-12%'}}
          resizeMode="contain"
          onError={videoError}
          onBuffer={onBuffer}
          controls={false}
          // onEnd={() => {
          //   countVideo++;
          //   playVideo();
          // }}
        />
      )}
    </>
  );
};

export default AdsVideo;
