import { useEffect, useState } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import * as SecureStore from 'expo-secure-store';

import api from '../constants/api';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
    const router = useRouter();

    const setAuth = useAuthStore((state) => state.setAuth);
    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                let token: string | null;

                if (Platform.OS === 'web') {
                    token = localStorage.getItem('userToken');
                } else {
                    token = await SecureStore.getItemAsync('userToken');
                }

                if (!token) {
                    return;
                }

                const response = await api.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const user = response.data.user || response.data;

                if (user.id && user.name && user.email) {
                    setAuth(token, user);
                }

            } catch (error: any) {
                console.log(
                    'Session restoration error:',
                    error.response?.data || error.message
                );

                // Remove the token only if the server rejects it.
                if (error.response?.status === 401) {
                    if (Platform.OS === 'web') {
                        localStorage.removeItem('userToken');
                    } else {
                        await SecureStore.deleteItemAsync('userToken');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/home');
        }
    }, [loading, isAuthenticated]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333333" />
            </View>
        );
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
