function Navbar({ page, setPage }) {
  const tabs = [
    { id: "home", label: "Beranda" },
    { id: "predict", label: "Prediksi" },
  ];

  return (
    <div className="sticky top-0 z-30 bg-navy-950/95 backdrop-blur-md border-b border-navy-700 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2.5 font-serif font-semibold text-white text-lg shrink-0 group"
        >
          <span className="w-9 h-9 rounded-full border-2 border-gold-500 flex items-center justify-center text-gold-400 shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-glow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.25-7 9.75C8 19.25 5 15.5 5 11V6l7-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L14.8 10" />
            </svg>
          </span>
          <span className="hidden xs:inline bg-gradient-to-r from-white to-gold-400 bg-clip-text text-transparent">LexBERT</span>
        </button>

        <div className="flex gap-1 bg-navy-900 p-1 rounded-full border border-navy-700 overflow-x-auto max-w-full scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setPage(t.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-[13px] sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                page === t.id
                  ? "bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/30 scale-105"
                  : "text-slate-300 hover:text-white hover:bg-navy-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;