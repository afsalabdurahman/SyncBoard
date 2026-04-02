import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store, persistor } from "./Redux/store.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />

        {/* Professional Light Mode Toast */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          transition={Slide}
          toastClassName="rounded-xl shadow-md text-sm font-medium"
          bodyClassName="text-gray-700"
          style={{ zIndex: 99999 }}
          limit={1}
        />
      </PersistGate>
    </Provider>
      </GoogleOAuthProvider>
  </StrictMode>
);
