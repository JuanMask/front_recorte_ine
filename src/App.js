/* import React, { useState, useRef } from "react";
import { recortarAll } from "./api";

export default function App() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const progressRef = useRef(null);

  // Animación de barra indeterminada (simula progreso mientras backend trabaja)
  function startProgressAnimation() {
    console.log("[ui] Iniciando animación de progreso");
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 8;
        const value = next >= 90 ? 90 : Math.round(next);
        console.debug("[ui] Progreso simulado:", value);
        return value;
      });
    }, 700);
  }

  function stopProgressAnimation() {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    setProgress(100);
    console.log("[ui] Animación de progreso detenida, progreso al 100%");
  }

  async function handleStartRecorte() {
    console.log("[ui] Usuario inició recorte");
    setMessage("");
    setRunning(true);
    startProgressAnimation();

    try {
      console.log("[ui] Llamando a recortarAll()");
      const result = await recortarAll();
      console.log("[ui] recortarAll() finalizó con resultado:", result);

      stopProgressAnimation();
      setMessage("Recortes finalizados, verificar en carpetas");

      // Si el backend devuelve detalles por id, los mostramos en consola
      if (result && typeof result === "object") {
        console.group("[ui] Detalle de resultado /recortar_all");
        console.log(result);
        console.groupEnd();
      }
    } catch (err) {
      stopProgressAnimation();
      const detail = err?.response?.data || err.message || String(err);
      console.error("[ui] Error durante recorte:", detail);
      setMessage(`Error durante el proceso: ${JSON.stringify(detail)}`);
    } finally {
      setRunning(false);
      setTimeout(() => setProgress(0), 1000);
      console.log("[ui] Proceso terminado (estado running=false)");
    }
  }

  return (
    <div className="container">
      <h1>Recorte de identificaciones</h1>

      <div className="card">
        <p>
          Presiona <strong>Iniciar recorte</strong> para procesar las imágenes desde el servidor.
        </p>

        <button
          className="primary"
          onClick={handleStartRecorte}
          disabled={running}
          aria-busy={running}
        >
          {running ? "Procesando..." : "Iniciar recorte"}
        </button>

        <div className="progress-wrapper" aria-hidden={!running}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {message && <div className="message">{message}</div>}
      </div>

      <footer className="footer">
        <small>
          Espera por favor...
          <code>{":)"}</code>
        </small>
      </footer>
    </div>
  );
}
 */



import React, { useState, useRef } from "react";
import { recortarAll } from "./api";

export default function App() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [rotTimeSec, setRotTimeSec] = useState(null);
  const [recTimeSec, setRecTimeSec] = useState(null);
  const [combinedTimeSec, setCombinedTimeSec] = useState(null);
  const progressRef = useRef(null);

  function startProgressAnimation() {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 8;
        return next >= 90 ? 90 : Math.round(next);
      });
    }, 700);
  }

  function stopProgressAnimation() {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    setProgress(100);
  }

  function formatSeconds(sec) {
    if (sec == null || isNaN(sec)) return "";
    const s = Math.round(sec);
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  async function handleStartRecorte() {
  setMessage("");
  setCombinedTimeSec(null);
  setRunning(true);
  startProgressAnimation();

  try {
    const result = await recortarAll();
    stopProgressAnimation();
    setMessage("Procesos finalizados. Revisa las carpetas de salida.");

    if (result && typeof result === "object") {
      // el backend devuelve total_seconds directamente
      const combined = result.total_seconds ?? null;
      if (combined != null) setCombinedTimeSec(combined);

      console.group("Resultado /recortar_all");
      console.log(result);
      console.groupEnd();
    }
  } catch (err) {
    stopProgressAnimation();
    const detail = err?.response?.data || err.message || String(err);
    setMessage(`Error durante el proceso: ${JSON.stringify(detail)}`);
    console.error("Error recortarAll:", detail);
  } finally {
    setRunning(false);
    setTimeout(() => setProgress(0), 1000);
  }
}


  return (
    <div className="container">
      <h1>Recorte de identificaciones</h1>

      <div className="card">
        <p>
          Presiona <strong>Iniciar recorte</strong> para procesar las imágenes desde el servidor.
        </p>

        <button
          className="primary"
          onClick={handleStartRecorte}
          disabled={running}
          aria-busy={running}
        >
          {running ? "Procesando..." : "Iniciar recorte"}
        </button>

        <div className="progress-wrapper" aria-hidden={!running}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>


        {message && <div className="message">{message}</div>}

        {/* <div style={{ marginTop: 12 }}>
          {rotTimeSec != null && (
            <div><strong>Tiempo rotación:</strong> {formatSeconds(rotTimeSec)} <small>({rotTimeSec}s)</small></div>
          )}
          {recTimeSec != null && (
            <div><strong>Tiempo recorte:</strong> {formatSeconds(recTimeSec)} <small>({recTimeSec}s)</small></div>
          )}
          {combinedTimeSec != null && (
            <div style={{ marginTop: 8 }}>
              <strong>Tiempo combinado:</strong> {formatSeconds(combinedTimeSec)} <small>({combinedTimeSec}s)</small>
            </div>
          )}
        </div> */}

        <div style={{ marginTop: 12 }}>
  {combinedTimeSec != null && (
    <div>
      <strong>Tiempo total (rotación + recorte):</strong> {formatSeconds(combinedTimeSec)} <small>({combinedTimeSec}s)</small>
    </div>
  )}
</div>

      </div>

      <footer className="footer">
        <small>Espera por favor... <code>{":)"}</code></small>
      </footer>
    </div>
  );
}
