import { useNavigate } from 'react-router-dom';
import Login from '../../components/Login/Login';
import Footer from '../../components/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

import Popup from 'reactjs-popup';
import { useState } from 'react';
import { Logo } from '../../assets/icons';

const LoginPage = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const navigate = useNavigate();

    const closeModal = () => setOpen(false);

    return (
        <main className="w-full min-h-[100vh] flex flex-col items-center">
            <div className="w-full Header flex items-center max-w-[1200px] max-h-[84px] py-[12px] gap-x-[24px] justify-between">
                <Logo
                    className="h-[84px] w-auto cursor-pointer z-10"
                    onClick={() => {
                        navigate(`/`);
                    }}
                />
                <p className="font-body text-2xl font-bold uppercase">Olivia Fashion Studio</p>
                <div className="flex justify-center items-center gap-1">
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    <p className="font-body text-sm font-[400] text-gray-500">Contact & FAQs</p>
                </div>
            </div>
            <div className="Form-section flex-1 bg-grey-100 w-full flex items-center justify-center">
                <div className="sm:grid sm:grid-cols-2 self-center justify-items-center">
                    <div className="intro sm:flex flex-col hidden">
                        <Logo className="w-full h-full object-cover" />
                    </div>
                    <div className="form flex items-center">
                        <Login />
                    </div>
                </div>
            </div>
            <Footer />
            <Popup
                open={open}
                closeOnDocumentClick
                onClose={closeModal}
                contentStyle={{
                    backgroundColor: '#050214',
                    width: '30%',
                }}
            >
                <div className="bg-form flex py-2">
                    <h1 className="text-white m-auto text-sm">{content}</h1>
                </div>
            </Popup>
            {loading && <Loading />}
        </main>
    );
};

export default LoginPage;
