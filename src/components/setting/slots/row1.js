/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import * as RN from 'react-native';
import {Styles} from '../../styles/setting_style';

export default class Row1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slot: {
        slot1: '#fff',
        slot2: '#fff',
        slot3: '#fff',
        slot4: '#fff',
        slot5: '#fff',
        slot6: '#fff',
        slot7: '#fff',
        slot8: '#fff',
        slot9: '#fff',
        slot10: '#fff',
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
        {!this.state.reloadData && (
          <>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(1)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot1,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{1}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.state.action}
              onPress={() => this.changeColor(2)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot2,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{2}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(3)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot3,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{3}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(4)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot4,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{4}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(5)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot5,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{5}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(6)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot6,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{6}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(7)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot7,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{7}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(8)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot8,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{8}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(9)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot9,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{9}</RN.Text>
            </RN.TouchableOpacity>
            <RN.TouchableOpacity
              disabled={this.props.action}
              onPress={() => this.changeColor(10)}
              style={{
                width: 90,
                padding: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: this.state.slot.slot10,
                borderRadius: 5,
                margin: 5,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowOffset: {width: 2, height: 0},
                shadowRadius: 10,
                elevation: 3,
              }}>
              <RN.Text style={{color: '#000'}}>{10}</RN.Text>
            </RN.TouchableOpacity>
          </>
        )}
      </RN.View>
    );
  }
}
