import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Redirect } from "./pages/Redirect";
import { NotFound } from "./pages/NotFound";

export default function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={<Home />}
			/>
			<Route
				path='/:slug'
				element={<Redirect />}
			/>
			<Route
				path='/404'
				element={<NotFound />}
			/>
			<Route
				path='*'
				element={<NotFound />}
			/>
		</Routes>
	);
}
