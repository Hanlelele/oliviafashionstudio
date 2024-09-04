import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { DefaultAvatar } from '../../assets/imgs';
import AuthApi from '../../api/authApi';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user, update } = useAuth();
    const [fullname, setFullname] = useState(user?.fullname || user?.username);

    const handleUpdateUserInfo = async () => {
        if (user && fullname !== null && fullname !== '') {
            const response = await AuthApi.update(user._id, {
                fullname: fullname,
            });
            if (response.status === 200) {
                toast.success('Update successfully');
                update(response.data.data);
            }
        }
    };
    return (
        <div>
            <header className="heading flex flex-col border-b pt-[20px] pb-[15px]">
                <span className="font-body text-[18px] text-dark font-[500]">My Profile</span>
                <span className="my-[4px] font-body text-[14px]">Manage and protect your account</span>
            </header>
            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-1 py-[30px] divide-x">
                <div className="info-section md:pr-[100px] flex flex-col gap-y-[20px]">
                    <div className="grid grid-cols-[1fr_3fr] items-center gap-x-2">
                        <label htmlFor="username" className="justify-self-end font-body">
                            Username:
                        </label>
                        <input
                            className="w-full px-[20px] py-[10px] border border-grey-300 outline-none"
                            defaultValue={user?.username || 'Unknown'}
                            name="username"
                            readOnly
                        ></input>
                    </div>

                    <div className="grid grid-cols-[1fr_3fr] items-center gap-x-2">
                        <label htmlFor="email" className="justify-self-end">
                            Email:
                        </label>
                        <input
                            className="w-full px-[20px] py-[10px] border border-grey-300 outline-none"
                            defaultValue={user?.email || 'Unknown'}
                            name="email"
                            readOnly
                        ></input>
                    </div>

                    <div className="grid grid-cols-[1fr_3fr] items-center gap-x-2">
                        <label htmlFor="fullname" className="justify-self-end font-body">
                            Full name:
                        </label>
                        <input
                            className="w-full px-[20px] py-[10px] border border-grey-300 outline-none"
                            value={fullname}
                            name="fullname"
                            onChange={(e) => setFullname(e.target.value)}
                        ></input>
                    </div>

                    <div className="save-btn grid grid-cols-[1fr_3fr] items-center gap-x-2">
                        <button
                            className="col-start-2 font-body text-white bg-primary py-[8px] 
              border-0 rounded-md cursor-pointer hover:opacity-90 w-[20%]"
                            onClick={handleUpdateUserInfo}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <div className="ava-section md:flex justify-center hidden">
                    <img src={user?.image || DefaultAvatar} className="w-[100px] h-[100px] border rounded-[50%]" />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
