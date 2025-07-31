import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { auth } from '../firebaseConfig';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [mode, setMode] = useState('login'); // login | register | reset
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const showError = (msg = 'Credenciais Inválidas') => {
    setError(msg);
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await auth.signInWithEmailAndPassword(email, pass);
    } catch {
      showError();
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await auth.createUserWithEmailAndPassword(email, pass);
    } catch {
      showError();
    }
  };

  /* novo: envia link de reposição */
  const handleSendReset = async () => {
    setLoading(true);
    setError('');
    try {
      await auth.sendPasswordResetEmail(email);
      showError('Verifique o seu e-mail');
      setMode('login');
    } catch {
      showError();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../assets/YnotWhiteOnBlack.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="#000"
          style={styles.input}
        />

        {(mode === 'login' || mode === 'register') && (
          <TextInput
            label="Password"
            value={pass}
            onChangeText={setPass}
            secureTextEntry
            autoCapitalize="none"
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="#000"
            style={styles.input}
          />
        )}

        {mode === 'login' && (
          <>
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Login
            </Button>

            <Button
              mode="text"
              onPress={() => setMode('register')}
              disabled={loading}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
            >
              Não tem Conta? Registe-se.
            </Button>

            <Button
              mode="text"
              onPress={() => setMode('reset')}
              disabled={loading}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
            >
              Esqueci-me da password
            </Button>
          </>
        )}

        {mode === 'register' && (
          <>
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Create account
            </Button>

            <Button
              mode="text"
              onPress={() => setMode('login')}
              disabled={loading}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
            >
              Back to login
            </Button>
          </>
        )}

        {mode === 'reset' && (
          <>
            <Button
              mode="contained"
              onPress={handleSendReset}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Enviar link
            </Button>

            <Button
              mode="text"
              onPress={() => setMode('login')}
              disabled={loading}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
            >
              Voltar
            </Button>
          </>
        )}
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  logo: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    marginBottom: 48,
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: 24,
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 4,
    paddingVertical: 4,
    backgroundColor: '#000',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    marginTop: 12,
  },
  secondaryButtonLabel: {
    color: '#666',
    fontSize: 14,
  },
});