import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  body_container: {
    width: '100%',
    alignItems: 'center',
  },
  bg_container: {
    width: 950,
    height: 950,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    alignItems: 'center',
    marginTop: '3%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 10,
    elevation: 3,
    marginBottom: '3%',
  },
  image_payment: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title_content: {
    width: '100%',
    alignItems: 'center',
    marginTop: '5%',
  },
  title_text: {
    color: '#021B79',
    fontSize: 30,
    fontFamily: 'Kanit-SemiBold',
  },
  vending_process_text: {
    color: '#021B79',
    // fontWeight: 'bold',
    fontSize: 24,
    marginBottom: '10%',
    fontFamily: 'Kanit-SemiBold',
  },
  vending_error_text: {
    color: 'red',
    // fontWeight: 'bold',
    fontFamily: 'Kanit-SemiBold',
    fontSize: 24,
    marginBottom: '10%',
    textAlign: 'center',
    top: 30,
  },
  pickup_container: {
    width: '50%',
    padding: 16,
    borderRadius: 10,
    borderColor: '#FF416C',
    backgroundColor: '#ED213A',
    borderWidth: 3,
    marginTop: 50,
    alignItems: 'center',
  },
  pickup_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
  },
  icon_pickup: {
    bottom: 13,
    marginRight: 5,
  },
  error_text: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 26,
    marginTop: 50,
    textAlign: 'center',
  },
  error_refund_text: {
    color: '#5f5f5f',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  prduct_image_content: {
    width: '90%',
    alignItems: 'center',
  },
  product_image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  prduct_name_text: {
    color: '#000',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  product_price_container: {
    width: '40%',
    flexDirection: 'row',
    marginTop: '5%',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 10,
    elevation: 3,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  price_text_content: {
    width: '40%',
    alignItems: 'center',
    left: -40,
    marginTop: 20,
    position: 'absolute',
  },
  price_text: {
    marginTop: '20%',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    backgroundColor: '#0cdfa0',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 10,
    elevation: 3,
  },
  initPrice_text_content: {
    width: '40%',
    alignItems: 'center',
  },
  initPrice_text: {
    fontSize: 24,
    fontWeight: '700',
  },
  input_money_container: {
    width: '50%',
    alignItems: 'center',
    marginTop: '3%',
  },
  input_text: {
    color: '#000',
    // fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Kanit-SemiBold',
  },
  cancel_text: {
    color: '#9e9e9e',
    // fontWeight: 'bold',
    fontFamily: 'Kanit-SemiBold',
    fontSize: 16,
    bottom: 40,
  },
  input_money_content: {
    width: 250,
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 10,
    elevation: 3,
  },
  input_money_text: {
    color: '#021B79',
    // fontWeight: 'bold',
    fontFamily: 'Kanit-SemiBold',
    fontSize: 70,
  },
  btn_cancel_container: {
    width: '50%',
    backgroundColor: 'red',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
    marginTop: '2%',
    marginBottom: '2%',
  },
  btn_cancel_content: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
  btn_cancel_text: {
    textAlign: 'center',
    color: '#fff',
    // fontWeight: 'bold',
    fontFamily: 'Kanit-SemiBold',
    fontSize: 24,
  },
  success_container: {
    width: '50%',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 7},
    shadowRadius: 10,
    elevation: 3,
    marginTop: '2%',
    marginBottom: '2%',
  },
  success_content: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderColor: '#52c234',
    borderWidth: 5,
  },
  success_text: {
    textAlign: 'center',
    color: '#52c234',
    fontWeight: 'bold',
    fontSize: 24,
  },
  money_active_container: {
    width: '70%',
    alignItems: 'center',
    marginTop: '5%',
  },
  money_active_image: {
    width: 600,
    height: 120,
    resizeMode: 'contain',
  },
  money_active_text: {
    color: '#000',
    fontSize: 22,
    fontFamily: 'Kanit-SemiBold',
  },
  timer_container: {
    width: '100%',
    alignItems: 'center',
  },
  timer_content: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
  },
  timer_text: {
    fontSize: 25,
    color: '#FF4B2B',
    fontWeight: 'bold',
  },
  changeMoney_container: {
    width: '80%',
    height: '10%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  changeMoney_text: {
    fontSize: 26,
    // fontWeight: 'bold',
    fontFamily: 'Kanit-SemiBold',
    color: '#021B79',
    textAlign: 'center',
  },
  changeMoney_process_text: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'Kanit-SemiBold',
    color: '#8f8f8f',
    textAlign: 'center',
  },
  changeMoney_image_container: {
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 10,
    elevation: 3,
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginTop: -25,
  },
  changeMoney_image_content: {
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 10,
    elevation: 3,
    width: 80,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  changeMoney_image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  change_color: {color: '#f12711'},
  error_container: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error_image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginTop: '40%',
  },
  vending_process_image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    top: 80,
  },
  vending_error_image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    top: 80,
  },
  down_iamge: {
    width: 100,
    height: 100,
    marginTop: '60%',
    resizeMode: 'contain',
    right: 100,
  },
  vending_status_container: {
    width: '100%',
    marginTop: 50,
  },
  vending_status_text: {
    fontSize: 18,
    color: '#8f8f8f',
    // fontWeight: 'bold',
    fontFamily: 'Kanit-SemiBold',
    marginLeft: '5%',
  },
  w100: {width: '100%'},
  row: {flexDirection: 'row'},
});
