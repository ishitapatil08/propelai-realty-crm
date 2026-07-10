import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Tenant, Lead, Role } from "./types";
import { seedTenants, seedUsers, seedLeads } from "./mock-data";

type AuthContextType = {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  tenants: Tenant[];
  users: User[];
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("propel_auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem("propel_tenants");
    return saved ? JSON.parse(saved) : seedTenants;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("propel_users");
    return saved ? JSON.parse(saved) : seedUsers;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem("propel_leads");
    return saved ? JSON.parse(saved) : seedLeads;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("propel_auth_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("propel_auth_user");
    }
  }, [currentUser]);

  useEffect(() => { localStorage.setItem("propel_tenants", JSON.stringify(tenants)); }, [tenants]);
  useEffect(() => { localStorage.setItem("propel_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("propel_leads", JSON.stringify(leads)); }, [leads]);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, tenants, users, leads, setLeads, setTenants, setUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
