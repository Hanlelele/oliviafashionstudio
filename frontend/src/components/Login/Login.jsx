import { NavLink, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Google } from '../../assets/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import AuthApi from '../../api/authApi';
import { toast } from 'react-toastify';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PWD_REGEX = /^.{8,24}$/;

const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const userRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [tooglePassword, setTooglePassword] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd]);

    const handleSubmit = async () => {
        if (!validEmail || !validPwd) {
            setErrMsg('Invalid input. Try again');
        } else if (user.isAuthenticated) {
            toast.error('Please log out first');
            setErrMsg('Please log out first');
        } else {
            setErrMsg('');
            const dataToSend = {
                email: email,
                password: pwd,
            };

            const response = await AuthApi.login(dataToSend);
            if (response?.status === 200) {
                toast.success('Login successful');
                login(response.data.data, response.data.data.accessToken);
                if (response.data.data.isAdmin) {
                    navigate('/admin/');
                } else {
                    navigate(`/`);
                }
            } else {
                toast.error(response?.data?.message);
                setErrMsg(`${response?.data?.message}`);
            }
        }
    };

    useEffect(() => {
        if (user && user.isAuthenticated) {
            if (user.isAdmin) {
                navigate('/employee');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    return (
        <div
            className={`bg-white border rounded-md w-[400px] grid-cols-[68px_1fr_68px] border-grey-200 shadow-sm my-[30px]`}
        >
            <div className="Header p-[20px] flex justify-between items-center">
                <p className="text-[20px] font-body text-primary font-[500]">Log In</p>
                {errMsg && <p className="error font-body text-[16px] text-red">{errMsg}</p>}
            </div>
            <div className="form-content px-[20px] flex flex-col gap-y-4">
                <div className="user-section flex flex-col">
                    <label htmlFor="email" className="font-body text-sm">
                        Email:
                    </label>
                    <input
                        type="text"
                        ref={userRef}
                        className="px-[12px] py-[6px] border border-grey-400 focus:outline-primary"
                        name="email"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></input>
                    {emailFocus && user && !validEmail && (
                        <p className="error-email font-body text-[12px] pt-1 text-red">Invalid Email</p>
                    )}
                </div>

                <div className="password-section flex flex-col">
                    <label htmlFor="password" className="font-body text-sm">
                        Password:
                    </label>
                    <div className="password-input-container border border-grey-400 flex focus-within:border-primary focus-within:border-2">
                        <input
                            type={tooglePassword ? 'text' : 'password'}
                            className="px-[12px] py-[6px] flex-1 outline-none"
                            name="password"
                            id="password"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            onChange={(e) => setPwd(e.target.value)}
                            required
                        ></input>
                        <div
                            className="flex items-center justify-center cursor-pointer"
                            onClick={() => setTooglePassword(!tooglePassword)}
                        >
                            {!tooglePassword ? (
                                <FontAwesomeIcon icon={faEyeSlash} className="px-[8px]" />
                            ) : (
                                <FontAwesomeIcon icon={faEye} className="px-[8px]" />
                            )}
                        </div>
                    </div>
                    {pwdFocus && pwd && !validPwd && (
                        <p className="error-pwd font-body text-[12px] pt-1 text-red">
                            Invalid password: minimum 8 characters and maximum 24 characters
                        </p>
                    )}
                </div>

                <div
                    className="px-[20px] py-[10px] button w-full bg-primary cursor-pointer hover:opacity-85 flex justify-center items-center"
                    onClick={handleSubmit}
                >
                    <span className="text-white">Log in</span>
                </div>

                <div
                    className="OAuth px-[20px] py-[10px] flex items-center justify-center gap-x-2 
        border border-grey-400 cursor-pointer hover:bg-grey-100"
                    onClick={() => window.open('http://localhost:8000/api/auth/google', '_self')}
                >
                    <Google className="h-[22px]" />
                    <span className="font-body">Google</span>
                </div>
            </div>
            <div className="flex justify-center items-center gap-x-2 p-[20px]">
                <span className="font-body text-[14px] text-grey-500">New to Olivia?</span>
                <NavLink to={`/register`} className="font-body text-primary text-[14px]">
                    Register
                </NavLink>
            </div>
        </div>
    );
};

export default Login;
