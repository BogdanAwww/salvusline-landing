import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Dogs from "./pages/Dogs";
import DogFormPage from "./pages/DogFormPage";
import HallOfFame from "./pages/HallOfFame";
import HofFormPage from "./pages/HofFormPage";
import ContentPage from "./pages/ContentPage";
import Puppies from "./pages/Puppies";
import PuppyFormPage from "./pages/PuppyFormPage";
import Messages from "./pages/Messages";
import BlogPosts from "./pages/BlogPosts";
import BlogFormPage from "./pages/BlogFormPage";

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Loading — wait for session check before rendering anything
  if (session === undefined) return null;

  if (!session) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/dogs/new" element={<DogFormPage />} />
          <Route path="/dogs/:id" element={<DogFormPage />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/hall-of-fame/new" element={<HofFormPage />} />
          <Route path="/hall-of-fame/:id" element={<HofFormPage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/puppies" element={<Puppies />} />
          <Route path="/puppies/new" element={<PuppyFormPage />} />
          <Route path="/puppies/:id" element={<PuppyFormPage />} />
          <Route path="/blog" element={<BlogPosts />} />
          <Route path="/blog/new" element={<BlogFormPage />} />
          <Route path="/blog/:id" element={<BlogFormPage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
