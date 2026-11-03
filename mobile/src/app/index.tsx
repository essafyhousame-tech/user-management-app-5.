import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { Link, useRouter } from 'expo-router';

import api from '../constants/api';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
    const router = useRouter();

    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleLogin = async () => {
        setMessage('');
        setSuccess(false);

        if (!email.trim() || !password) {
            setMessage('Please enter your email and password.');
            return;
        }

        try {
            setLoading(true);

            const response = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password,
            });

            const token = response.data.token;
            const user = response.data.user;

            if (!token || !user) {
                throw new Error('Authentication data was not received.');
            }

            if (Platform.OS === 'web') {
                localStorage.setItem('userToken', token);
            } else {
                await SecureStore.setItemAsync('userToken', token);
            }

            setAuth(token, user);

            setSuccess(true);
            setMessage('You are logged in successfully!');

            router.replace('/home');

        } catch (error: any) {
            setSuccess(false);

            setMessage(
                error.response?.data?.message ||
                error.message ||
                'Cannot connect to the server.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Login</Text>

                <Text style={styles.subtitle}>
                    Sign in to your account
                </Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Password</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {message !== '' && (
                        <Text
                            style={
                                success
                                    ? styles.successMessage
                                    : styles.errorMessage
                            }
                        >
                            {message}
                        </Text>
                    )}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don't have an account?
                        </Text>

                        <Link href="/register" style={styles.registerText}>
                            {' '}Register
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222222',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#777777',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 35,
    },
    form: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },
    label: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 8,
        marginTop: 18,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 15,
        backgroundColor: '#FFFFFF',
    },
    button: {
        height: 50,
        backgroundColor: '#333333',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successMessage: {
        color: '#16803C',
        backgroundColor: '#E8F5EC',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    errorMessage: {
        color: '#C62828',
        backgroundColor: '#FDECEC',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#777777',
        fontSize: 14,
    },
    registerText: {
        color: '#333333',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
