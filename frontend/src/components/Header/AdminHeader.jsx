import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    Cart,
    Logo,
    Profile,
    Category,
    Product,
    Order,
    CategoryActive,
    ProductActive,
    OrderActive,
    Analysis,
    AnalysisActive,
    Coupon,
    CouponActive,
} from '../../assets/icons';
import { useAuth } from '../../context/AuthContext';
import AuthApi from '../../api/authApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const Header = () => {
    const location = useLocation();
    const isExactActive = location.pathname === '/admin/';
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [keyword, setKeyWord] = useState('');
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
    return (
        <div className="h-[86px] sticky">
            <div className="max-w-[1200px]  flex justify-between" style={{ margin: '0 auto' }}>
                <NavLink to="/admin/" className="w-[86px] h-auto">
                    <Logo className="h-[86px] w-auto" />
                </NavLink>

                <div className="flex">
                    <div className="flex">
                        <NavLink
                            className="group mr-[18px] flex flex-col items-center justify-center gap-1"
                            to="/admin/"
                            exact="true"
                        >
                            <>
                                {isExactActive ? (
                                    <div className="w-[20px] h-[20px]">
                                        <img
                                            src={AnalysisActive}
                                            alt="Product Active"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-[20px] h-[20px]">
                                        <img
                                            src={Analysis}
                                            alt="Product Active"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                                <p
                                    className={clsx(
                                        `font-body text-xs text-dark group-hover:text-grey-500`,
                                        isExactActive && 'font-[700]',
                                    )}
                                >
                                    Analysis
                                </p>
                            </>
                        </NavLink>
                        <NavLink
                            className="group mr-[18px] flex flex-col items-center justify-center gap-1"
                            to="/admin/categories"
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <CategoryActive className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                    ) : (
                                        <Category className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                    )}
                                    <p
                                        className={clsx(
                                            `font-body text-xs text-dark group-hover:text-grey-500`,
                                            isActive && 'font-[700]',
                                        )}
                                    >
                                        Categories
                                    </p>
                                </>
                            )}
                            {/* <Category className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />

                            <p className="font-body text-xs text-dark group-hover:text-grey-500">Categories</p> */}
                        </NavLink>
                        <NavLink
                            className="group mr-[18px] flex flex-col items-center justify-center gap-1"
                            to="/admin/products"
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <div className="w-[20px] h-[20px]">
                                            <img
                                                src={ProductActive}
                                                alt="Product Active"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <Product className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                                    )}
                                    <p
                                        className={clsx(
                                            `font-body text-xs text-dark group-hover:text-grey-500`,
                                            isActive && 'font-[700]',
                                        )}
                                    >
                                        Products
                                    </p>
                                </>
                            )}
                        </NavLink>
                        <NavLink
                            className="group mr-[18px] flex flex-col items-center justify-center gap-1"
                            to="/admin/orders"
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <div className="w-[20px] h-[20px]">
                                            <img
                                                src={OrderActive}
                                                alt="Order Active"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-[20px] h-[20px]">
                                            <img src={Order} alt="order" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    <p
                                        className={clsx(
                                            `font-body text-xs text-dark group-hover:text-grey-500`,
                                            isActive && 'font-[700]',
                                        )}
                                    >
                                        Orders
                                    </p>
                                </>
                            )}
                        </NavLink>
                        <NavLink
                            className="group mr-[18px] flex flex-col items-center justify-center gap-1"
                            to="/admin/coupons"
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <div className="w-[20px] h-[20px]">
                                            <img
                                                src={CouponActive}
                                                alt="Order Active"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-[20px] h-[20px]">
                                            <img src={Coupon} alt="order" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    <p
                                        className={clsx(
                                            `font-body text-xs text-dark group-hover:text-grey-500`,
                                            isActive && 'font-[700]',
                                        )}
                                    >
                                        Coupons
                                    </p>
                                </>
                            )}
                        </NavLink>
                        {/* <NavLink
                            className="group mr-[30px] flex flex-col items-center justify-center gap-1"
                            to="/admin/users"
                        >
                            <Profile className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                            <p className="font-body text-xs text-dark group-hover:text-grey-500">Management</p>
                        </NavLink> */}
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
                </div>
            </div>
        </div>
    );
};

export default Header;
