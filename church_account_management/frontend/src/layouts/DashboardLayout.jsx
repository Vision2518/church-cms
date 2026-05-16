import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Church,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sun,
  Users,
  X
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Offerings", href: "/offerings", icon: CreditCard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings }
];

const pageTitles = {
  "/dashboard": "Financial Overview",
  "/offerings": "Offerings",
  "/members": "Members",
  "/settings": "Settings"
};

const classNames = (...classes) => classes.filter(Boolean).join(" ");

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedTheme = window.localStorage.getItem("cms-theme");
    if (storedTheme) {
      return storedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const pageTitle = useMemo(
    () => pageTitles[location.pathname] || "Church CMS",
    [location.pathname]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("cms-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const sidebar = (
    <aside
      className={classNames(
        "flex h-full flex-col border-r border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100",
        sidebarCollapsed ? "lg:w-20" : "lg:w-72",
        "w-72"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <NavLink to="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
            <Church size={22} aria-hidden="true" />
          </span>
          {!sidebarCollapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-wide">
                Grace CMS
              </span>
              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                Church operations
              </span>
            </span>
          )}
        </NavLink>

        <button
          type="button"
          className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={19} aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              title={sidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                classNames(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  sidebarCollapsed && "lg:justify-center",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                )
              }
            >
              <Icon size={20} className="shrink-0" aria-hidden="true" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <div
          className={classNames(
            "rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10",
            sidebarCollapsed && "lg:hidden"
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            May Stewardship
          </p>
          <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">
            84% of monthly goal
          </p>
          <div className="mt-3 h-2 rounded-full bg-emerald-100 dark:bg-emerald-950">
            <div className="h-2 w-[84%] rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div
        className={classNames(
          "fixed inset-0 z-40 bg-slate-950/50 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div
        className={classNames(
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </div>

      <div
        className={classNames(
          "min-h-screen transition-[padding] duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 lg:hidden dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={21} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="hidden size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 lg:grid dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              onClick={() => setSidebarCollapsed((value) => !value)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={21} aria-hidden="true" />
              ) : (
                <PanelLeftClose size={21} aria-hidden="true" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Church Management System
              </p>
              <h1 className="truncate text-base font-bold sm:text-lg">
                {pageTitle}
              </h1>
            </div>

            <div className="hidden w-full max-w-sm items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 md:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                className="ml-2 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Search members, offerings, ministries"
              />
            </div>

            <button
              type="button"
              className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              onClick={() => setDarkMode((value) => !value)}
              aria-label={darkMode ? "Use light theme" : "Use dark theme"}
            >
              {darkMode ? (
                <Sun size={20} aria-hidden="true" />
              ) : (
                <Moon size={20} aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              className="relative grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="View notifications"
            >
              <Bell size={20} aria-hidden="true" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
            </button>

            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-xs font-bold text-white dark:bg-indigo-500">
                  GA
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate text-sm font-semibold">
                    Grace Admin
                  </span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                    Treasurer
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className="hidden text-slate-400 sm:block"
                  aria-hidden="true"
                />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900"
                  role="menu"
                >
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    role="menuitem"
                  >
                    <Settings size={17} aria-hidden="true" />
                    Account settings
                  </NavLink>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    role="menuitem"
                  >
                    <LogOut size={17} aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
