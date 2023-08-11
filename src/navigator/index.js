import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {navigationRef} from './RootNavigation';

import Splash from '../layouts/splash_fragment';
import Shelf from '../layouts/shelf_fragment';
import Setting from '../layouts/setting_fragment';
import CashPaymentScreen from '../layouts/cash_payment_fragment';
import StartScreen from '../layouts/start_fragment';

const Stack = createNativeStackNavigator();

function AllNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Shelf" component={Shelf} />
        <Stack.Screen name="Setting" component={Setting} />
        {/* <Stack.Screen name="Cash" component={CashPaymentScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AllNavigator;
