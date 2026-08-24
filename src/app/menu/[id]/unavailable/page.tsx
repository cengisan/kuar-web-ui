export default function MenuUnavailablePage() {
  return (
    <div
      style={{ minHeight: "100svh", background: "#0f172a", color: "#f1f5f9" }}
      className="flex flex-col items-center justify-center gap-6 p-8 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
      <div>
        <h1 className="text-2xl font-bold mb-2">Menü Şu An Aktif Değil</h1>
        <p className="text-slate-400 text-sm">
          Bu menü geçici olarak devre dışı bırakılmış. Lütfen daha sonra tekrar deneyin.
        </p>
      </div>
    </div>
  );
}
