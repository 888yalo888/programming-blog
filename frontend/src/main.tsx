import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CreateArticle from './pages/CreateArticle.tsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import ArticleList from './pages/ArticleList.tsx';
import Article from './pages/Article.tsx';
import Nav from './components/Nav.tsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProfileContextProvider } from "./context/ProfileContext";

const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProfileContextProvider>
      <GoogleOAuthProvider clientId={clientId!}>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/article/:id" element={<Article />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ProfileContextProvider>
  </StrictMode>
);
