'use client';

import React, { useState } from 'react';
import { Plus, X, Upload, FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { submitLaporan, submitLaporanBatch } from '@/app/actions/warga';

type Tab = 'manual' | 'excel';

export default function ManualReportButton({ kecamatanOptions }: { kecamatanOptions: {label: string, value: string}[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('manual');
  
  // Manual State
  const [kecamatan, setKecamatan] = useState('');
  const [gejala, setGejala] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Excel State
  const [parsedData, setParsedData] = useState<{kecamatan: string, gejala: string}[]>([]);
  const [fileName, setFileName] = useState('');

  const resetState = () => {
    setKecamatan('');
    setGejala('');
    setParsedData([]);
    setFileName('');
    setSuccessMsg('');
    setErrorMsg('');
  };

  const closeAndReset = () => {
    setIsOpen(false);
    resetState();
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ kecamatan: "Genuk", gejala: "Demam dan Gatal" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Laporan");
    XLSX.writeFile(wb, "template_laporan.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setSuccessMsg('');
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<{kecamatan: string, gejala: string}>(ws);
        
        // Basic validation
        const validData = data.filter(d => d.kecamatan && d.gejala);
        setParsedData(validData);
        
        if (validData.length === 0) {
          setErrorMsg("File tidak memiliki format yang benar. Pastikan ada kolom 'kecamatan' dan 'gejala'.");
        }
      } catch (err) {
        setErrorMsg("Gagal membaca file Excel.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!kecamatan || !gejala) return;
    
    setLoading(true);
    const res = await submitLaporan(kecamatan, gejala);
    setLoading(false);
    
    if (res.success) {
      setSuccessMsg("Laporan manual berhasil disimpan.");
      setKecamatan('');
      setGejala('');
    } else {
      setErrorMsg("Gagal menyimpan laporan.");
    }
  };

  const submitExcel = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    if (parsedData.length === 0) return;
    
    setLoading(true);
    const res = await submitLaporanBatch(parsedData);
    setLoading(false);
    
    if (res.success) {
      setSuccessMsg(`${res.count} laporan berhasil diimpor!`);
      setParsedData([]);
      setFileName('');
    } else {
      setErrorMsg(res.error || "Gagal mengimpor laporan massal.");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-white font-medium bg-[#2563EB] px-4 py-2 rounded-[8px] hover:bg-blue-700 transition-colors shadow-sm h-[38px]"
      >
        <Plus className="w-4 h-4" /> Lapor Manual
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Input Laporan Warga</h2>
              <button onClick={closeAndReset} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => { setActiveTab('manual'); resetState(); }}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'manual' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Input Manual
              </button>
              <button 
                onClick={() => { setActiveTab('excel'); resetState(); }}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'excel' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Impor Excel
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {successMsg && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm font-medium border border-green-200 rounded-md">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium border border-red-200 rounded-md">
                  {errorMsg}
                </div>
              )}

              {activeTab === 'manual' ? (
                <form onSubmit={submitManual} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Kecamatan / Kelurahan</label>
                    <select 
                      value={kecamatan} 
                      onChange={(e) => setKecamatan(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      required
                    >
                      <option value="" disabled>-</option>
                      {kecamatanOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Gejala / Keterangan</label>
                    <textarea 
                      value={gejala}
                      onChange={(e) => setGejala(e.target.value)}
                      placeholder="Masukkan gejala secara spesifik..."
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
                      required
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button 
                      type="submit"
                      disabled={loading || !kecamatan || !gejala}
                      className="bg-[#2563EB] text-white text-sm font-bold py-2.5 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                    >
                      {loading ? "Menyimpan..." : "Simpan Laporan"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-sm text-blue-800">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Butuh Template Excel?</p>
                        <p className="text-xs text-blue-600/80">Unduh template agar format sesuai standar sistem.</p>
                      </div>
                    </div>
                    <button onClick={downloadTemplate} className="flex items-center gap-1.5 text-xs font-bold bg-white text-blue-700 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-50 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Unduh
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 relative hover:bg-gray-100 transition-colors">
                    <input 
                      type="file" 
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Klik untuk memilih file Excel"
                    />
                    <Upload className="w-8 h-8 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {fileName ? fileName : "Klik atau Seret file Excel (.xlsx) ke sini"}
                    </p>
                    <p className="text-xs text-gray-500">Maksimal 1000 baris per file</p>
                  </div>

                  {parsedData.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-gray-800">Pratinjau Data</h4>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{parsedData.length} Laporan Valid</span>
                      </div>
                      <div className="max-h-[120px] overflow-y-auto text-xs text-gray-600 divide-y divide-gray-200 bg-white border border-gray-200 rounded">
                        {parsedData.slice(0, 5).map((row, i) => (
                          <div key={i} className="flex items-center py-2 px-3">
                            <span className="w-24 font-medium truncate">{row.kecamatan}</span>
                            <span className="flex-1 truncate">{row.gejala}</span>
                          </div>
                        ))}
                        {parsedData.length > 5 && (
                          <div className="py-2 px-3 text-center text-gray-400 font-medium bg-gray-50">
                            + {parsedData.length - 5} baris lainnya...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex justify-end">
                    <button 
                      onClick={submitExcel}
                      disabled={loading || parsedData.length === 0}
                      className="bg-[#2563EB] text-white text-sm font-bold py-2.5 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                    >
                      {loading ? "Mengimpor..." : "Mulai Impor"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
