/**
 * MatchingPreferencesForm
 * Multi-step wizard for setting matching intent, gender prefs, bio, interests etc.
 * Saves to POST /lushpressies/profile/matching-prefs
 */
import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const INTENTS = ['Serious Relationship','Long-term Partnership','Casual Dating','Friendship','Networking','Open to Anything'];
const CATEGORIES = ['Genuine','Empathetic','Sincere','Hopeful','Adventurous'];
const ZODIAC = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const LOVE_LANGUAGES = ['Words of Affirmation','Acts of Service','Receiving Gifts','Quality Time','Physical Touch'];
const INTERESTS_LIST = ['Travel','Music','Food','Family','Adventure','Fitness','Movies','Reading','Creativity','Art','Dance','Cooking','Sports','Yoga','Meditation','Nature','Animals','Tech','Culture','Spirituality'];
const GENDERS = ['Women','Men','Non-binary','Everyone'];

function getToken() {
  return localStorage.getItem('authToken') || localStorage.getItem('token') || '';
}

interface FormData {
  matching_intents: string[];
  matching_categories: string[];
  gender_preference: string[];
  age_preference_min: number;
  age_preference_max: number;
  distance_preference_km: number;
  bio_extended: string;
  interests: string[];
  zodiac_sign: string;
  love_language: string;
  deal_breakers: string;
  is_incognito: boolean;
}

interface Props {
  onSave?: (profile: any) => void;
  onClose?: () => void;
  isOpen?: boolean;
  initialData?: Partial<FormData>;
}

const STEPS = ['Intent','About Me','Preferences','Interests','Privacy'];

