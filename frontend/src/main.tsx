import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CreateArticle from './CreateArticle.tsx'
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router';
import ArticleList from './ArticleList.tsx';
import Article from './Article.tsx';
import Nav from './Nav.tsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProfileContextProvider } from '../context/ProfileContext'

axios.defaults.baseURL = "http://localhost:3000/api";
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
