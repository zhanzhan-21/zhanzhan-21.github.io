import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理后台 - 个人博客",
  description: "博客管理后台",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-slate-50 min-h-screen">
      {children}
    </div>
  );
} 