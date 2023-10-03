import * as React from 'react';
import * as RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Styles} from '../../styles/shelf_style';
import moment from 'moment';

let nextPage = 0;
let oldPage = 2980;
let scrollTOStatus = 'down';
let offsetY = 0;
export default class Prodshelf extends React.Component {
  constructor(props) {
    super(props);
    this.refScroll = React.createRef();
    this.state = {
      scrollViewHeight: 0,
      nextPage: 0,
      selectProduct: false,
      contentHeight: 0,
    };
  }

  startAutoPlay = () => {
    clearInterval(this.activeIntervalUp);
    if (!this.props.isScrollShelf) {
      oldPage = 2980;
      if (this.refScroll.current) {
        this.refScroll.current.scrollToOffset({
          animated: true,
          offset: 0 + nextPage,
        });
        nextPage = nextPage + 10;
        if (nextPage + 100 >= 2980) {
          clearInterval(this.activeIntervalDown);
          setTimeout(() => {
            nextPage = 0;
            scrollTOStatus = 'up';
            this.activeIntervalUp = setInterval(this.endAutoPlay, 100);
          }, 5000);
        }
      }
    }
  };

  endAutoPlay = () => {
    clearInterval(this.activeIntervalDown);
    if (!this.props.isScrollShelf) {
      nextPage = 0;
      if (this.refScroll.current) {
        this.refScroll.current.scrollToOffset({
          animated: true,
          offset: oldPage - 10,
        });
        oldPage = oldPage - 10;
        if (oldPage <= 0) {
          clearInterval(this.activeIntervalUp);
          setTimeout(() => {
            oldPage = 2980;
            scrollTOStatus = 'down';
            this.activeIntervalDown = setInterval(this.startAutoPlay, 100);
          }, 5000);
        }
      }
    }
  };

  checkStock = (remain, capacity) => {
    let stock = (remain * 100) / capacity;
    if (stock > 50) {
      return '#2B32B2';
    } else if (stock < 50) {
      return '#e65c00';
    } else if (stock < 20) {
      return '#ED213A';
    }
  };

  checkExp = exp => {
    let expDate = exp - Number(moment().unix());
    expDate = expDate / 3600;
    expDate = expDate / 24;
    expDate = (expDate / 5) * 100;
    if (expDate > 50) {
      return 'rgba(88, 204, 12, 0.8)';
    } else if (expDate < 50) {
      return 'rgba(255, 187, 40, 0.8)';
    } else if (expDate < 20) {
      return 'rgba(255, 36, 0, 0.8)';
    }
  };

  onSelectProd = item => {
    clearInterval(this.activeInterval);
    this.setState({selectProduct: true});
    const {selectProd} = this.props;
    this.selectProd = selectProd;
    this.selectProd(item);
  };

  renderItem = ({item}) => (
    <RN.TouchableOpacity
      activeOpacity={1}
      style={Styles.btn_product_container}
      onPress={() => {
        this.onSelectProd(item);
      }}>
      {item.productImage != 'https://noimageurl' ? (
        <RN.Image
          source={{uri: item.productImage}}
          style={Styles.product_image}
        />
      ) : (
        <RN.Image
          source={require('../../../assets/images/box.png')}
          style={Styles.product_image_not_found}
        />
      )}
      {item.price.sale > 0 && (
        <>
          <RN.Image
            source={require('../../../assets/images/sale_ribbon.png')}
            style={Styles.product_image_ribbon}
          />
          <RN.Text style={Styles.product_text_ribbon}>SALE</RN.Text>
        </>
      )}
      <RN.Text
        style={{
          fontSize: 18,
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: this.checkExp(item.expireDate),
          padding: 5,
          borderRadius: 5,
        }}>
        {item.expireMsg}
      </RN.Text>
      <RN.ProgressBarAndroid
        styleAttr="Horizontal"
        animating={true}
        color={this.checkStock(item.allremain, item.allcapacity)}
        indeterminate={false}
        progress={item.allremain / item.allcapacity}
        style={{width: 120, marginTop: 10}}
      />
      <RN.Text
        style={{
          fontSize: 18,
          textAlign: 'center',
          fontWeight: 'bold',
          color: this.checkStock(item.allremain, item.allcapacity),
        }}>
        คงเหลือ: {item.allremain} / {item.allcapacity}
      </RN.Text>
      <RN.View style={Styles.product_name_content}>
        <RN.Text style={Styles.product_name}>{item.productName}</RN.Text>
      </RN.View>
      {item.price.sale > 0 ? (
        <LinearGradient
          colors={['#dd1818', '#ED213A', '#dd1818']}
          style={Styles.product_promotion_content}>
          <RN.Text style={Styles.product_old}>{item.price.normal} ฿</RN.Text>
          <RN.Text style={Styles.product_promotion}>
            {item.price.sale} ฿
          </RN.Text>
        </LinearGradient>
      ) : (
        <RN.View style={Styles.product_price_content}>
          <RN.Text style={Styles.product_price}>{item.price.normal} ฿</RN.Text>
        </RN.View>
      )}
    </RN.TouchableOpacity>
  );

  handleTouchStart = () => {
    console.log('TOUCH', offsetY);
    clearInterval(this.activeIntervalUp);
    clearInterval(this.activeIntervalDown);
    const {onScrollShelf} = this.props;
    this.onScrollShelf = onScrollShelf;
    this.onScrollShelf();
  };

  handleScroll = e => {
    offsetY = e.nativeEvent.contentOffset.y;
  };

  render() {
    return (
      <RN.FlatList
        onTouchStart={() => this.handleTouchStart()}
        onScroll={e => this.handleScroll(e)}
        ref={this.refScroll}
        automaticallyAdjustContentInsets={true}
        style={Styles.m5}
        numColumns={3}
        data={this.props.product ? this.props.product : []}
        renderItem={item => this.renderItem(item)}
      />
    );
  }
}
