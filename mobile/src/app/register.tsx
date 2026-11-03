import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import api from '../constants/api';

export default function RegisterScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = async () => {
        setMessage('');
        setSuccess(false);

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setMessage('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setMessage('Password must be at least 8 characters.');
            return;
        }

        try {
            setLoading(true);

            const response = await api.post('/auth/register', {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });

            setSuccess(true);
            setMessage(
                response.data.message || 'Account created successfully!'
            );
        } catch (error: any) {
            setSuccess(false);

            setMessage(
                error.response?.data?.message ||
                'Unable to connect to the server. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {message !== '' && (
                    <Text style={success ? styles.successMessage : styles.errorMessage}>
                        {message}
                    </Text>
                )}

                {success && (
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.replace('/')}
                    >
                        <Text style={styles.loginButtonText}>
                            Go to Login
                        </Text>
                    </TouchableOpacity>
                )}

                {!success && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                    </Text>
                    <Link href="/" style={styles.link}>
                        Login
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#F8F9FA',
    },
    form: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#777',
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        height: 50,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 18,
        fontSize: 15,
    },
    button: {
        height: 50,
        backgroundColor: '#222',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successMessage: {
        color: '#16803C',
        backgroundColor: '#E8F5EC',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    errorMessage: {
        color: '#C62828',
        backgroundColor: '#FDECEC',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    loginButton: {
        height: 50,
        backgroundColor: '#222',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    footerText: {
        color: '#777',
    },
    link: {
        color: '#222',
        fontWeight: 'bold',
    },
});
