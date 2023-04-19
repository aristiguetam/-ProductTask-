import { useContext, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';

import { AuthContext } from '../context/AuthContext';

// import SplashScreen from 'react-native-splash-screen'
import { StackScreenProps } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { loginStyles } from '../theme/loginTheme';
import { useForm } from '../hooks/useForm';

interface Props extends StackScreenProps<any, any> { }

export const LoginScreen = ({ navigation }: Props) => {

  const { signIn, errorMessage, removeError } = useContext(AuthContext);

  const { email, password, onChange } = useForm({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) return;

    Alert.alert('Login incorrecto', errorMessage, [{
      text: 'Ok',
      onPress: removeError
    }]);

  }, [errorMessage])

  // useEffect(() => {
  //   SplashScreen.hide();
  // }, [])


  const onLogin = () => {
    Keyboard.dismiss();
    signIn({ correo: email, password });
  };

  return (
    <>
      {/* background */}
      <Background />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        <View style={loginStyles.formContainer}>

          {/* keyboard avoid view */}

          <WhiteLogo />

          <Text style={{ ...loginStyles.title }}>Login</Text>

          <Text style={{ ...loginStyles.label }}>Email</Text>

          <TextInput
            placeholderTextColor="rgba(255,255,255,0.4)"
            placeholder="Ingrese su email"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={{ ...loginStyles.label }}>Password</Text>

          <TextInput
            placeholderTextColor="rgba(255,255,255,0.4)"
            placeholder="******"
            underlineColorAndroid="white"
            secureTextEntry
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* boton login */}

          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              onPress={onLogin}
              activeOpacity={0.8}
              style={loginStyles.button}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Crear una nueva cuenta */}
          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('RegisterScreen')}>
              <Text style={loginStyles.buttonText}>Nueva cuenta</Text>
            </TouchableOpacity>
          </View>

        </View>

      </KeyboardAvoidingView>
    </>
  );
};
