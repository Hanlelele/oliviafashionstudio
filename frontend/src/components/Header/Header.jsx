import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Cart, Logo, Profile } from '../../assets/icons';
import { useAuth } from '../../context/AuthContext';
import AuthApi from '../../api/authApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { itemsCount, fetchCart } from '../../stores/CartSlice/CartSlice';
import { DefaultAvatar } from '../../assets/imgs';
import Tippy from '@tippyjs/react/headless';
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItemCount = useSelector(itemsCount);
    const { user, logout } = useAuth();
    const [keyword, setKeyWord] = useState('');
    let [searchParams] = useSearchParams();

    useEffect(() => {
        if (user?.isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [user.isAuthenticated]);

    const search = searchParams.get('search');

    useEffect(() => {
        if (!search) {
            setKeyWord('');
        }
    }, [search]);

    const handleSearchKeyWord = (e) => {
        e.preventDefault();
        setKeyWord(e.target.value);
    };

    const handleLogOut = async () => {
        const response = await AuthApi.logout();
        if (response?.status === 200) {
            toast.success('Log out successful');
            logout();
            navigate('/login');
        } else {
            toast.error(response.data.message);
        }
    };

    const handleOnCartClick = (e) => {
        e.preventDefault();
        if (!user.isAuthenticated) {
            toast.error('Please login first!');
        } else {
            navigate(`/cart/${user._id}`);
        }
    };

    return (
        <div className="lg:h-[86px] sticky h-[60px]">
            <div className="max-w-[1200px] flex justify-between mx-0 my-auto">
                <NavLink to="/" className="w-[86px] h-auto">
                    <Logo className="lg:h-[86px] w-auto h-[60px]" />
                </NavLink>

                <div className="flex items-center">
                    <input
                        className="lg:w-[500px] lg:h-[40px] md:w-[300px] lg:p-[15px] p-[8px] h-[34px] w-[200px] border-2 rounded-l-lg focus:border-sky-600 outline-none text-[13px] lg:text-[16px]"
                        name="searchbar"
                        id="searchbar"
                        type="text"
                        placeholder="Search"
                        value={keyword}
                        onChange={(e) => handleSearchKeyWord(e)}
                    ></input>
                    <NavLink
                        to={`/search?search=${keyword}`}
                        className="bg-primary lg:h-[42px] lg:pt-2 lg:pb-2 lg:px-4 px-1 py-[6px]  border rounded-r-lg -ml-[2px] cursor-pointer hover:opacity-80"
                    >
                        <p className="font-body lg:text-[16px] text-[13px] text-white text-center">Search</p>
                    </NavLink>
                </div>

                <div className="md:flex hidden">
                    <NavLink
                        className="mr-[30px] group flex flex-col items-center justify-center gap-1"
                        onClick={handleOnCartClick}
                    >
                        <Cart className="lg:w-[20px] lg:h-[20px] w-[15px] h-[15px] fill-dark group-hover:fill-grey-500 relative" />
                        {user.isAuthenticated && cartItemCount !== 0 && (
                            <p className="cart-noti absolute bg-red border rounded-[50%] top-[10%] translate-x-[70%] w-[25px] h-[25px] flex items-center justify-center">
                                <span className="text-white text-[14px]">{cartItemCount}</span>
                            </p>
                        )}

                        <p className="font-body lg:text-xs text-[10px] text-dark group-hover:text-grey-500">My cart</p>
                    </NavLink>
                    {user.isAuthenticated && (
                        <NavLink
                            className="group mr-[30px] flex flex-col items-center justify-center gap-1"
                            to="/profile"
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <FontAwesomeIcon icon={faUser} className="group-hover:text-grey-500" />
                                    ) : (
                                        <Profile className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                    )}
                                    <p className="font-body text-xs text-dark group-hover:text-grey-500">Profile</p>
                                </>
                            )}
                        </NavLink>
                    )}

                    {!user.isAuthenticated && (
                        <div className="flex sm:flex-row flex-col justify-center">
                            <NavLink className="group flex items-center justify-center" to="/login">
                                <p className="font-body text-xs text-dark group-hover:text-grey-500">Sign in</p>
                                <div className="after:ml-[9px] sm:after:border-[1px] sm:after:border-grey-400 sm:after:inline-block sm:after:h-[13px]"></div>
                            </NavLink>
                            <NavLink
                                className="group mx-[9px] flex flex-col items-center justify-center"
                                to="/register"
                            >
                                <p className="font-body text-xs text-dark group-hover:text-grey-500">Register</p>
                            </NavLink>
                        </div>
                    )}
                    {user.isAuthenticated && (
                        <NavLink
                            className="group mr-[18px] flex flex-col items-center justify-center gap-1"
                            onClick={handleLogOut}
                        >
                            <FontAwesomeIcon
                                icon={faArrowRightFromBracket}
                                className="text-[20px] group-hover:text-grey-500"
                            />
                            <p className="font-body text-xs text-dark group-hover:text-grey-500">Log out</p>
                        </NavLink>
                    )}
                </div>

                <div className="md:hidden flex">
                    {!user.isAuthenticated && (
                        <div className="flex sm:flex-row flex-col justify-center">
                            <NavLink className="group flex items-center justify-center" to="/login">
                                <p className="font-body text-xs text-dark group-hover:text-grey-500">Sign in</p>
                                <div className="after:ml-[9px] sm:after:border-[1px] sm:after:border-grey-400 sm:after:inline-block sm:after:h-[13px]"></div>
                            </NavLink>
                            <NavLink
                                className="group mx-[9px] flex flex-col items-center justify-center"
                                to="/register"
                            >
                                <p className="font-body text-xs text-dark group-hover:text-grey-500">Register</p>
                            </NavLink>
                        </div>
                    )}
                    {user.isAuthenticated && (
                        <Tippy
                            render={(attrs) => (
                                <div
                                    className="bg-white w-[150px] border-[1px] border-[#ddd] rounded-[4px] z-[1000] cursor-pointer"
                                    tabIndex="-1"
                                    {...attrs}
                                >
                                    <NavLink
                                        className="group flex flex-row items-center justify-start gap-1 hover:bg-gray-100  px-[16px] py-[11px]"
                                        onClick={handleOnCartClick}
                                    >
                                        <Cart className="w-[20px] h-[20px] fill-dark relative mr-2" />
                                        {cartItemCount !== 0 && (
                                            <p className="cart-noti absolute bg-red border rounded-[50%] top-[2%] translate-x-[70%] w-[15px] h-[15px] flex items-center justify-center">
                                                <span className="text-white text-[14px]">{cartItemCount}</span>
                                            </p>
                                        )}

                                        <p className="font-body text-sm text-dark">My cart</p>
                                    </NavLink>

                                    <NavLink
                                        className="group flex flex-row items-center justify-start gap-1 hover:bg-gray-100 px-[16px] py-[11px]"
                                        to="/profile"
                                    >
                                        <Profile className="w-[20px] h-[20px] fill-dark mr-2" />
                                        <p className="font-body text-sm text-dark">Profile</p>
                                    </NavLink>

                                    <NavLink
                                        className="group flex flex-row items-center justify-start gap-1  px-[16px] py-[11px] border-t border-custom hover:bg-gray-100"
                                        onClick={handleLogOut}
                                    >
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-[20px] mr-2" />
                                        <p className="font-body text-sm text-dark">Log out</p>
                                    </NavLink>
                                </div>
                            )}
                            interactive={true}
                            placement="bottom"
                            appendTo={document.body}
                            offset={[0, -5]}
                            delay={[0, 700]}
                        >
                            <div className="flex justify-center items-center mr-2 cursor-pointer">
                                <img
                                    className="border rounded-[50%] border-grey-300 w-[30px] h-[30px]"
                                    src={user?.image || DefaultAvatar}
                                ></img>
                            </div>
                        </Tippy>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
