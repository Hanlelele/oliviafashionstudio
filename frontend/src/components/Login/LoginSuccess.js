import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginSuccess = () => {
    const { userId } = useParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const user = { userId };
                const response = await axios.post('http://localhost:8000/api/auth/login-success', user, {
                    withCredentials: true,
                });

                if (response.data.success) {
                    toast.success('Login successful');
                    login(response.data.user, response.data.jwt);
                    if (response.data.user.isAdmin) {
                        navigate('/admin/');
                    } else {
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        };
        fetchToken();
    }, [userId, login, navigate]);

    return null;
};

export default LoginSuccess;
