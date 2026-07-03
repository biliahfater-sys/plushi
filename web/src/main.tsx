import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App.tsx";
import { I18nProvider } from "./i18n/I18nProvider.tsx";
import { CartProvider } from "./store/CartProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <I18nProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </I18nProvider>
    </MotionConfig>
  </StrictMode>,
);
