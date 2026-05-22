import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';
import AllPosts from '../pages/AllPosts';
import PostDetail from '../pages/PostDetail';
import WritePost from '../pages/WritePost';
import EditPost from '../pages/EditPost';
import Login from '../pages/Login';
import TagPosts from '../pages/TagPosts';
import SearchResults from '../pages/SearchResults';

// PrivateRoute to protect write and edit pages
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/all" element={<AllPosts />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tags/:name" element={<TagPosts />} />
      <Route path="/search" element={<SearchResults />} />
      
      <Route 
        path="/write" 
        element={
          <PrivateRoute>
            <WritePost />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/edit/:id" 
        element={
          <PrivateRoute>
            <EditPost />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
