"use client";

import { authenticateCustomer } from "@/actions";
import LoadingComponent from "@/app/components/_loading";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<
  | {
      id: string;
      email: string;
      fname: string;
      lname: string;
      admin: string;
    }
  | string
>("");

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<
    | {
        id: string;
        email: string;
        fname: string;
        lname: string;
        admin: string;
      }
    | null
    | string
  >(null);

  const pathname = usePathname();

  const authenticateUser = useCallback(async () => {
    try {
      const result = await authenticateCustomer();

      if (result?.ok) {
        const user = result.user;
        setCustomer({
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          id: user._id,
          admin: user.admin,
        });
      } else {
        setCustomer("Not logged in");
      }
    } catch (e) {
      console.log(e)
      throw new Error("Something went wrong. Please refresh");
    }
  }, []);

  useEffect(() => {
    authenticateUser();
  }, [pathname, authenticateUser]);

  if (!customer)
    return (
      <div>
        <LoadingComponent />
      </div>
    );

  return (
    <div>
      <AuthContext.Provider
        value={
          typeof customer !== "string"
            ? {
                fname: customer.fname,
                lname: customer.lname,
                email: customer.email,
                id: customer.id,
                admin: customer.admin,
              }
            : customer
        }
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export const useUserData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserData must be used within an AuthProvider...");
  }
  return context;
};
