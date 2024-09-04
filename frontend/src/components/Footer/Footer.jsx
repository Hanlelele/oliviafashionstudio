import { Logo, Facebook, Linkedin, Instagram, Youtube, AppStore, GooglePlay } from '../../assets/icons';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full box-border h-[324px] grid lg:grid-rows-[5fr_1fr] grid-rows-[4fr_1fr] justify-items-center px-2">
            <div className="mt-4 w-full grid lg:grid-cols-[auto_1fr_1fr_1fr_1fr_auto] grid-cols-1 sm:grid-cols-[1fr_1fr_1fr]  gap-4">
                <div className="flex flex-col items-start justify-start">
                    <Logo className="h-[100px] w-auto cursor-pointer" onClick={() => navigate(`/`)} />
                    <p className="font-body text-grey-600 text-wrap">
                        Final e-commerce web project - Olivia fashion store
                    </p>
                    <div className="mt-2 flex gap-x-2">
                        <Facebook className="fill-grey-400 cursor-pointer" />
                        <Linkedin className="fill-grey-400 cursor-pointer" />
                        <Instagram className="fill-grey-400 cursor-pointer" />
                        <Youtube className="fill-grey-400 cursor-pointer" />
                    </div>
                </div>
                <div className="font-body mt-4">
                    <p className="text-dark font-medium mb-1">About</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">About us</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Find stores</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Categories</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Blogs</p>
                </div>
                <div className="font-body mt-4">
                    <p className="text-dark font-medium mb-1">Partnership</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">About us</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Find stores</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Categories</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Blogs</p>
                </div>
                <div className="font-body mt-4">
                    <p className="text-dark font-medium mb-1">Information</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Help center</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Money refund</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Shipping</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Contact us</p>
                </div>
                <div className="font-body mt-4">
                    <p className="text-dark font-medium mb-1">For users</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Login</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Register</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">Setting</p>
                    <p className="text-grey-500 cursor-pointer hover:text-grey-400">My cart</p>
                </div>
                <div className="font-body mt-4">
                    <p className="text-dark font-medium mb-1">Get app</p>
                    <AppStore className="mb-3 cursor-pointer" />
                    <GooglePlay className="cursor-pointer" />
                </div>
            </div>
            <div className="w-full bg-grey-200 flex justify-center">
                <div className="max-w-[1200px] w-full flex items-center justify-center">
                    <p className="font-body">© 2024 Ecommerce.</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
