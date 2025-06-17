import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // ← Isso precisa estar aqui!
import App from "./app";

import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingProvider } from "./context/LoadingContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<LoadingProvider>
				<App />
			</LoadingProvider>
			<ToastContainer
				position='bottom-right'
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				transition={Bounce}
				theme='colored'
			/>
		</BrowserRouter>
	</React.StrictMode>
);
