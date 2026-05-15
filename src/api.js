import axios from "axios";

// Ajusta BASE_URL si tu backend corre en otra dirección/puerto
export const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function recortarAll(limit = null) {
  const url = `${BASE_URL}/recortar_all`;
  const form = new FormData();
  if (limit) form.append("limit", limit);

  console.log("[api] Iniciando petición POST a /recortar_all", { url, limit });

  try {
    const resp = await axios.post(url, form, {
      timeout: 0, // sin timeout para procesos largos
    });
    console.log("[api] Respuesta recibida de /recortar_all", resp.data);
    return resp.data;
  } catch (err) {
    // Normalizar error para logging
    const detail = err?.response?.data || err.message || String(err);
    console.error("[api] Error en /recortar_all", detail);
    throw err;
  }
}
