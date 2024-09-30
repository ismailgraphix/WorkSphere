"use client";
import { useEffect, useState } from "react";
import { Quicksand, Outfit } from 'next/font/google';

import DashboardHeader from "@/components/header";
import AdminSidebar from "./admin/_components/sidebar";
import HrSidebar from "./hr/_components/sidebar";
import Sidebar from "./employee/_components/sidebar";


const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
   
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    }
  }, []);

  const renderSidebar = () => {
    switch (userRole) {
      case "ADMIN":
        return <AdminSidebar />;
      case "HR":
        return <HrSidebar />;
      case "EMPLOYEE":
        return <Sidebar />;
      default:
        return null; 
    }
  };

  return (
    <html lang="en">
     
      <body className={`${quicksand.variable} ${outfit.variable} font-sans antialiased`}>
        <div className="flex h-screen">
          {renderSidebar() && <div>{renderSidebar()}</div>}
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
