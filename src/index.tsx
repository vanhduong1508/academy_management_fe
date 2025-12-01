import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Import BrowserRouter để thiết lập Context Router
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store'; 
import { setupInterceptors } from './api'; 

// Thiết lập Interceptor sau khi Store đã được tạo
// Đây là bước quan trọng để phá vỡ Phụ thuộc Vòng tròn
setupInterceptors(store); 

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            {/* FIX: Thêm BrowserRouter để cung cấp Router Context */}
            <BrowserRouter> 
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);