import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import useAPI from "../hooks/useAPI";

export function Redirect() {
	const hasRun = useRef(false);
	const { httpGet } = useAPI();
	const navigate = useNavigate();
	const { slug } = useParams();

	useEffect(() => {
		async function buscarUrlOriginal() {
			if (hasRun.current) return;
			hasRun.current = true;
			try {
				const data = await httpGet(`resolve/${slug}`);

				if (data?.originalUrl) {
					window.location.href = data.originalUrl;
				} else {
					navigate("/404");
				}
			} catch (err) {
				navigate("/404");
			}
		}

		buscarUrlOriginal();
	}, [slug, navigate]);

	return (
		<p style={{ textAlign: "center", marginTop: 40 }}>Redirecionando...</p>
	);
}
