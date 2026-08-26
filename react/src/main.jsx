import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Orcamento from "./Orcamento";

const elemento = document.getElementById("bomsistema-catalogo");

const pagina = elemento.dataset.pagina;

ReactDOM.createRoot(elemento).render(
  <React.StrictMode>
    {pagina === "orcamento" ? <Orcamento /> : <App />}
  </React.StrictMode>,
);
