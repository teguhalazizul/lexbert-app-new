import { useState } from "react";
import Navbar from "./components/Navbar";
import HomeSection from "./components/HomeSection";
import PrediksiSection from "./components/PrediksiSection";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-slate-50 text-navy-900 font-sans">
      <Navbar page={page} setPage={setPage} />

      <div className="flex-1">
        {page === "home" && <HomeSection setPage={setPage} />}
        {page === "predict" && <PrediksiSection />}
      </div>

      <Footer />
    </div>
  );
}

export default App;