import { useNavigate } from "react-router-dom";

export function NotFound() {
	const navigate = useNavigate();

	return (
		<div style={{ textAlign: "center", marginTop: 100 }}>
			<img
				src='/assets/404.svg'
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
