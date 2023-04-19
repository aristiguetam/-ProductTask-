import { useContext, useEffect } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AuthContext } from '../context/AuthContext';

import { loginStyles } from '../theme/loginTheme';
import { WhiteLogo } from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> { }

export const RegisterScreen = ({ navigation }: Props) => {

  const { signUp, errorMessage, removeError } = useContext(AuthContext);

  const { email, password, name, onChange } = useForm({
    email: '',
    name: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) return;

    Alert.alert('Error', errorMessage, [{
      text: 'Ok',
      onPress: removeError
    }]);

  }, [errorMessage])



  const onRegister = () => {
    // console.log({ email, password, name });
    Keyboard.dismiss();
    signUp({ nombre: name, correo: email, password })
  };

  return (
    <>
      {/* background */}
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#5856D6' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          {/* keyboard avoid view */}

          <WhiteLogo />

          <Text style={{ ...loginStyles.title }}>Registro</Text>

          <Text style={{ ...loginStyles.label }}>Name</Text>

          <TextInput
            placeholderTextColor="rgba(255,255,255,0.4)"
            placeholder="Ingrese su name"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'name')}
            value={name}
            onSubmitEditing={onRegister}
            autoCapitalize="words"
            autoCorrect={false}
          />

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
            onSubmitEditing={onRegister}
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
            onSubmitEditing={onRegister}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* boton crear cuenta */}

          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              onPress={onRegister}
              activeOpacity={0.8}
              style={loginStyles.button}>
              <Text style={loginStyles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* atras al login */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.replace('LoginScreen')}
            style={loginStyles.buttonReturn}>
            <Text style={loginStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
