import * as React from 'react';
import * as RN from 'react-native';
import moment from 'moment';
import {Styles} from '../../styles/shelf_style';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.startClock();
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.timerInterval);
  }

  startClock = () => {
    this.timerInterval = setInterval(this.setClock, 1000);
  };

  setClock = () => {
    var current = moment().format('HH:mm');
    this.setState({time: current});
  };

  render() {
    return (
      <RN.Text style={Styles.clock}>
        <Icon name="clock-o" size={26} /> {this.state.time} |{' '}
        <Icon name="snowflake-o" size={26} /> {this.props.temperature} ํC
      </RN.Text>
    );
  }
}
