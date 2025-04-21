import React from "react";
import { useTheme } from "../Context/ThemeContext";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const { toggleTheme, theme } = useTheme();

  return (
    <nav className="sticky top-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Home */}
        <div
  onClick={() => {
    // reset to dashboard
    window.location.reload(); // OR use a prop callback to reset app state
  }}
  className="cursor-pointer text-lg font-semibold text-blue-600 dark:text-white hover:underline"
>
  🏠 Home
</div>

        {/* Right: Auth + Theme Toggle */}
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-sm px-3 py-1 border rounded bg-gray-200 dark:bg-gray-700 dark:text-white">
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
          {!isLoggedIn ? (
            <>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Login</button>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded">Signup</button>
            </>
          ) : (
            <button onClick={onLogout} className="px-3 py-1 text-sm bg-red-600 text-white rounded">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
