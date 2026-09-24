"use client";
import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";
import type { SessionPlan } from "./practice";

const SessionContext = createContext<{ session: SessionPlan | null; setSession: Dispatch<SetStateAction<SessionPlan | null>> } | null>(null);
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionPlan | null>(null);
  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
}
export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("SessionProvider is required");
  return value;
}
