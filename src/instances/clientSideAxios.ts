import axios from 'axios';
import { toast } from 'react-toastify';

/* 
    Make sure to use this only on client side, because it
    has error interceptor to display toast on frontend
*/
const clientSideAxiosInstance = axios.create({ baseURL: '/api' });

clientSideAxiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// This is our "new BackendError()""
		const backendErrorMessage = error.response?.data?.notification;
		if (backendErrorMessage) {
			toast.error(backendErrorMessage);
		}
		throw error;
	}
);

export default clientSideAxiosInstance;
