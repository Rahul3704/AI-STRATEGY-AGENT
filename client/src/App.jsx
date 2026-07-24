import { useState } from "react";
import axios from "axios";

function App() {
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateStrategy = async () => {
    if (!mission.trim()) {
      alert("Please enter a mission");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/generate`,
        {
          mission,
        },
      );

      setResult(res.data);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}

        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
            🤖 AI Strategy Agent
          </h1>

          <p className="text-slate-600 mt-4 text-lg">
            Generate Military Strategies using Artificial Intelligence
          </p>
        </div>

        {/* Input */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/60">
          <textarea
            rows="6"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Enter Mission..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-5 outline-none text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />

          <button
            onClick={generateStrategy}
            className="mt-5 px-10 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold shadow-md shadow-cyan-200 hover:scale-105 transition"
          >
            {loading ? "Generating..." : "Generate Strategy"}
          </button>
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <Card title="🎯 Mission Objective">{result.missionObjective}</Card>

            <Card title="📍 Route">{result.route}</Card>

            <ListCard title="🪖 Resources" items={result.resources} />

            <ListCard title="⚠ Risks" items={result.risks} />

            {/* Strategy */}

            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/60">
              <h2 className="text-3xl font-bold mb-6">🚀 Strategy</h2>

              {Array.isArray(result.strategy) ? (
                result.strategy.map((step, index) => (
                  <div
                    key={index}
                    className="bg-cyan-50 border-l-4 border-cyan-400 rounded-xl p-5 mb-4 text-slate-700"
                  >
                    {typeof step === "string"
                      ? step
                      : JSON.stringify(step, null, 2)}
                  </div>
                ))
              ) : (
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result.strategy, null, 2)}
                </pre>
              )}
            </div>

            {/* Success */}

            <div className="md:col-span-2 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-2xl p-8 text-center text-emerald-950 shadow-lg shadow-emerald-200">
              <h2 className="text-3xl font-bold">📈 Success Probability</h2>

              <h1 className="text-7xl font-extrabold mt-5">
                {(() => {
                  const value = result.successProbability;

                  if (!value) return "N/A";

                  if (typeof value === "string" && value.includes("%")) {
                    return value;
                  }

                  const num = parseFloat(value);

                  if (!isNaN(num)) {
                    return num <= 1
                      ? `${Math.round(num * 100)}%`
                      : `${Math.round(num)}%`;
                  }

                  return value;
                })()}
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 hover:border-cyan-400 transition">
      <h2 className="text-2xl font-bold mb-5">{title}</h2>

      <p className="text-slate-600 leading-8">{children}</p>
    </div>
  );
}

function ListCard({ title, items }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 hover:border-cyan-400 transition">
      <h2 className="text-2xl font-bold mb-5">{title}</h2>

      <ul className="space-y-3">
        {items?.map((item, index) => (
          <li
            key={index}
            className="bg-slate-50 text-slate-700 rounded-lg px-4 py-3"
          >
            ✅ {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
