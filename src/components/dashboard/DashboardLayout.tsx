import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../hooks";
import { logoutUser } from "../../features/auth/authSlice";
import Button from "../Button";

type DashboardLayoutProps = {
  sidebarItems: Array<{ label: string; href: string }>;
  headerTitle: string;
  children: ReactNode;
};

export default function DashboardLayout({
  sidebarItems,
  headerTitle,
  children,
}: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-200 bg-slate-900 text-slate-100">
          <div className="px-6 py-6 text-xl font-semibold">LMS</div>
          <nav className="space-y-2 px-4 py-3">
            {sidebarItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-slate-100 transition hover:bg-slate-800"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {headerTitle}
              </h1>
              {/* <p className="text-slate-500">Dashboard overview</p> */}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="md">
                Settings
              </Button>
              <Button variant="primary" size="md" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
