import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

import api from '../constants/api';
import { useAuthStore } from '../store/authStore';

type User = {
    id: number;
    name: string;
    email: string;
};

export default function HomeScreen() {
    const router = useRouter();

    // Get authentication data from Zustand
    const token = useAuthStore((state) => state.token);
    const currentUser = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                if (!token) {
                    router.replace('/');
                    return;
                }

                const response = await api.get('/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const usersData = response.data.users || response.data;

                setUsers(usersData);

            } catch (error: any) {
                console.log(
                    'Error loading users:',
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [token]);

    const handleLogout = async () => {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem('userToken');
            } else {
                await SecureStore.deleteItemAsync('userToken');
            }

            // Clear authentication data from Zustand
            logout();

            router.replace('/');

        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Users Management</Text>

                <Text style={styles.subtitle}>
                    Welcome, {currentUser?.name || 'User'}
                </Text>

                <Text style={styles.description}>
                    List of registered users
                </Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#333333" />
                ) : (
                    <>
                        <Text style={styles.count}>
                            Total Users: {users.length}
                        </Text>

                        {users.length === 0 ? (
                            <Text style={styles.empty}>
                                No users found.
                            </Text>
                        ) : (
                            users.map((user) => (
                                <View key={user.id} style={styles.userCard}>
                                    <Text style={styles.userName}>
                                        {user.name}
                                    </Text>

                                    <Text style={styles.userEmail}>
                                        {user.email}
                                    </Text>
                                </View>
                            ))
                        )}
                    </>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F8F9FA',
        padding: 25,
        justifyContent: 'center',
    },

    content: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },

    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: '#222222',
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'center',
        marginTop: 12,
    },

    description: {
        fontSize: 14,
        color: '#777777',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 25,
    },

    count: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 15,
    },

    userCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },

    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 6,
    },

    userEmail: {
        fontSize: 14,
        color: '#777777',
    },

    empty: {
        textAlign: 'center',
        color: '#777777',
        marginVertical: 20,
    },

    button: {
        height: 50,
        backgroundColor: '#333333',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
