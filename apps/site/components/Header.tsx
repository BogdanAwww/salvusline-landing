"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SiteConfig } from "@salvus/db";

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" fill="currentColor" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69C19.4776 6.69 19.3656 6.6789 19.2551 6.657C17.8843 6.41668 16.6863 5.56147 16.0148 4.33596C15.5205 3.42972 15.3331 2.38683 15.4813 1.36719H12.1813V15.0672C12.1813 15.4815 12.1813 15.8911 12.1517 16.2912C12.0515 17.6185 11.0053 18.6672 9.67126 18.6672C8.89835 18.6672 8.17699 18.3767 7.63516 17.8892C6.75516 17.1014 6.35516 15.8672 6.67126 14.6672C7.10127 13.0672 8.55126 11.9672 10.1813 11.9672C10.4516 11.9672 10.7173 11.9967 10.9764 12.0508V8.66719C10.7173 8.63344 10.4516 8.61719 10.1813 8.61719C6.68126 8.61719 3.83126 11.4672 3.83126 14.9672C3.83126 16.6172 4.46126 18.1172 5.49126 19.2472C6.54126 20.3972 8.02126 21.0172 9.67126 21.0172C13.1713 21.0172 15.5313 18.4672 15.5313 14.9672V9.13719C16.6913 9.95719 18.1013 10.4272 19.59 10.4472V6.69Z" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="currentColor" />
  </svg>
);

interface HeaderProps {
  siteConfig?: Pick<SiteConfig, "title" | "instagram_url" | "tiktok_url" | "facebook_url" | "logo_url"> | null;
}

export function Header({ siteConfig }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const instagram = siteConfig?.instagram_url ?? "https://www.instagram.com/kateryna_salvusline/";
  const tiktok = siteConfig?.tiktok_url ?? "https://www.tiktok.com/@bullterrier_place";
  const facebook = siteConfig?.facebook_url ?? "https://www.facebook.com/kate.kosovets";

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const socialLinks = [
    { href: instagram, label: "Instagram", icon: <InstagramIcon /> },
    { href: tiktok, label: "TikTok", icon: <TikTokIcon /> },
    { href: facebook, label: "Facebook", icon: <FacebookIcon /> },
  ];

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo">
              <Link href="/">
                <Image src="/assets/logo.svg" alt="Salvusline Logo" width={60} height={60} priority />
              </Link>
            </div>
            <nav className="nav">
              <Link href="/#about" className="nav-link">About US</Link>
              <Link href="/our-dogs" className="nav-link">Our Dogs</Link>
              <Link href="/hall-of-fame" className="nav-link">Hall of Fame</Link>
            </nav>
          </div>
          <div className="header-right">
            <div className="social-links">
              {socialLinks.map(({ href, label, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={label}>
                  {icon}
                </a>
              ))}
            </div>
            <button className="menu-toggle" aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
        <div className="mobile-menu-header">
          <div className="logo">
            <Image src="/assets/logo.svg" alt="Salvusline Logo" width={40} height={40} />
          </div>
          <button className="menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <nav className="mobile-nav">
          <Link href="/#about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About US</Link>
          <Link href="/our-dogs" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Our Dogs</Link>
          <Link href="/hall-of-fame" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Hall of Fame</Link>
        </nav>
        <div className="mobile-social">
          {socialLinks.map(({ href, label, icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="mobile-social-link">
              {icon}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
