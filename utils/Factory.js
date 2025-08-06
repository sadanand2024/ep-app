import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";
import { handleApiLogout } from './logoutHandler';

const Factory = async (api, URL, payload, headers = {}, config = {}) => {
    const BASE_URL = API_URL;
    URL = BASE_URL + URL;
    let token = null;
    try {
        token = await AsyncStorage.getItem('authToken');
    } catch (error) {
        console.error('Error getting auth token:', error);
    }

    const getErrorMessage = (api) => {
        switch (api) {
            case 'put':
                return 'Data updated successfully.';
            case 'post':
                return 'Data submitted successfully.';
            case 'delete':
                return 'Data deleted successfully.';
            case 'get':
                return 'Data fetched successfully.';
            case 'patch':
                return 'Data fetched successfully.';
            default:
                break;
        }
    };

    const handleLogout = async () => {
        try {
            // Use the centralized logout handler
            await handleApiLogout();
            console.log('User logged out due to invalid token - navigation will reset automatically');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    try {
        const response = await axios({
            method: api,
            url: URL,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            data: payload,
            timeout: 30000,
            ...config
        });
        if (response?.status == 200 || response?.status == 204) {
            return {
                status_cd: 1,
                data: response.data,
                variant: 'success',
                message: getErrorMessage(api)
            };
        } else if (response?.status == 201) {
            return {
                status_cd: 1,
                data: response.data,
                variant: 'success',
                message: getErrorMessage(api)
            };
        } else if (response?.status == 500) {
            return {
                status_cd: 0,
                data: response.data,
                variant: 'error',
                message: getErrorMessage(api)
            };
        } else {
            return { status_cd: 0, data: response.data, variant: 'error', message: 'Something went wrong.' };
        }

    } catch (error) {
        if (error?.response?.status == 401) {
            if (error?.response?.data.code === 'token_not_valid') {
                await handleLogout();
            }
            return {
                status_cd: 0,
                data: error.response.data,
                variant: 'error',
                message: 'Unauthorized access. Please login again.'
            };
        } else if (error?.response?.status == 404) {
            return {
                status_cd: 0,
                data: error.response.data,
                variant: 'warning',
                message: 'Data not found.'
            };
        } else if (error?.response?.status == 500) {
            return {
                status_cd: 0,
                data: error.response.data,
                variant: 'error',
                message: 'Something went wrong'
            };
        } else if (error?.response?.status == 400) {
            return {
                status_cd: 0,
                data: error.response.data,
                variant: 'error',
                message: 'Something went wrong'
            };
        } else if (error?.code === 'ECONNABORTED') {
            return {
                status_cd: 0,
                data: error.response.data,
                variant: 'error',
                message: 'Request timeout. Please try again.'
            };
        } else if (error?.message === 'Network Error') {
            return {
                status_cd: 0,
                data: error.response.data,
                variant: 'error',
                message: 'Network error. Please check your internet connection.'
            };
        } else {
            return {
                status_cd: 0,
                data: error.response.data,
                variant: 'error',
                message: 'Something went wrong.'
            };
        }
    }
};

export default Factory;
