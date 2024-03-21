/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Signal from '../components/shelf/Signal';
import * as navigate from '../navigator/RootNavigation';
import {Styles} from '../styles/shelf_style';
import Modal from 'react-native-modal';
import {useRecoilState, useSetRecoilState} from 'recoil';
import * as GOLBAL from '../globalState';
import Payment from './payment_dialog_v2';
import StaffMode from '../components/shelf/StaffMode';
import STORE from '../storage';
import Prodshelf from '../components/shelf/Prodshelf';
import Clock from '../components/shelf/Clock';
import ProductRanking from '../components/shelf/ProductRanking';
import ShelfTimeout from '../components/shelf/shelfTimeout';
import BlinkView from '../components/payment/BlinkView';
import G from '../globalVar';
import MemberInput from '../components/shelf/MemberInput';
import MemberSuccess from '../components/shelf/MemberSuccess';
import AdsVideo from '../components/shelf/ads_video';
import * as Progress from 'react-native-progress';

let timeout = 60;
let nextPage = 0;
let onScrollTime;
export default function Shelf() {
  const [category] = React.useState({});
  const [categoryBtn, setCatagoryBtn] = React.useState('all');
  const [payment, setPayment] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [setting, setSetting] = React.useState(false);
  const [prod, setProd] = React.useState();
  const [isRank, setIsRank] = React.useState(false);
  const [onSelect, setOnSelect] = React.useState(false);
  const [isScrollShelf, setIsScrollShelf] = React.useState(false);
  const [PICKPROD, setPICKPROD] = React.useState(false);
  const [memberBox, setMemberBox] = React.useState(false);
  const ScreenWidth = RN.Dimensions.get('window').width;

  const [CHANGE_MONEY] = useRecoilState(GOLBAL.CHANGE_MONEY);
  const [TRAN_SUCCESS] = useRecoilState(GOLBAL.TRAN_SUCCESS);
  const [MEMBER_SUCCESS] = useRecoilState(GOLBAL.MEMBER_SUCCESS);
  const [categoryData] = useRecoilState(GOLBAL.category);
  const [inventory] = useRecoilState(GOLBAL.inventory);
  const [inventoryAll] = useRecoilState(GOLBAL.inventoryAll);
  const isSetInventory = useSetRecoilState(GOLBAL.inventory);
  const [productInsideElevator] = useRecoilState(GOLBAL.productInsideElevator);
  const [temperature] = useRecoilState(GOLBAL.temperature);
  const [adsDownload] = useRecoilState(GOLBAL.adsDownload);
  const [adsDownloadPer] = useRecoilState(GOLBAL.adsDownloadPer);
  const [startDownlaod] = useRecoilState(GOLBAL.startDownlaod);

  React.useEffect(() => {
    runApp();
  }, []);

  const runApp = () => {
    nextPage = 0;
    //setIsRank(true);
    category.ALL = {key: 'ALL', data: []};
    console.log('=====>', categoryData);
    categoryData.map(item => {
      category[item.categoryName] = {
        key: item._id,
        data: [],
      };
      inventoryAll.map(prods => {
        if (item._id === prods.category) {
          category[item.categoryName].data.push(prods);
        }
      });
    });
    timeout = 60;
    console.log('categoryData', categoryData);
    STORE.getItem('TOKEN', response => {
      if (response.result) {
        G.TOKEN = response.data;
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });
  };
  let setSelectTimeout = false;
  const selectCategory = key => {
    console.log('selectCategory');
    let data = [];
    setOnSelect(true);
    clearTimeout(setSelectTimeout);
    if (key === 'all') {
      setCatagoryBtn(key);
      isSetInventory(inventoryAll);
    } else {
      inventoryAll.map(item => {
        if (item.category === key) {
          data.push(item);
        }
      });
      isSetInventory(data);
      setCatagoryBtn(key);
    }
    setSelectTimeout = setTimeout(() => {
      setOnSelect(false);
    }, 100);
  };

  const selectProd = item => {
    // if (productInsideElevator === 'no') {
    //   setProd(item);
    //   setOnSelect(true);
    //   console.log(onSelect);
    //   setPayment(true);
    // } else {
    //   setPICKPROD(true);
    //   setTimeout(() => {
    //     setPICKPROD(false);
    //   }, 3000);
    // }
    setProd(item);
    setOnSelect(true);
    console.log(onSelect);
    setPayment(true);
  };

  const cancalPayment = () => {
    console.log('cancalPayment');
    setOnSelect(false);
    setPayment(false);
    timeout = 60;
  };

  const openSetting = () => {
    setOnSelect(true);
    navigate.navigate('Setting');
  };

  const closeSetting = () => {
    setSetting(false);
  };

  const closeMember = () => {
    setMemberBox(false);
  };

  const closeProductRanking = () => {
    setIsRank(false);
  };

  const timeoutScreenSaver = () => {
    isSetInventory(inventoryAll);
    navigate.navigate('Splash');
  };

  const onScrollShelf = () => {
    console.log('onScrollShelf');
    setIsScrollShelf(true);
    clearTimeout(onScrollTime);
    onScrollTime = setTimeout(() => {
      console.log('LEAK ?');
      setIsScrollShelf(false);
    }, 10000);
  };

  const onClickItemRanking = id => {
    setIsRank(false);
    const pos = inventory.map(e => e.productId).indexOf(id);
    selectProd(inventory[pos]);
  };

  return (
    <RN.View style={Styles.flex}>
      <AdsVideo />
      {startDownlaod && (
        <>
          <RN.Text
            style={{
              fontSize: 18,
              color: 'red',
              fontWeight: 'bold',
              position: 'absolute',
              top: 10,
              left: 10,
              opacity: 0.6,
            }}>
            Download Video {adsDownloadPer}%
          </RN.Text>
        </>
      )}
      <LinearGradient
        style={Styles.topbar_container}
        colors={['#051D72', '#051D72', '#051D72']}>
        <RN.View style={Styles.w30}>
          <RN.View style={Styles.logo_content}>
            <RN.Image
              source={require('../../assets/images/logo2.png')}
              style={Styles.logo_image}
            />
          </RN.View>
        </RN.View>
        <RN.View style={Styles.topbar_content}>
          <RN.TouchableOpacity
            delayLongPress={5000}
            onLongPress={() => {
              openSetting();
            }}
            style={Styles.btn_setting_vending}
            activeOpacity={1}>
            <RN.Image
              source={require('../../assets/images/vending2.png')}
              style={Styles.vending_image}
            />
            <RN.View style={Styles.w90}>
              <RN.Text style={Styles.vending_detail_text}>
                KIOSK : {G.KIOSKID}
              </RN.Text>
              <RN.Text style={Styles.vending_detail_text}>
                Version : {G.VERSION}
              </RN.Text>
              <RN.Text style={Styles.vending_detail_text}>
                Internet :{' '}
                {isConnected ? (
                  <RN.Text style={{color: '#16b524'}}>Connected</RN.Text>
                ) : (
                  <RN.Text style={{color: 'red'}}>Disconnected</RN.Text>
                )}
              </RN.Text>
            </RN.View>
          </RN.TouchableOpacity>
        </RN.View>
        <RN.View style={Styles.clock_content}>
          <Clock temperature={temperature} />
        </RN.View>
        <RN.View style={Styles.signal_content}>
          <Signal />
        </RN.View>
      </LinearGradient>
      <RN.View style={Styles.category_conteiner}>
        <RN.ScrollView style={Styles.scroll_category} horizontal={true}>
          {categoryData.map(item => (
            <RN.TouchableOpacity
              key={item._id}
              style={[
                Styles.btn_category_content,
                {
                  backgroundColor:
                    categoryBtn === item._id ? '#FFC000' : '#E5E5E4',
                },
              ]}
              onPress={() => selectCategory(item._id)}>
              <RN.Text style={Styles.btn_category_text}>
                {item.categoryName}
              </RN.Text>
            </RN.TouchableOpacity>
          ))}
        </RN.ScrollView>
      </RN.View>
      <Prodshelf
        product={inventory}
        selectProd={selectProd}
        onScrollShelf={onScrollShelf}
        isScrollShelf={isScrollShelf}
      />
      <LinearGradient
        style={Styles.footbar_container}
        colors={['#051D72', '#051D72', '#051D72']}>
        {/* <RN.TouchableOpacity style={Styles.btn_topup_content}>
          <RN.Text>Topup Button</RN.Text>
        </RN.TouchableOpacity> */}
        {!onSelect && !isScrollShelf && (
          // <ShelfTimeout onTimeout={timeoutScreenSaver} />
          <></>
        )}
      </LinearGradient>
      <Modal
        isVisible={payment}
        style={{margin: 0, padding: 70}}
        deviceHeight={2000}
        backdropOpacity={0.8}>
        <Payment dismiss={cancalPayment} prod={prod} />
      </Modal>
      <Modal isVisible={CHANGE_MONEY} deviceHeight={2000}>
        <RN.View style={Styles.modal_changemoney}>
          <RN.Image
            source={require('../../assets/images/change_animation.gif')}
            style={Styles.image_changemoney}
          />
          <RN.Text style={Styles.change_text}>กรุณารับเงินถอน 0 บาท</RN.Text>
        </RN.View>
      </Modal>
      <Modal isVisible={TRAN_SUCCESS} deviceHeight={2000}>
        <RN.View style={Styles.modal_changemoney}>
          <RN.Image
            source={require('../../assets/images/mascos_animation.gif')}
            style={Styles.image_changemoney}
          />
        </RN.View>
      </Modal>
      <Modal isVisible={setting} deviceHeight={2000}>
        <StaffMode dismiss={closeSetting} />
      </Modal>
      <Modal isVisible={memberBox} deviceHeight={2000}>
        <MemberInput dismiss={closeMember} />
      </Modal>
      <Modal isVisible={MEMBER_SUCCESS} deviceHeight={2000}>
        <MemberSuccess />
      </Modal>
      <Modal isVisible={isRank} deviceHeight={2000}>
        <ProductRanking
          dismiss={closeProductRanking}
          onClickItemRanking={onClickItemRanking}
        />
      </Modal>
      <Modal
        isVisible={PICKPROD}
        style={{alignItems: 'center'}}
        deviceHeight={2000}>
        <RN.Image
          source={require('../../assets/images/lift_fail.png')}
          style={Styles.image_pickupprod}
        />
        <BlinkView blinkDuration={400}>
          <RN.Text style={Styles.change_text}>
            กรุณาหยิบสินค้าออกจากช่องสินค้า
          </RN.Text>
        </BlinkView>
      </Modal>
    </RN.View>
  );
}
