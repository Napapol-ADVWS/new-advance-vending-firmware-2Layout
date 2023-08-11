import * as React from 'react';
import * as RN from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import POST from '../../protocol';
import STORE from '../../storage';
import * as navigate from '../../navigator/RootNavigation';

const InputServiceMode = ({login}) => {
  const [numInput, setNumInput] = React.useState('');
  const [numInputSecurity, setNumInputSecurity] = React.useState('');
  const [textError, setTextError] = React.useState(false);

  const inputPassword = num => {
    if (numInput.length < 6) {
      var textInput = numInput;
      var securityText = numInputSecurity;
      textInput += String(num);
      securityText += '*';
      setNumInput(textInput);
      setNumInputSecurity(securityText);
    }
  };

  const onEnter = () => {
    setTextError(false);
    STORE.getItem('TOKEN', response => {
      if (response.result) {
        POST.postJson('loginServiceMode', {pin: String(numInput)}, res => {
          console.log(res);
          if (res.result) {
            login();
          } else {
            setTextError(true);
          }
        });
      } else {
        if (String(numInput) === '000000') {
          login();
        } else {
          setTextError(true);
        }
      }
    });
  };

  return (
    <RN.View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <RN.TouchableOpacity
        onPress={() => {
          navigate.navigate('Splash');
        }}
        style={{
          width: 100,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 20,
          backgroundColor: '#fff',
          borderRadius: 50,
          position: 'absolute',
          top: 20,
          right: 20,
        }}>
        <Icon2 name="exit-to-app" size={60} />
      </RN.TouchableOpacity>
      <RN.Text
        style={{
          fontSize: 50,
          fontWeight: 'bold',
          marginBottom: '5%',
        }}>
        ระบุรหัส PIN
      </RN.Text>
      <RN.Text
        style={{
          fontSize: 50,
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '5%',
        }}>
        {numInputSecurity}
      </RN.Text>
      <RN.View style={{flexDirection: 'row'}}>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(1);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>1</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(2);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>2</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(3);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>3</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View style={{flexDirection: 'row'}}>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(4);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>4</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(5);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>5</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(6);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>6</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View style={{flexDirection: 'row'}}>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(7);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>7</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(8);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>8</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(9);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>9</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View style={{flexDirection: 'row'}}>
        <RN.View
          style={{
            width: 100,
            height: 100,
            margin: 20,
          }}
        />
        <RN.TouchableOpacity
          onPress={() => {
            inputPassword(0);
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <RN.Text style={{fontSize: 45}}>0</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => {
            setNumInput('');
            setNumInputSecurity('');
          }}
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
            borderRadius: 50,
            borderWidth: 5,
            borderColor: '#fff',
          }}>
          <RN.Text style={{fontSize: 45, fontWeight: 'bold', color: '#fff'}}>
            C
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.TouchableOpacity
        onPress={() => onEnter()}
        style={{
          width: 450,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 20,
          borderColor: '#fff',
          backgroundColor: '#fff',
          borderWidth: 5,
          borderRadius: 50,
        }}>
        <RN.Text style={{fontSize: 45}}>
          <Icon name="unlock" size={40} />
        </RN.Text>
      </RN.TouchableOpacity>
      <RN.Text style={{fontSize: 24, color: 'red', fontWeight: 'bold'}}>
        {textError ? 'รหัส PIN ไม่ถูกต้อง' : ''}
      </RN.Text>
    </RN.View>
  );
};

export default InputServiceMode;
