import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


const baseURL = 'http://192.168.18.112:8080/api';
// const baseURL = 'https://deploy-backend-production-c348.up.railway.app/api';

const productosApi = axios.create({ baseURL })

productosApi.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            config.headers['x-token'] = token;
        }

        return config;
    }
)

export default productosApi