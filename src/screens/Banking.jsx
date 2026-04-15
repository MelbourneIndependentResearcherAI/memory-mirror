import React, { useState } from "react";

export default function Banking({ darkMode }) {
  const [balance] = useState("1,234.56");
  const [note, setNote] = useState("");

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-black text-white" : "bg-slate-900 text-white"
      }`}
    >
      <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">Fake Banking</h1>
        <p className="text-xs text-gray-300 mb-4 text-center">
          This is just pretend, bruz. No real money, no real accounts.
        </p>

        <div className="mb-4 rounded-2xl bg-slate-900 px-4 py-3">
          <div className="text-sm text-gray-300">Available balance</div>
          <div className="text-3xl font-bold mt-1">$ {balance}</div>
        </div>

        <div className="space-y-2 mb-4">
          <button className="w-full h-10 rounded-full bg-slate-700 text-sm hover:bg-slate-600">
            View pretend transactions
          </button>
          <button className="w-full h-10 rounded-full bg-slate-700 text-sm hover:bg-slate-600">
            Pretend transfer
          </button>
          <button className="w-full h-10 rounded-full bg-slate-700 text-sm hover:bg-slate-600">
            Pretend bill pay
          </button>
        </div>

        <div>
          <div className="text-sm font-semibold mb-1">
            Yarn about money worries
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full rounded-2xl px-3 py-2 bg-slate-900 border border-slate-700 text-sm"
            placeholder="You can write how you feel about money. This is just for you."
          />
        </div>
      </div>
    </div>
  );
}
