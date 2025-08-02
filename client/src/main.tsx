import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
//import LandingPage from '../components/page-components/landing/home/LandingPage.tsx'
import { store,persistor } from './Redux/store.tsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
<App/>
</PersistGate>
</Provider>
  </StrictMode>,
)
