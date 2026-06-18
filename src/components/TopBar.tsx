"use client";

interface TopBarProps {
  title?: string;
  brandName?: string;
  brandSub?: string;
  userName?: string;
  userInitials?: string;
  locale?: string;
}

export default function TopBar({
  title = "Admin LMS",
  brandName = "VIION",
  brandSub = "Technology",
  userName = "Faisal Sheikh",
  userInitials = "FS",
  locale = "English",
}: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 xl:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            V
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-blue-600">{brandName}</span>
            <span className="text-xs text-slate-500">{brandSub}</span>
          </div>
          <div className="border-l border-slate-300 pl-4">
            <span className="text-sm font-semibold text-slate-900">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="text-slate-500">📅</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100" type="button">
              📋
            </button>
            <button className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100" type="button">
              ⊞
            </button>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {userInitials}
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-900">{userName}</div>
              </div>
            </div>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50" value={locale} onChange={() => {}}>
              <option>English</option>
              <option>Urdu</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
