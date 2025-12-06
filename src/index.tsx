import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Import BrowserRouter để thiết lập Context Router
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store'; 
import { setupAxiosInterceptors } from './api'; 
import { ToastContainer } from 'react-toastify';

setupAxiosInterceptors(store); 

<ToastContainer position="top-right" autoClose={2000} />

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>     
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);