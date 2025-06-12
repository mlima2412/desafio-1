import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Redirect() {
	const { slug } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		async function buscarUrlOriginal() {
			try {
				console.log("Buscando URL original para o slug:", slug);
				const res = await fetch(`https://sua-api.com/${slug}`);
				const data = await res.json();

				if (data?.url) {
					window.location.href = data.url;
				} else {
					navigate("/404");
				}
			} catch (err) {
				console.log("Erro ao buscar URL original para o slug:", slug);
				navigate("/404");
			}
		}

		buscarUrlOriginal();
	}, [slug, navigate]);

	return (
		<p style={{ textAlign: "center", marginTop: 40 }}>Redirecionando...</p>
	);
}
