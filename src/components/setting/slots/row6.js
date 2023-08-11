/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';

export default class Row6 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slot: {
        slot51: '#fff',
        slot52: '#fff',
        slot53: '#fff',
        slot54: '#fff',
        slot55: '#fff',
        slot56: '#fff',
        slot57: '#fff',
        slot58: '#fff',
        slot59: '#fff',
        slot60: '#fff',
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
          onPress={() => this.changeColor(51)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot51,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{51}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(52)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot52,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{52}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(53)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot53,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{53}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(54)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot54,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{54}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(55)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot55,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{55}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(56)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot56,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{56}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(57)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot57,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{57}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(58)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot58,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{58}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(59)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot59,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{59}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(60)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot60,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{60}</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  }
}
