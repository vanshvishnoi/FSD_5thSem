import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, Award, BarChart3, Search, Plus, Trash2, Users,
  X, Calculator, ChevronDown, CheckCircle2, AlertCircle
} from "lucide-react";

const SECTIONS = [
  { key: "computerProgramming", label: "Computer Programming", weight: 0.15 },
  { key: "automata", label: "Automata", weight: 0.25 },
  { key: "englishComprehension", label: "English Comprehension", weight: 0.10 },
  { key: "quantitativeAbilityAdvanced", label: "Quantitative Ability (Advanced)", weight: 0.10 },
  { key: "automataFix", label: "Automata Fix", weight: 0.20 },
  { key: "computerScience", label: "Computer Science", weight: 0.05 },
  { key: "logicalAbility", label: "Logical Ability", weight: 0.15 }
];

const emptyForm = () => ({
  name: "",
  computerProgramming: "",
  automata: "",
  englishComprehension: "",
  quantitativeAbilityAdvanced: "",
  automataFix: "",
  computerScience: "",
  logicalAbility: ""
});

function calculateScore(candidate) {
  return SECTIONS.reduce((total, section) => {
    return total + Number(candidate[section.key]) * section.weight;
  }, 0);
}

function App() {
  const [candidates, setCandidates] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("amcat-candidates") || "[]");
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("highest");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("amcat-candidates", JSON.stringify(candidates));
  }, [candidates]);

  const average = candidates.length
    ? candidates.reduce((sum, c) => sum + c.finalScore, 0) / candidates.length
    : 0;
  const topCandidate = candidates.length
    ? [...candidates].sort((a, b) => b.finalScore - a.finalScore)[0]
    : null;

  const visibleCandidates = useMemo(() => {
    const filtered = candidates.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.sort((a, b) =>
      sortBy === "lowest" ? a.finalScore - b.finalScore :
      sortBy === "name" ? a.name.localeCompare(b.name) :
      b.finalScore - a.finalScore
    );
  }, [candidates, search, sortBy]);

  function updateField(key, value) {
    setForm(current => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const name = form.name.trim();
    if (!name) return setError("Please enter the candidate's name.");

    const duplicate = candidates.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (duplicate) return setError("A candidate with this name already exists.");

    for (const section of SECTIONS) {
      const value = form[section.key];
      if (value === "" || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 100) {
        return setError(`Enter a valid score between 0 and 100 for ${section.label}.`);
      }
    }

    const candidate = {
      id: crypto.randomUUID(),
      name,
      ...Object.fromEntries(SECTIONS.map(s => [s.key, Number(form[s.key])])),
    };
    candidate.finalScore = calculateScore(candidate);
    setCandidates(current => [candidate, ...current]);
    setForm(emptyForm());
    setShowForm(false);
  }

  function deleteCandidate(id) {
    setCandidates(current => current.filter(candidate => candidate.id !== id));
  }

  function clearAll() {
    if (window.confirm("Delete all candidate records? This cannot be undone.")) {
      setCandidates([]);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Activity size={22} /></div>
          <div><strong>ScorePilot</strong><span>AMCAT ANALYTICS</span></div>
        </div>
        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active"><BarChart3 size={18} /> Overview</div>
        <div className="nav-item"><Users size={18} /> Candidates</div>
        <div className="sidebar-bottom">
          <div className="side-help"> <div className="help-icon">?</div><div><strong>Need a hand?</strong><span>Your scores are saved locally<br/>in this browser.</span></div></div>
          <div className="profile"><div className="avatar">SC</div><div><strong>Score Calculator</strong><span>Local workspace</span></div></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <b>Overview</b></div>
          <div className="topbar-right"><span className="saved"><span></span> All changes saved</span><div className="top-avatar">SC</div></div>
        </header>

        <section className="page-heading">
          <div>
            <div className="eyebrow">CANDIDATE PERFORMANCE</div>
            <h1>Score overview</h1>
            <p>Calculate, track, and compare candidate performance across AMCAT sections.</p>
          </div>
          <button className="primary-btn" onClick={() => { setError(""); setShowForm(true); }}>
            <Plus size={18} /> Add candidate
          </button>
        </section>

        <section className="stats-grid">
          <StatCard icon={<Users size={19}/>} label="Total candidates" value={candidates.length} note="Candidate records" tone="blue"/>
          <StatCard icon={<Award size={19}/>} label="Highest score" value={topCandidate ? topCandidate.finalScore.toFixed(2) : "—"} note={topCandidate ? topCandidate.name : "No scores yet"} tone="purple"/>
          <StatCard icon={<Activity size={19}/>} label="Average score" value={candidates.length ? average.toFixed(2) : "—"} note="Across all candidates" tone="green"/>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div><h2>Candidate records</h2><p>Review and manage calculated AMCAT scores.</p></div>
            <div className="table-actions">
              <div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates..." /></div>
              <div className="sort-wrap"><select value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort candidates"><option value="highest">Highest score</option><option value="lowest">Lowest score</option><option value="name">Name A–Z</option></select><ChevronDown size={15}/></div>
            </div>
          </div>

          {visibleCandidates.length ? (
            <div className="table-scroll">
              <table>
                <thead><tr><th>CANDIDATE</th><th>CP <small>15%</small></th><th>AUTOMATA <small>25%</small></th><th>ENGLISH <small>10%</small></th><th>QUANT <small>10%</small></th><th>AUTO FIX <small>20%</small></th><th>CS <small>5%</small></th><th>LOGICAL <small>15%</small></th><th>FINAL SCORE</th><th></th></tr></thead>
                <tbody>
                  {visibleCandidates.map(candidate => (
                    <tr key={candidate.id}>
                      <td><div className="candidate-cell"><div className="candidate-avatar">{candidate.name.slice(0,1).toUpperCase()}</div><strong>{candidate.name}</strong></div></td>
                      {SECTIONS.map(section => <td key={section.key}>{candidate[section.key]}</td>)}
                      <td><span className="score-pill">{candidate.finalScore.toFixed(2)}</span></td>
                      <td><button className="icon-btn delete-btn" title="Delete candidate" onClick={() => deleteCandidate(candidate.id)}><Trash2 size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><Calculator size={25}/></div>
              <h3>{search ? "No matching candidates" : "No candidates added yet"}</h3>
              <p>{search ? "Try another candidate name." : "Add your first candidate to calculate and track their AMCAT score."}</p>
              {!search && <button className="secondary-btn" onClick={() => setShowForm(true)}><Plus size={16}/> Add first candidate</button>}
            </div>
          )}
          <div className="panel-footer"><span>Showing <b>{visibleCandidates.length}</b> of <b>{candidates.length}</b> candidates</span>{candidates.length > 0 && <button className="text-danger" onClick={clearAll}>Clear all records</button>}</div>
        </section>

        <section className="formula-note">
          <div className="formula-icon"><Calculator size={19}/></div>
          <div><strong>Weighted score calculation</strong><p>Final score = CP × 0.15 + Automata × 0.25 + English × 0.10 + Quant × 0.10 + Automata Fix × 0.20 + CS × 0.05 + Logical × 0.15</p></div>
        </section>
        <footer>ScorePilot <span>•</span> AMCAT Score Calculator <span>•</span> Data stays in your browser</footer>
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal">
            <div className="modal-header"><div><div className="eyebrow">NEW RECORD</div><h2>Add candidate</h2><p>Enter the candidate's section-wise scores.</p></div><button className="icon-btn" onClick={() => setShowForm(false)}><X size={20}/></button></div>
            <form onSubmit={handleSubmit}>
              <label className="field-label">Candidate name</label>
              <input className="name-input" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="e.g. Rahul Sharma" autoFocus />
              <div className="section-title">SECTION SCORES <span>0–100 scale</span></div>
              <div className="form-grid">
                {SECTIONS.map(section => (
                  <label className="score-field" key={section.key}>
                    <span>{section.label}<small>{Math.round(section.weight * 100)}% weight</small></span>
                    <input type="number" min="0" max="100" step="any" value={form[section.key]} onChange={e => updateField(section.key, e.target.value)} placeholder="0–100" />
                  </label>
                ))}
              </div>
              {error && <div className="error-message"><AlertCircle size={16}/>{error}</div>}
              <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-btn"><CheckCircle2 size={17}/> Calculate & save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, note, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;
}

export default App;
