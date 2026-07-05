function Footer() {
  return (
    <footer className="text-center text-slate-400 text-sm py-10 px-5 sm:px-6 bg-navy-950 border-t border-navy-800">
      <div className="max-w-4xl mx-auto">
        <div className="w-12 h-0.5 bg-gold-500/30 mx-auto mb-4" />
        <p className="text-xs tracking-wider">
          Proyek Riset NLP · Klasifikasi Putusan Pidana Khusus dengan IndoBERT
        </p>
        <p className="text-[10px] text-slate-500 mt-2">
          © {new Date().getFullYear()} LexBERT · Dibangun dengan ❤️ untuk keadilan
        </p>
      </div>
    </footer>
  );
}

export default Footer;