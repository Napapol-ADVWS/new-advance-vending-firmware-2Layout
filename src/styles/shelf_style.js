import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topbar_container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    backgroundColor: '#021B79',
  },
  logo_content: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
  },
  logo_image: {
    resizeMode: 'contain',
    width: 170,
    height: 170,
  },
  topbar_content: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_setting_vending: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'flex-start',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 10,
    elevation: 3,
    flexDirection: 'row',
  },
  vending_image: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  vending_detail_text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clock_content: {
    width: '25%',
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  clock: {
    color: '#021B79',
    fontWeight: 'bold',
    fontSize: 26,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
  },
  signal_content: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_topup_container: {
    width: '100%',
    height: 120,
    alignItems: 'flex-end',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
  },
  btn_topup_content: {
    width: '60%',
    height: 70,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  video_ads: {
    width: '100%',
    height: 720,
    backgroundColor: '#ddd',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_product_container: {
    width: '33%',
    margin: '0.18%',
    height: 450,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  product_image: {
    resizeMode: 'contain',
    width: 220,
    height: 220,
    backgroundColor: 'transparent',
  },
  product_image_ribbon: {
    resizeMode: 'contain',
    width: 150,
    height: 150,
    position: 'absolute',
    top: 0,
    left: 15,
  },
  product_text_ribbon: {
    fontSize: 24,
    textAlign: 'center',
    position: 'absolute',
    top: 23,
    left: 25,
    color: '#FFD700',
    fontWeight: 'bold',
    transform: [{rotate: '-45deg'}],
  },
  product_name_content: {
    width: '100%',
    height: 65,
    marginTop: 10,
  },
  product_name: {
    fontSize: 24,
    textAlign: 'center',
  },
  product_price_content: {
    backgroundColor: '#2B32B2',
    width: 165,
    padding: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 10,
    marginTop: 0,
  },
  product_price: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#2B32B2',
    marginLeft: 10,
    marginRight: 10,
  },
  product_promotion_content: {
    backgroundColor: '#2B32B2',
    padding: 5,
    width: 165,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 10,
    marginTop: 0,
  },
  product_promotion: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  product_old: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#fff',
    color: '#5f5f5f',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    position: 'absolute',
    padding: 5,
    top: -25,
    left: -40,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
    textDecorationLine: 'line-through',
  },
  footbar_container: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  category_conteiner: {
    width: '100%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 5,
    flexDirection: 'row',
    borderBottomColor: '#ddd',
    borderBottomWidth: 3,
    borderLeftColor: '#ddd',
    borderLeftWidth: 3,
    borderRightColor: '#ddd',
    borderRightWidth: 3,
    marginBottom: 10,
  },
  btn_category_content: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
    margin: 10,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
  },
  btn_category_text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scroll_category: {
    width: '70%',
    flexDirection: 'row',
    padding: 20,
  },
  modal_changemoney: {
    width: '100%',
    alignItems: 'center',
  },
  image_changemoney: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
  image_pickupprod: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
  change_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 32,
  },
  image_can: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
    bottom: 80,
  },
  btn_cancel_container: {
    marginTop: '3%',
    marginBottom: '2%',
    alignItems: 'center',
  },
  btn_cancel_content: {
    width: 300,
    height: 100,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  btn_cancel_icon: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  btn_cancel_text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#B38728',
    backgroundColor: 'rgba(255,255,255,0.6)',
    width: 250,
    height: 70,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  container_product_rank: {
    width: '100%',
    alignItems: 'center',
  },
  content_product_rank: {
    width: '100%',
    flexDirection: 'row',
  },
  container_rank1: {
    width: '20%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%',
  },
  content_rank1: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
  },
  product_image_rank1: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  rank1_image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  container_rank2: {
    width: '15%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: '20%',
  },
  content_rank2: {
    width: 170,
    height: 170,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
  },
  product_image_rank2: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  rank2_image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  container_rank3: {
    width: '15%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: '20%',
  },
  content_rank3: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
  },
  product_image_rank3: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  rank3_image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  rank_title_iamge: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  rank_title_container: {
    width: '100%',
    alignItems: 'center',
    bottom: 90,
  },
  rank_title_text: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop: 30,
  },
  rank_btn_iamge: {
    width: '100%',
    height: 152,
    resizeMode: 'contain',
    transform: [{rotate: '180deg'}],
  },
  rank_btn_container: {
    width: '100%',
    alignItems: 'center',
  },
  m5: {margin: 5},
  w20: {width: '20%'},
  w30: {width: '30%'},
  w90: {width: '90%'},
  w100: {width: '100%'},
  timer_container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 0,
  },
  timer_content: {
    width: '22%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 10,
    elevation: 3,
  },
  timer_text: {
    fontSize: 25,
    color: '#FF4B2B',
    fontWeight: 'bold',
  },
  blockBackdrop: {
    width: '120%',
    height: '3%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    right: 70,
    bottom: -200.5,
  },
  product_image_not_found: {
    resizeMode: 'contain',
    width: 220,
    height: 220,
    backgroundColor: 'transparent',
    tintColor: '#ddd',
  },
});
