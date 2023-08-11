/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';

export default class Row3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slot: {
        slot21: '#fff',
        slot22: '#fff',
        slot23: '#fff',
        slot24: '#fff',
        slot25: '#fff',
        slot26: '#fff',
        slot27: '#fff',
        slot28: '#fff',
        slot29: '#fff',
        slot30: '#fff',
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
          onPress={() => this.changeColor(21)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot21,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{21}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(22)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot22,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{22}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(23)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot23,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{23}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(24)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot24,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{24}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(25)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot25,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{25}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(26)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot26,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{26}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(27)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot27,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{27}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(28)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot28,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{28}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(29)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot29,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{29}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(30)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot30,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{30}</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  }
}
