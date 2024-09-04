import config from '../../config/User/index';

import Container from '../../components/Container/Container';
import HomePage from '../../pages/User/HomePage';
import ProductDetail from '../../pages/User/ProductDetail';
import LoginPage from '../../pages/User/LoginPage';
import LoginSuccess from '../../components/Login/LoginSuccess';
import RegisterPage from '../../pages/User/RegisterPage';
import ProductsPage from '../../pages/User/Products/ProductsPage';
import SearchPage from '../../pages/User/SearchPage';
import CartPage from '../../pages/User/CartPage';
import Profile from '../../pages/User/Profile/Profile';
import ProfilePage from '../../components/ProfilePage/ProfilePage';
import OrderInfo from '../../components/OrderInfo/OrderInfo';
import CheckoutPage from '../../pages/User/Checkout/Checkout';

import AdminContainer from '../../components/Container/AdminContainer';
import AdminHome from '../../pages/Admin/AdminHome/AdminHome';
import AdminCategories from '../../pages/Admin/AdminCategories/AdminCategories';
import AdminProducts from '../../pages/Admin/AdminProducts/AdminProducts';
import AdminOrders from '../../pages/Admin/AdminOrders/AdminOrders';
import AdminCoupons from '../../pages/Admin/AdminCoupons/AdminCoupons';
//Public routes
const publicRoutes = [
    { path: config.routes.home, Component: HomePage, layout: Container },
    { path: config.routes.product, Component: ProductDetail, layout: Container },
    { path: config.routes.login, Component: LoginPage },
    { path: config.routes.loginGoogle, Component: LoginSuccess },
    { path: config.routes.register, Component: RegisterPage },
    { path: config.routes.category, Component: ProductsPage, layout: Container },
    { path: config.routes.search, Component: SearchPage, layout: Container },
    { path: config.routes.cart, Component: CartPage, layout: Container },
    { path: config.routes.profile, Component: Profile, layout: Container, bonus: ProfilePage },
    { path: config.routes.order, Component: Profile, layout: Container, bonus: OrderInfo },
    { path: config.routes.checkout, Component: CheckoutPage, layout: Container },
];

const adminRoutes = [
    { path: config.routes.adminHome, Component: AdminHome, layout: AdminContainer },
    { path: config.routes.admincategory, Component: AdminCategories, layout: AdminContainer },
    { path: config.routes.adminproduct, Component: AdminProducts, layout: AdminContainer },
    { path: config.routes.adminorder, Component: AdminOrders, layout: AdminContainer },
    { path: config.routes.adminCoupon, Component: AdminCoupons, layout: AdminContainer },
];

export { publicRoutes, adminRoutes };
