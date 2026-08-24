import Link from "next/link";

export default function MenuNotFound() {
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
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
      </svg>
      <div>
        <h1 className="text-2xl font-bold mb-2">Menü Bulunamadı</h1>
        <p className="text-slate-400 text-sm">
          Aradığınız menü mevcut değil veya kaldırılmış olabilir.
        </p>
      </div>
    </div>
  );
}
