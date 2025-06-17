import { useNavigate } from "react-router-dom";
import img404 from "../assets/404.svg";

export function NotFound() {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col justify-center items-center h-screen text-center'>
			<img
				src={img404}
				alt='Página não encontrada'
				style={{ width: "300px", marginBottom: "20px" }}
			/>
			<h2>Página não encontrada</h2>
			<p>O link encurtado não existe ou expirou.</p>
			<button
				onClick={() => navigate("/")}
				style={{
					marginTop: 20,
					padding: "10px 20px",
					fontSize: "16px",
					cursor: "pointer",
				}}
			>
				Voltar ao início
			</button>
		</div>
	);
}
