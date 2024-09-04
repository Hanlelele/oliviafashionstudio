import { NavLink, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Google } from '../../assets/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import AuthApi from '../../api/authApi';
import { toast } from 'react-toastify';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^.{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const Register = () => {
    const navigate = useNavigate();

    const userRef = useRef();
    const emailRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [userName, setUsername] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [tooglePassword, setTooglePassword] = useState(false);
    const [toogleConfirmPassword, setToogleConfirmPassword] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidName(USER_REGEX.test(userName));
    }, [userName]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    const handleSubmit = async () => {
        if (!validEmail || !validName || !validPwd || !validMatch) {
            setErrMsg('Invalid input. Try again');
        } else {
            setErrMsg('');
            const dataToSend = {
                username: userName,
                email: email,
                password: matchPwd,
                fullname: 'default',
                loginMethod: 'AUTHENTICATION',
            };
            const response = await AuthApi.register(dataToSend);
            if (response?.status === 200) {
                navigate(`/login`);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
                setErrMsg(`${response.data.message}`);
            }
        }
    };

    return (
        <div
            className={`bg-white border rounded-md w-[400px] grid-cols-[68px_1fr_68px] border-grey-200 shadow-sm my-[30px]`}
        >
            <div className="Header p-[20px] flex justify-between items-center">
                <p className="text-[20px] font-body text-primary font-[500]">Sign Up</p>
                {errMsg && <p className="error-email font-body text-[16px] text-red">{errMsg}</p>}
            </div>
            <div className="form-content px-[20px] flex flex-col gap-y-4">
                <div className="email-section flex flex-col">
                    <label htmlFor="email" className="font-body text-sm">
                        Email:
                    </label>
                    <input
                        type="email"
                        ref={emailRef}
                        className="px-[12px] py-[6px] border border-grey-400 focus:outline-primary"
                        name="email"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></input>
                    {emailFocus && email && !validEmail && (
                        <p className="error-email font-body text-[12px] pt-1 text-red">Invalid email</p>
                    )}
                </div>

                <div className="user-section flex flex-col">
                    <label htmlFor="username" className="font-body text-sm">
                        Username:
                    </label>
                    <input
                        type="text"
                        ref={userRef}
                        className="px-[12px] py-[6px] border border-grey-400 focus:outline-primary"
                        name="username"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    ></input>
                    {userFocus && userName && !validName && (
                        <p className="error-email font-body text-[12px] pt-1 text-red">Invalid username</p>
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

                <div className="password-section flex flex-col">
                    <label htmlFor="confirm-password" className="font-body text-sm">
                        Confirm password:
                    </label>
                    <div className="confirm-password-input-container border border-grey-400 flex focus-within:border-primary focus-within:border-2">
                        <input
                            type={toogleConfirmPassword ? 'text' : 'password'}
                            className="px-[12px] py-[6px] flex-1 outline-none"
                            name="confirm-password"
                            id="confirm-password"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                        ></input>
                        <div
                            className="flex items-center justify-center cursor-pointer"
                            onClick={() => setToogleConfirmPassword(!toogleConfirmPassword)}
                        >
                            {!toogleConfirmPassword ? (
                                <FontAwesomeIcon icon={faEyeSlash} className="px-[8px]" />
                            ) : (
                                <FontAwesomeIcon icon={faEye} className="px-[8px]" />
                            )}
                        </div>
                    </div>
                    {matchFocus && matchPwd && !validMatch && (
                        <p className="error-pwd font-body text-[12px] pt-1 text-red">Password doesn't match</p>
                    )}
                </div>

                <div
                    className="px-[20px] py-[10px] button w-full bg-primary cursor-pointer hover:opacity-85 flex justify-center items-center"
                    onClick={handleSubmit}
                >
                    <span className="text-white">Sign Up</span>
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
                <span className="font-body text-[14px] text-grey-500">Have an account?</span>
                <NavLink to={`/login`} className="font-body text-primary text-[14px]">
                    Log in
                </NavLink>
            </div>
        </div>
    );
};

export default Register;
