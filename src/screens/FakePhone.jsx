import React, { useState } from "react";

const DIGITS = ["1","2","3","4","5","6","7","8","9","*","0","#"];

export default function FakePhone({ darkMode }) {
  const [number, setNumber] = useState("");

  const handlePress = (d) => {
    setNumber((prev) => (prev + d).slice(0, 20));
  };

  const handleClear = () => setNumber("");
  const handleFakeCall = () => {
    alert("This is a safe pretend call only, my friend.");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        darkMode ? "bg-black text-white" : "bg-slate-900 text-white"
      }`}
    >
      <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl max-w-xs w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Fake Phone</h1>
        <p className="text-xs text-gray-300 mb-2 text-center">
          This is just pretend, sis. No real calls happen ere.
        </p>
        <div className="mb-4">
          <div className="w-full rounded-2xl bg-black/60 px-3 py-3 text-center text-xl tracking-widest">
            {number || "Tap numbers"}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {DIGITS.map((d) => (
            <button
              key={d}
              onClick={() => handlePress(d)}
              className="h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-lg font-semibold"
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFakeCall}
            className="flex-1 h-10 rounded-full bg-green-600 hover:bg-green-500 text-sm font-semibold"
          >
            Call (pretend)
          </button>
          <button
            onClick={handleClear}
            className="flex-1 h-10 rounded-full bg-red-600 hover:bg-red-500 text-sm font-semibold"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
