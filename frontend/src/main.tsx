import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CreateArticle from './CreateArticle.tsx'
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router';
import ArticleList from './ArticleList.tsx';
import Article from './Article.tsx';
import Nav from './Nav.tsx';
import LoginSignup from "./LoginSignup.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

axios.defaults.baseURL = "http://localhost:3000/api";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="291303856700-00l6e781s6s41o8j0i9hs00jnf0j40tt.apps.googleusercontent.com">
            <BrowserRouter>
                <Nav />
                <Routes>
                    <Route path="/auth" element={<LoginSignup />} />
                    <Route path="/" element={<ArticleList />} />
                    <Route path="/create-article" element={<CreateArticle />} />
                    <Route path="/article/:id" element={<Article />} />
                </Routes>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </StrictMode>
);
