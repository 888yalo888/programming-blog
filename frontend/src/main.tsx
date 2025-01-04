import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CreateArticle from './CreateArticle.tsx'
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router';
import ArticleList from './ArticleList.tsx';
import Article from './Article.tsx';
import Nav from './Nav.tsx';

axios.defaults.baseURL = 'http://localhost:3000/api'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path='/' element={<ArticleList />} />
        <Route path='/create-article' element={<CreateArticle/>}/>
        <Route path='/article/:id' element={<Article/>} />
        
      </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
