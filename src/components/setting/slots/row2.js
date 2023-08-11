/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';

export default class Row2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slot: {
        slot11: '#fff',
        slot12: '#fff',
        slot13: '#fff',
        slot14: '#fff',
        slot15: '#fff',
        slot16: '#fff',
        slot17: '#fff',
        slot18: '#fff',
        slot19: '#fff',
        slot20: '#fff',
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
          onPress={() => this.changeColor(11)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot11,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{11}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(12)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot12,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{12}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(13)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot13,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{13}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(14)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot14,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{14}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(15)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot15,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{15}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(16)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot16,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{16}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(17)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot17,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{17}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(18)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot18,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{18}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(19)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot19,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{19}</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          disabled={this.props.action}
          onPress={() => this.changeColor(20)}
          style={{
            width: 90,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.state.slot.slot20,
            borderRadius: 5,
            margin: 5,
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: {width: 2, height: 0},
            shadowRadius: 10,
            elevation: 3,
          }}>
          <RN.Text style={{color: '#000'}}>{20}</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  }
}
