/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';

export default class Row5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slot: {
        slot41: '#fff',
        slot42: '#fff',
        slot43: '#fff',
        slot44: '#fff',
        slot45: '#fff',
        slot46: '#fff',
        slot47: '#fff',
        slot48: '#fff',
        slot49: '#fff',
        slot50: '#fff',
      },
    };
  }

  changeColor = s => {
    this.state.slot[`slot${s}`] = '#F3F9A7';
    const {activeSlot} = this.props;
    this.activeSlot = activeSlot;
    let slotTemp = this.state.slot;
    this.activeSlot(s, status => {
      console.log('Slot:' + s + ' Status:' + status.result);
      if (status.result) {
        slotTemp[`slot${s}`] = 'green';
      } else {
        slotTemp[`slot${s}`] = 'red';
        console.log(this.state.slot[`slot${s}`]);
      }
      this.setState({slot: slotTemp});
    });
  };

  render() {
    return (
      <RN.View style={{flexDirection: 'row'}}>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(41)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot41,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{41}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(42)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot42,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{42}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(43)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot43,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{43}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(44)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot44,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{44}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(45)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot45,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{45}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(46)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot46,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{46}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(47)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot47,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{47}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(48)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot48,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{48}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(49)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot49,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{49}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(50)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot50,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{50}</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  }
}
