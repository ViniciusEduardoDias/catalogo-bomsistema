import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Orcamento from "./Orcamento";
import ProductShowcase from "./components/ProductShowcase";

const elemento = document.getElementById("bomsistema-catalogo");

if (elemento) {
  const pagina = elemento.dataset.pagina;

  let componente = null;

  if (pagina === "catalogo") {
    componente = <App />;
  } else if (pagina === "orcamento") {
    componente = <Orcamento />;
  } else if (pagina === "produtos") {
    componente = (
      <ProductShowcase
        categoria={elemento.dataset.categoria}
        modo={elemento.dataset.modo || "grid"}
      />
    );
  }

  if (componente) {
    ReactDOM.createRoot(elemento).render(
      <React.StrictMode>{componente}</React.StrictMode>,
    );
  }
}
