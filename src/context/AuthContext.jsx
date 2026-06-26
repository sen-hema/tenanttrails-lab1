import { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check if already logged in on page load (cookie still valid)
  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {});
  }, []);

  async function login(email, password) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        error: data.error || "Invalid email or password",
      };
    setUser(data);
    return { success: true };
  }

  async function signup(name, email, password) {
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, initials }),
    });
    const data = await res.json();
    if (!res.ok)
      return { success: false, error: data.error || "Signup failed" };
    // After signup, fetch the user profile
    const me = await fetch(`${API}/api/auth/me`, { credentials: "include" });
    const meData = await me.json();
    setUser(meData);
    return { success: true };
  }

  async function logout() {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
