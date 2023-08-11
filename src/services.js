import * as GLOBAL from './globalState';
import {useSetRecoilState, useRecoilState} from 'recoil';

const OnService = () => {
  const [OWNERID] = useRecoilState(GLOBAL.OWNER);
  console.log('TERST:::::', OWNERID);
};

export default {
  OnService,
};
