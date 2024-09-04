import { useAuth } from '../../../context/AuthContext';
import { DefaultAvatar } from '../../../assets/imgs';
import { NavLink } from 'react-router-dom';
import './Profile.css';
const Profile = ({ children }) => {
    const { user } = useAuth();
    return (
        user && (
            <div className="flex flex-col items-center pb-[100px]">
                <div className="w-full grid grid-cols-[0.5fr_2fr] pt-[20px] sm:gap-x-[28px] gap-x-[10px]">
                    <div className="flex flex-col sm:px-4 pl-2">
                        <div className="avatar section md:flex sm:items-center gap-x-[12px] pt-[20px] text-center">
                            <div className="flex justify-center">
                                <img
                                    className="border rounded-[50%] border-grey-300 w-[50px] h-[50px]"
                                    src={user?.image || DefaultAvatar}
                                />
                            </div>
                            <div className="font-body text-dark font-[700] text-center">
                                {user?.username || 'unknown'}
                            </div>
                        </div>
                        <NavLink className="sidebar-option mt-[24px]" to={`/profile`}>
                            <span className="font-body p">My profile</span>
                        </NavLink>
                        <NavLink className="sidebar-option mt-[12px]" to={`/order`}>
                            <span className="font-body">My order</span>
                        </NavLink>
                    </div>
                    <main className="bg-white px-[20px] border border-grey-300 shadow-sm rounded-md">{children}</main>
                </div>
            </div>
        )
    );
};

export default Profile;
