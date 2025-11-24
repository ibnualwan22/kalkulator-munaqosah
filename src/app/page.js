"use client";
import { useState, useEffect } from "react";
import { Calculator, RefreshCcw, User, Users } from "lucide-react";

export default function Home() {
  // --- STATE UTAMA ---
  const [poinPengurangan, setPoinPengurangan] = useState(2);
  const [poinLocked, setPoinLocked] = useState(false);
  
  const [maqros, setMaqros] = useState([
    { id: 1, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
    { id: 2, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
    { id: 3, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
  ]);

  const [presentasi, setPresentasi] = useState({ penguji1: 0, penguji2: 0 });
  const [hasilAkhir, setHasilAkhir] = useState(0);
  const [status, setStatus] = useState("REMIDI");
  const [activeTab, setActiveTab] = useState(1);

  // --- RUMUS PERHITUNGAN (TIDAK DIUBAH) ---
  useEffect(() => {
    const rataRataMaqros = maqros.map((m) => {
      // 1. Hitung Nilai Tarkib & Makna (Tidak boleh minus)
      const nilaiTarkib = Math.max(0, 100 - (m.salahTarkib * poinPengurangan));
      const nilaiMakna = Math.max(0, 100 - (m.salahMakna * poinPengurangan));
      
      // 2. Hitung Rata-rata Amtsilati dari 3 Pertanyaan
      const rataAmtsilati = (
        (parseFloat(m.amt1 || 0) + 
         parseFloat(m.amt2 || 0) + 
         parseFloat(m.amt3 || 0)) / 3
      );

      // 3. Rata-rata 5 komponen Maqro
      const totalKomponen = 
        nilaiTarkib + 
        nilaiMakna + 
        rataAmtsilati + 
        parseFloat(m.nilaiMurod || 0) + 
        parseFloat(m.nilaiFan || 0);
        
      return totalKomponen / 5;
    });

    // Hitung Rata-rata Presentasi
    const rataPresentasi = (parseFloat(presentasi.penguji1 || 0) + parseFloat(presentasi.penguji2 || 0)) / 2;

    // Hitung Nilai Akhir (Dibagi 4)
    const totalSemua = rataRataMaqros.reduce((a, b) => a + b, 0) + rataPresentasi;
    const finalScore = totalSemua / 4;

    setHasilAkhir(finalScore);
    setStatus(finalScore >= 91 ? "LULUS" : "REMIDI");

  }, [maqros, presentasi, poinPengurangan]);

  // --- FUNGSI UPDATE ---
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

  const updatePresentasi = (field, value) => {
    setPresentasi({ ...presentasi, [field]: value < 0 ? 0 : value > 100 ? 100 : value });
  };

  const handleReset = () => {
    if (confirm("Reset semua data nilai?")) {
      setMaqros([
        { id: 1, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
        { id: 2, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
        { id: 3, salahTarkib: 0, salahMakna: 0, amt1: 0, amt2: 0, amt3: 0, nilaiMurod: 0, nilaiFan: 0 },
      ]);
      setPresentasi({ penguji1: 0, penguji2: 0 });
      setActiveTab(1);
      setPoinLocked(false); // Unlock poin saat reset
    }
  };

  const handlePoinChange = (poin) => {
    if (!poinLocked) {
      setPoinPengurangan(poin);
      setPoinLocked(true); // Lock setelah dipilih
    }
  };

  const handleNextTab = () => {
    if (activeTab < 4) {
      setActiveTab(activeTab + 1);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24 font-sans">
      {/* HEADER - Sticky dihapus agar tidak menghalangi layar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Calculator size={22} strokeWidth={2.5} />
            Kalkulator Munaqosah
          </h1>
          <button 
            onClick={handleReset} 
            className="p-2.5 bg-blue-500 rounded-full hover:bg-blue-400 active:rotate-180 transition-all duration-300 shadow-lg"
          >
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
                  : poinLocked
                  ? "text-blue-300 opacity-50 cursor-not-allowed"
                  : "text-blue-100 hover:bg-blue-700/50 cursor-pointer"
              }`}
            >
              Salah −{poin}
            </button>
          ))}
        </div>
        {poinLocked && (
          <p className="text-xs text-blue-100 mt-2 text-center font-medium">
            ✓ Poin terkunci. Reset untuk mengubah.
          </p>
        )}
      </div>

      <div className="max-w-md mx-auto px-4 space-y-5">
        
        {/* TAB NAVIGATION */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-bold text-sm transition-all ${
                activeTab === i 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105" 
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-300"
              }`}
            >
              Maqro {i}
            </button>
          ))}
          <button
            onClick={() => setActiveTab(4)}
            className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-bold text-sm transition-all ${
              activeTab === 4
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105" 
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300"
            }`}
          >
            Presentasi
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          
          {/* ----- LOGIKA MAQRO 1-3 ----- */}
          {activeTab <= 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">
                  Penilaian Maqro {activeTab}
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-semibold">
                  Nilai 0-100
                </span>
              </div>

              {/* SECTION PENGUJI 1 */}
              <div className="mb-6 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 p-5 rounded-2xl border-2 border-blue-300 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md">
                    <User size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-base">PENGUJI 1</h3>
                    <p className="text-xs text-blue-600 font-medium">Bacaan • Tarkib • Amtsilati</p>
                  </div>
                </div>

                {/* Input Kesalahan */}
                <div className="space-y-3">
                  <InputError 
                    label="Kesalahan Tarkib" 
                    val={maqros[activeTab-1].salahTarkib} 
                    onChange={(v) => updateMaqro(activeTab-1, 'salahTarkib', v)} 
                  />
                  <InputError 
                    label="Kesalahan Bacaan/Makna" 
                    val={maqros[activeTab-1].salahMakna} 
                    onChange={(v) => updateMaqro(activeTab-1, 'salahMakna', v)} 
                  />
                </div>

                {/* INPUT AMTSILATI */}
                <div className="mt-4 bg-white p-4 rounded-xl border-2 border-blue-300 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-blue-900">Pertanyaan Amtsilati</label>
                    <span className="text-xs font-mono bg-blue-600 text-white px-3 py-1 rounded-full shadow-sm">
                      Rata-rata: {(( (maqros[activeTab-1].amt1||0) + (maqros[activeTab-1].amt2||0) + (maqros[activeTab-1].amt3||0) ) / 3).toFixed(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((num) => (
                      <div key={num}>
                        <span className="text-[10px] text-blue-600 font-bold uppercase block mb-1.5 text-center">
                          P{num}
                        </span>
                        <input 
                          type="number" 
                          className="w-full p-2.5 text-center rounded-lg border-2 border-blue-200 font-bold text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-blue-50/30 transition"
                          placeholder="0"
                          value={maqros[activeTab-1][`amt${num}`] || ""}
                          onChange={(e) => updateMaqro(activeTab-1, `amt${num}`, parseFloat(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION PENGUJI 2 */}
              <div className="bg-gradient-to-br from-green-50 via-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-300 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md">
                    <Users size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 text-base">PENGUJI 2</h3>
                    <p className="text-xs text-green-600 font-medium">Fokus Fan & Murod</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <InputScore 
                    label="Nilai Murod" 
                    val={maqros[activeTab-1].nilaiMurod} 
                    onChange={(v) => updateMaqro(activeTab-1, 'nilaiMurod', v)} 
                  />
                  <InputScore 
                    label="Nilai Fan" 
                    val={maqros[activeTab-1].nilaiFan} 
                    onChange={(v) => updateMaqro(activeTab-1, 'nilaiFan', v)} 
                  />
                </div>
              </div>

              {/* TOMBOL LANJUT */}
              <button
                onClick={handleNextTab}
                className="w-full mt-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {activeTab === 3 ? "Lanjut ke Presentasi" : `Lanjut ke Maqro ${activeTab + 1}`}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}

          {/* ----- LOGIKA PRESENTASI ----- */}
          {activeTab === 4 && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-100">
                 <h2 className="text-xl font-bold text-purple-800">
                  Presentasi Fiqh
                 </h2>
               </div>
               
               <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-50 p-5 rounded-2xl border-2 border-purple-300 shadow-md">
                  <InputScore 
                    label="Nilai Penguji 1" 
                    val={presentasi.penguji1} 
                    onChange={(v) => updatePresentasi('penguji1', v)} 
                  />
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-50 p-5 rounded-2xl border-2 border-purple-300 shadow-md">
                  <InputScore 
                    label="Nilai Penguji 2" 
                    val={presentasi.penguji2} 
                    onChange={(v) => updatePresentasi('penguji2', v)} 
                  />
                </div>
               </div>
               
               <div className="mt-6 p-6 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl text-center border-2 border-purple-300 shadow-lg">
                 <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">Rata-rata Presentasi</p>
                 <p className="text-5xl font-black text-purple-700">
                   {((parseFloat(presentasi.penguji1||0)+parseFloat(presentasi.penguji2||0))/2).toFixed(1)}
                 </p>
               </div>
             </div>
          )}

        </div>
      </div>

      {/* CARD HASIL - Compact & Collapsible */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
        <div className={`rounded-2xl shadow-2xl transition-all duration-500 ${
          status === "LULUS" ? "bg-gradient-to-r from-green-600 to-green-700" : "bg-gradient-to-r from-red-600 to-red-700"
        }`}>
          <div className="p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-[9px] font-bold opacity-80 uppercase tracking-wider mb-0.5">Nilai Akhir</p>
                <span className="text-3xl font-black tracking-tight">
                  {hasilAkhir.toFixed(2)}
                </span>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div>
                <span className="text-[9px] font-semibold opacity-80 uppercase tracking-wider block mb-1">
                  KKM: 91
                </span>
                <div className={`px-4 py-1 rounded-lg font-black text-sm shadow-lg ${
                  status === "LULUS" 
                    ? "bg-white text-green-700" 
                    : "bg-white text-red-700"
                }`}>
                  {status}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Calculator size={24} className="opacity-60" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}