export const MatchingPreferencesForm: React.FC<Props> = ({ onSave, onClose, isOpen = true, initialData }) => {
  if (isOpen === false) return null;
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    matching_intents: [], matching_categories: [],
    gender_preference: [], age_preference_min: 18,
    age_preference_max: 55, distance_preference_km: 50,
    bio_extended: '', interests: [], zodiac_sign: '',
    love_language: '', deal_breakers: '', is_incognito: false,
    ...initialData,
  });

  const toggle = (field: keyof FormData, value: string) => {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] };
    });
  };

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const resp = await fetch(`${API_BASE}/lushpressies/profile/matching-prefs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ...form, deal_breakers: form.deal_breakers ? form.deal_breakers.split(',').map(s => s.trim()) : [] }),
      });
      const data = await resp.json();
      if (!resp.ok) { setError(data.error || 'Save failed'); return; }
      onSave?.(data.profile);
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: 24, cursor: 'pointer',
    fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600,
    border: `1px solid ${active ? '#a78bfa' : 'rgba(167,139,250,0.25)'}`,
    background: active ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.04)',
    color: active ? '#c4b5fd' : '#94a3b8',
    transition: 'all 0.15s ease',
  });

  const panelStyle: React.CSSProperties = {
    background: 'linear-gradient(160deg, #1e1b2e, #2d1b4e)',
    borderRadius: 24, padding: 32, maxWidth: 520, width: '100%',
    color: '#e2e8f0', fontFamily: 'Inter, sans-serif',
    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
    border: '1px solid rgba(167,139,250,0.2)',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={panelStyle}>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= step ? 'linear-gradient(90deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>{STEPS[step]}</h2>

        {/* STEP 0: Intent */}
        {step === 0 && (
          <div>
            <p style={{ color: '#94a3b8', marginBottom: 18, fontSize: 14 }}>What are you looking for?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {INTENTS.map((i) => (
                <span key={i} style={chipStyle(form.matching_intents.includes(i))} onClick={() => toggle('matching_intents', i)}>{i}</span>
              ))}
            </div>
            <p style={{ color: '#94a3b8', margin: '22px 0 12px', fontSize: 14 }}>How would you describe yourself?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {CATEGORIES.map((c) => (
                <span key={c} style={chipStyle(form.matching_categories.includes(c))} onClick={() => toggle('matching_categories', c)}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: About Me */}
        {step === 1 && (
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Extended Bio <span style={{ color: '#64748b' }}>(aim for 350+ words)</span></label>
            <textarea
              rows={8} value={form.bio_extended}
              onChange={(e) => setForm((p) => ({ ...p, bio_extended: e.target.value }))}
              placeholder="Tell potential matches about your personality, values, hobbies, dreams..."
              style={{ width: '100%', borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.2)', color: '#e2e8f0', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
            />
            <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>{form.bio_extended.split(/\s+/).filter(Boolean).length} words</p>

            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Zodiac Sign</label>
                <select value={form.zodiac_sign} onChange={(e) => setForm((p) => ({ ...p, zodiac_sign: e.target.value }))}
                  style={{ width: '100%', borderRadius: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.2)', color: '#e2e8f0', fontSize: 14 }}>
                  <option value="">Select…</option>
                  {ZODIAC.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Love Language</label>
                <select value={form.love_language} onChange={(e) => setForm((p) => ({ ...p, love_language: e.target.value }))}
                  style={{ width: '100%', borderRadius: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.2)', color: '#e2e8f0', fontSize: 14 }}>
                  <option value="">Select…</option>
                  {LOVE_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Preferences */}
        {step === 2 && (
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 10 }}>I'm interested in</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
              {GENDERS.map((g) => (
                <span key={g} style={chipStyle(form.gender_preference.includes(g))} onClick={() => toggle('gender_preference', g)}>{g}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Age: {form.age_preference_min}–{form.age_preference_max}</label>
                <input type="range" min={18} max={80} value={form.age_preference_min} onChange={(e) => setForm((p) => ({ ...p, age_preference_min: +e.target.value }))} style={{ width: '100%', accentColor: '#7c3aed' }} />
                <input type="range" min={18} max={80} value={form.age_preference_max} onChange={(e) => setForm((p) => ({ ...p, age_preference_max: +e.target.value }))} style={{ width: '100%', accentColor: '#ec4899' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Distance: {form.distance_preference_km} km</label>
                <input type="range" min={5} max={500} step={5} value={form.distance_preference_km} onChange={(e) => setForm((p) => ({ ...p, distance_preference_km: +e.target.value }))} style={{ width: '100%', accentColor: '#7c3aed' }} />
              </div>
            </div>

            <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Deal Breakers <span style={{ color: '#64748b' }}>(comma-separated)</span></label>
            <input type="text" value={form.deal_breakers} onChange={(e) => setForm((p) => ({ ...p, deal_breakers: e.target.value }))}
              placeholder="smoking, long distance, no kids..."
              style={{ width: '100%', borderRadius: 10, padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.2)', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box' }} />
          </div>
        )}

        {/* STEP 3: Interests */}
        {step === 3 && (
          <div>
            <p style={{ color: '#94a3b8', marginBottom: 14, fontSize: 14 }}>Select your interests (used for AI matching)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {INTERESTS_LIST.map((i) => (
                <span key={i} style={chipStyle(form.interests.includes(i))} onClick={() => toggle('interests', i)}>{i}</span>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Privacy */}
        {step === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Incognito Mode</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>Browse without appearing in others' discover queues</p>
              </div>
              <button
                onClick={() => setForm((p) => ({ ...p, is_incognito: !p.is_incognito }))}
                style={{
                  width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: form.is_incognito ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.1)',
                  position: 'relative', transition: 'background 0.2s',
                }}
              >
                <span style={{
                  position: 'absolute', top: 3, left: form.is_incognito ? 22 : 3,
                  width: 22, height: 22, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
            {error && <p style={{ color: '#f87171', marginTop: 14, fontSize: 13 }}>{error}</p>}
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
          <button
            onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
            style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '1px solid rgba(167,139,250,0.25)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)}
              style={{ flex: 2, padding: '12px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700 }}>
              Continue →
            </button>
          ) : (
            <button type="button" onClick={save} disabled={saving}
              style={{ flex: 2, padding: '12px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : '✓ Save Preferences'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchingPreferencesForm;
