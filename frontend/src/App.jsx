import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, adminRoutes } from './routes/User';
import { Fragment } from 'react';
import { AuthProvider } from './context/AuthContext';
import store from './stores';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            {publicRoutes.map((route, index) => {
                                const Page = route.Component;

                                let Layout;

                                if (route.layout) {
                                    Layout = route.layout;
                                } else {
                                    Layout = Fragment;
                                }

                                let Bonus;

                                if (route.bonus) {
                                    Bonus = route.bonus;
                                } else {
                                    Bonus = Fragment;
                                }

                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Page>
                                                    <Bonus />
                                                </Page>
                                            </Layout>
                                        }
                                    />
                                );
                            })}

                            {adminRoutes.map((route, index) => {
                                const Page = route.Component;

                                let Layout;

                                if (route.layout) {
                                    Layout = route.layout;
                                } else {
                                    Layout = Fragment;
                                }

                                let Bonus;

                                if (route.bonus) {
                                    Bonus = route.bonus;
                                } else {
                                    Bonus = Fragment;
                                }

                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Page>
                                                    <Bonus />
                                                </Page>
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                        <div>
                            <ToastContainer
                                position="top-right"
                                autoClose={2000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover={false}
                                theme="colored"
                            />
                        </div>
                    </div>
                </Router>
            </AuthProvider>
        </Provider>
    );
}

export default App;
