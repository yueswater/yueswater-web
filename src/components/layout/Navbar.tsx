"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/features/theme/ThemeToggle";
import { UserProfileSidebar } from "@/components/features/auth/UserProfileSidebar";
import { SearchModal } from "@/components/features/search/SearchModal";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, LogIn } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navItems = [
    { name: "文章總覽", href: "/" },
    { name: "分類", href: "/categories" },
    { name: "標籤", href: "/tags" },
    { name: "關於", href: "/about" },
  ];

  const shouldHideNav = showUserMenu || isScrolled;

  return (
    <>
      <header
        className={`bg-base-100/95 fixed top-0 right-0 left-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "" : "border-b"
        } border-base-200`}
      >
        <div className="flex w-full flex-col">
          <div className="relative flex items-center justify-between px-6 py-4 transition-all duration-300 md:py-6">
            <div className="flex flex-1 justify-start">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="btn btn-ghost btn-circle btn-sm md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <Link href="/" className="group flex shrink-0 flex-col items-center gap-1">
              <div className="relative h-10 w-32 overflow-hidden md:h-14 md:w-48">
                <Image
                  src="/logo_lightTheme.png"
                  alt="Logo"
                  fill
                  className="logo-light object-contain transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <Image
                  src="/logo_darkTheme.png"
                  alt="Logo"
                  fill
                  className="logo-dark object-contain transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>

            <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
              <button
                ref={searchButtonRef}
                onClick={() => setIsSearchOpen(true)}
                className="btn btn-ghost btn-circle btn-sm md:btn-md hover:bg-base-200"
                aria-label="Search"
              >
                <Search className="text-base-content/70 h-5 w-5 md:h-6 md:w-6" />
              </button>

              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {user ? (
                <button
                  onClick={() => setShowUserMenu(true)}
                  className={`btn btn-ghost btn-circle avatar ml-1 transition-transform duration-300 ${
                    showUserMenu ? "ring-primary scale-110 rotate-12" : ""
                  }`}
                >
                  <div className="border-base-300 ring-offset-base-100 hover:ring-primary/50 h-9 w-9 rounded-full border ring-offset-2 transition-all md:h-10 md:w-10">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-primary btn-sm ml-2 rounded-full px-4 md:px-6"
                >
                  <LogIn className="h-5 w-5 md:hidden" />
                  <span className="hidden md:block">登入</span>
                </Link>
              )}
            </div>
          </div>

          <div
            className={`border-base-200 hidden justify-center overflow-hidden transition-all duration-500 ease-in-out md:flex ${
              shouldHideNav
                ? "max-h-0 border-none opacity-0"
                : "max-h-24 border-t py-4 opacity-100"
            }`}
          >
            <nav className="flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base-content/90 hover:text-primary group relative py-1 text-base font-bold tracking-widest uppercase transition-colors md:text-lg"
                >
                  {item.name}
                  <span className="bg-primary absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="h-[80px] md:h-[150px]" />

      <UserProfileSidebar isOpen={showUserMenu} onClose={() => setShowUserMenu(false)} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        triggerRef={searchButtonRef}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
}