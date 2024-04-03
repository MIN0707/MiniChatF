import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    // 얘가 두번 실행 시킴
    // <React.StrictMode>
    <div className={'background'}>
        <App/>
    </div>
    // </React.StrictMode>
);