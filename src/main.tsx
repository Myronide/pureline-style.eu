import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Docs } from "./pages/Docs";
import { Editor } from "./pages/Editor";
import { Home } from "./pages/Home";
import { Rules } from "./pages/Rules";
import { LocaleProvider } from "./i18n/context";
import { NotFound } from "./pages/NotFound";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="docs/*" element={<Docs />} />
          <Route path="rules" element={<Rules />} />
          <Route path="editor" element={<Editor />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </LocaleProvider>
  </StrictMode>,
);
