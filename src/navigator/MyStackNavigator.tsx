import { useContext, useEffect } from 'react';

import SplashScreen from 'react-native-splash-screen'
import { createStackNavigator } from '@react-navigation/stack';

import { AuthContext } from '../context/AuthContext';

import { LoginScreen } from '../screen/LoginScreen';
import { RegisterScreen } from '../screen/RegisterScreen';
import { ProtectedScreen } from '../screen/ProtectedScreen';
import { LoadingScreen } from '../screen/LoadingScreen';
import { ProductsNavigator } from './ProductsNavigator';


const Stack = createStackNavigator();

export const MyStackNavigator = () => {

  const { status } = useContext(AuthContext)

  useEffect(() => {
    SplashScreen.hide();
  }, [])
  
  if (status === 'checking') return <LoadingScreen />

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>

      {
        (status !== 'authenticated')
          ? (
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </>
          )
          : (
            <>
              <Stack.Screen name="ProductsNavigator" component={ProductsNavigator} />
              <Stack.Screen name="ProtectedScreen" component={ProtectedScreen} />
            </>
          )
      }

    </Stack.Navigator>
  );
};
