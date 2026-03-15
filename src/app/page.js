"use client";
import { useState, useEffect } from "react";
import { Calculator, RefreshCcw, User, Users, Info, X } from "lucide-react";

export default function Home() {
  // --- STATE UTAMA ---
  const [poinPengurangan, setPoinPengurangan] = useState(2);
  const [poinLocked, setPoinLocked] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  
  const [maqros, setMaqros] = useState([
    { id: 1, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
    { id: 2, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
    { id: 3, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
  ]);

  const [hasilAkhir, setHasilAkhir] = useState(0);
  const [status, setStatus] = useState("REMIDI");
  const [activeTab, setActiveTab] = useState(1);

  // --- FUNGSI HITUNG ---
  const hitungRataMaqro = (m) => {
      const nilaiTarkib = Math.max(0, 100 - (m.salahTarkib * poinPengurangan));
      const nilaiMakna = Math.max(0, 100 - (m.salahMakna * poinPengurangan));
      const rataAmtsilati = ((parseFloat(m.amt1 || 0) + parseFloat(m.amt2 || 0) + parseFloat(m.amt3 || 0)) / 3);
      const total = nilaiTarkib + nilaiMakna + rataAmtsilati + parseFloat(m.nilaiMurod || 0) + parseFloat(m.nilaiFan || 0);
      return total / 5;
  };

  // --- EFFECT UTAMA ---
  useEffect(() => {
    const totalMaqro1 = hitungRataMaqro(maqros[0]);
    const totalMaqro2 = hitungRataMaqro(maqros[1]);
    const totalMaqro3 = hitungRataMaqro(maqros[2]);

    // Rumus Akhir: (M1 + M2 + M3) / 3 (KARENA PRESENTASI DIHAPUS)
    const totalSemua = totalMaqro1 + totalMaqro2 + totalMaqro3;
    const finalScore = totalSemua / 3;

    setHasilAkhir(finalScore);
    setStatus(finalScore >= 91 ? "LULUS" : "REMIDI");
  }, [maqros, poinPengurangan]);

  // --- FUNGSI UPDATE & RESET ---
  const updateMaqro = (index, field, value) => {
    const newMaqros = [...maqros];
    let cleanValue = value;
    if (field !== 'salahTarkib' && field !== 'salahMakna') {
       cleanValue = value < 0 ? 0 : value > 100 ? 100 : value;
    } else {
       cleanValue = value < 0 ? 0 : value;
    }
    newMaqros[index][field] = cleanValue;
    setMaqros(newMaqros);
  };

  const handleReset = () => {
    if (confirm("Reset semua data nilai?")) {
      setMaqros([
        { id: 1, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
        { id: 2, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
        { id: 3, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
      ]);
      setActiveTab(1);
      setPoinLocked(false);
      setShowDetail(false);
    }
  };

  const handlePoinChange = (poin) => {
    if (!poinLocked) {
      setPoinPengurangan(poin);
      setPoinLocked(true);
    }
  };

  const handleNextTab = () => {
    if (activeTab < 3) setActiveTab(activeTab + 1);
  };

  // --- KOMPONEN UI ---
  const InputScore = ({ label, val, onChange, icon }) => (
    <div className="mb-3">
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </label>
      <input
        type="number"
        value={val || ""}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-1.5 p-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 text-gray-900 text-lg font-semibold placeholder-gray-300 transition"
        placeholder="0"
      />
    </div>
  );

  const InputError = ({ label, val, onChange }) => (
    <div className="mb-3 bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold text-red-800">{label}</label>
        <span className="text-xs font-mono bg-white px-2.5 py-1 rounded-full border border-red-200 text-red-600 shadow-sm">
          Nilai: {Math.max(0, 100 - (val * poinPengurangan))}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onChange(val - 1)}
          className="w-11 h-11 flex items-center justify-center bg-white border-2 border-red-200 rounded-xl text-red-600 font-bold text-xl hover:bg-red-50 active:scale-95 shadow-sm transition"
        >−</button>
        <input
          type="number"
          value={val}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-full text-center p-2 bg-white rounded-lg font-bold text-2xl text-gray-800 outline-none border-2 border-transparent focus:border-red-300"
        />
        <button 
          onClick={() => onChange(val + 1)}
          className="w-11 h-11 flex items-center justify-center bg-red-600 rounded-xl text-white font-bold text-xl hover:bg-red-700 active:scale-95 shadow-md transition"
        >+</button>
      </div>
    </div>
  );

  // --- MODAL DETAIL ---
  const DetailModal = () => {
    if (!showDetail) return null;
    const m1 = hitungRataMaqro(maqros[0]);
    const m2 = hitungRataMaqro(maqros[1]);
    const m3 = hitungRataMaqro(maqros[2]);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Info size={18} className="text-blue-600"/> 
              Rincian Perhitungan
            </h3>
            <button onClick={() => setShowDetail(false)} className="p-1 hover:bg-gray-200 rounded-full">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="text-gray-600 font-medium">Rata-rata Maqro 1</span>
                <span className="font-bold text-blue-700">{m1.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="text-gray-600 font-medium">Rata-rata Maqro 2</span>
                <span className="font-bold text-blue-700">{m2.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="text-gray-600 font-medium">Rata-rata Maqro 3</span>
                <span className="font-bold text-blue-700">{m3.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-3 mt-2">
              <p className="text-xs text-gray-500 mb-1 text-center font-mono">
                ({m1.toFixed(2)} + {m2.toFixed(2)} + {m3.toFixed(2)}) ÷ 3
              </p>
              <div className="flex justify-between items-end bg-gray-800 text-white p-3 rounded-xl mt-2">
                <span className="text-sm font-medium opacity-80">TOTAL SKOR</span>
                <span className="text-2xl font-bold">{hasilAkhir.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowDetail(false)}
              className="w-full py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-28 font-sans">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Calculator size={22} strokeWidth={2.5} />
            Kalkulator Munaqosah
          </h1>
          <button onClick={handleReset} className="p-2.5 bg-blue-500 rounded-full hover:bg-blue-400 active:rotate-180 transition-all duration-300 shadow-lg">
            <RefreshCcw size={18} />
          </button>
        </div>

        {/* Setting Poin */}
        <div className="bg-blue-800/40 p-1.5 rounded-xl flex gap-1.5 text-xs backdrop-blur-sm">
          {[1, 2, 4].map((poin) => (
            <button
              key={poin}
              onClick={() => handlePoinChange(poin)}
              disabled={poinLocked}
              className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${
                poinPengurangan === poin 
                  ? "bg-white text-blue-700 shadow-md scale-105" 
                  : poinLocked ? "text-blue-300 opacity-50 cursor-not-allowed" : "text-blue-100 hover:bg-blue-700/50 cursor-pointer"
              }`}
            >
              Salah −{poin}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-5">
        {/* TAB NAVIGATION */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 px-5 py-2.5 rounded-xl whitespace-nowrap font-bold text-sm transition-all ${
                activeTab === i 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105" 
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-300"
              }`}
            >
              Maqro {i}
            </button>
          ))}
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Maqro {activeTab}</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-semibold">Nilai 0-100</span>
            </div>
            
            {/* PENGUJI 1 */}
            <div className="mb-6 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 p-5 rounded-2xl border-2 border-blue-300 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white"><User size={20} /></div>
                 <div><h3 className="font-bold text-blue-900">PENGUJI 1</h3><p className="text-xs text-blue-600">Bacaan • Tarkib • Amtsilati</p></div>
              </div>
              <div className="space-y-3">
                <InputError label="Kesalahan Tarkib" val={maqros[activeTab-1].salahTarkib} onChange={(v) => updateMaqro(activeTab-1, 'salahTarkib', v)} />
                <InputError label="Kesalahan Bacaan" val={maqros[activeTab-1].salahMakna} onChange={(v) => updateMaqro(activeTab-1, 'salahMakna', v)} />
              </div>
              <div className="mt-4 bg-white p-4 rounded-xl border-2 border-blue-300 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-blue-900">Amtsilati</label>
                  <span className="text-xs font-mono bg-blue-600 text-white px-3 py-1 rounded-full">
                    Avg: {(( (maqros[activeTab-1].amt1||0) + (maqros[activeTab-1].amt2||0) + (maqros[activeTab-1].amt3||0) ) / 3).toFixed(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <div key={num}>
                      <span className="text-[10px] text-blue-600 font-bold uppercase block mb-1.5 text-center">P{num}</span>
                      <input type="number" className="w-full p-2.5 text-center rounded-lg border-2 border-blue-200 font-bold text-blue-900 focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50/30" placeholder="0"
                        value={maqros[activeTab-1][`amt${num}`] || ""} onChange={(e) => updateMaqro(activeTab-1, `amt${num}`, parseFloat(e.target.value))} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PENGUJI 2 */}
            <div className="bg-gradient-to-br from-green-50 via-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-300 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white"><Users size={20} /></div>
                 <div><h3 className="font-bold text-green-900">PENGUJI 2</h3><p className="text-xs text-green-600">Fokus Fan & Murod</p></div>
              </div>
              <div className="space-y-3">
                <InputScore label="Nilai Murod" val={maqros[activeTab-1].nilaiMurod} onChange={(v) => updateMaqro(activeTab-1, 'nilaiMurod', v)} />
                <InputScore label="Nilai Fan" val={maqros[activeTab-1].nilaiFan} onChange={(v) => updateMaqro(activeTab-1, 'nilaiFan', v)} />
              </div>
            </div>
            
            {activeTab < 3 && (
              <button onClick={handleNextTab} className="w-full mt-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2">
                Lanjut ke Maqro {activeTab + 1}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER HASIL */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
        <div className={`rounded-2xl shadow-2xl transition-all duration-500 ${
          status === "LULUS" ? "bg-gradient-to-r from-green-600 to-green-700" : "bg-gradient-to-r from-red-600 to-red-700"
        }`}>
          <div className="p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[9px] font-bold opacity-80 uppercase tracking-wider mb-0.5">Nilai Akhir</p>
                <span className="text-3xl font-black tracking-tight">{hasilAkhir.toFixed(2)}</span>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div>
                <span className="text-[9px] font-semibold opacity-80 uppercase tracking-wider block mb-1">KKM: 91</span>
                <div className={`px-4 py-1 rounded-lg font-black text-sm shadow-lg ${status === "LULUS" ? "bg-white text-green-700" : "bg-white text-red-700"}`}>{status}</div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowDetail(true)}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/20 hover:bg-white/30 transition active:scale-95"
            >
              <Info size={20} className="mb-0.5" />
              <span className="text-[9px] font-bold">Detail</span>
            </button>
          </div>
        </div>
      </div>
      
      <DetailModal />
    </div>
  );
}