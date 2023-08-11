/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';

export default class Row4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slot: {
        slot31: '#fff',
        slot32: '#fff',
        slot33: '#fff',
        slot34: '#fff',
        slot35: '#fff',
        slot36: '#fff',
        slot37: '#fff',
        slot38: '#fff',
        slot39: '#fff',
        slot40: '#fff',
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
          onPress={() => this.changeColor(31)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot31,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{31}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(32)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot32,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{32}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(33)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot33,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{33}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(34)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot34,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{34}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(35)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot35,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{35}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(36)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot36,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{36}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(37)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot37,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{37}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(38)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot38,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{38}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(39)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot39,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{39}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(40)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot40,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{40}</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  }
}
