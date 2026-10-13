'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [projectInput, setProjectInput] = useState('apitest');
  const [responsePayload, setResponsePayload] = useState('// Submit any request below to view real-time API response payload');
  const [responseStatus, setResponseStatus] = useState<string>('Idle');
  const [lastId, setLastId] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState('Copy JSON');

  // Form 1 State
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [postCreatedBy, setPostCreatedBy] = useState('');
  const [postAssignedTo, setPostAssignedTo] = useState('');
  const [postStatusText, setPostStatusText] = useState('');

  // Form 2 State
  const [putId, setPutId] = useState('');
  const [putTitle, setPutTitle] = useState('');
  const [putText, setPutText] = useState('');
  const [putCreatedBy, setPutCreatedBy] = useState('');
  const [putAssignedTo, setPutAssignedTo] = useState('');
  const [putStatusText, setPutStatusText] = useState('');
  const [putClose, setPutClose] = useState(false);

  // Form 3 State
  const [delId, setDelId] = useState('');

  const prefillSample = () => {
    setPostTitle('Database query optimization required');
    setPostText('Batch aggregation times out on large telemetry collections.');
    setPostCreatedBy('DevOps Team');
    setPostAssignedTo('Database Admin');
    setPostStatusText('High Priority');
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseStatus('Sending...');
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(projectInput || 'apitest')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue_title: postTitle,
          issue_text: postText,
          created_by: postCreatedBy,
          assigned_to: postAssignedTo,
          status_text: postStatusText
        })
      });
      const data = await res.json();
      setResponseStatus(`${res.status} ${res.statusText}`);
      setResponsePayload(JSON.stringify(data, null, 2));
      if (data._id) {
        setLastId(data._id);
        setPutId(data._id);
        setDelId(data._id);
      }
    } catch (err: any) {
      setResponseStatus('Error');
      setResponsePayload(JSON.stringify({ error: err.message }, null, 2));
    }
  };

  const handlePut = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseStatus('Sending...');
    const body: Record<string, any> = { _id: putId };
    if (putTitle) body.issue_title = putTitle;
    if (putText) body.issue_text = putText;
    if (putCreatedBy) body.created_by = putCreatedBy;
    if (putAssignedTo) body.assigned_to = putAssignedTo;
    if (putStatusText) body.status_text = putStatusText;
    if (putClose) body.open = false;

    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(projectInput || 'apitest')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setResponseStatus(`${res.status} ${res.statusText}`);
      setResponsePayload(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseStatus('Error');
      setResponsePayload(JSON.stringify({ error: err.message }, null, 2));
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseStatus('Sending...');
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(projectInput || 'apitest')}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: delId })
      });
      const data = await res.json();
      setResponseStatus(`${res.status} ${res.statusText}`);
      setResponsePayload(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseStatus('Error');
      setResponsePayload(JSON.stringify({ error: err.message }, null, 2));
    }
  };

  const copyJson = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(responsePayload);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback('Copy JSON'), 1500);
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <Link href="/" className="brand">
            <div className="brand-icon">⚡</div>
            <div>
              <h1>PulseTrack</h1>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-2px' }}>
                Next.js 16 App Router &bull; TypeScript
              </p>
            </div>
          </Link>
          <nav className="header-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#047857', background: '#ecfdf5', padding: '4px 10px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
              <span style={{ width: 7, height: 7, background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
              Serverless Live &bull; 14 Tests Passing
            </div>
            <Link href={`/${encodeURIComponent(projectInput || 'apitest')}`} className="nav-link btn-cta">
              Open Board ({projectInput || 'apitest'}) &rarr;
            </Link>
          </nav>
        </div>
      </header>

      <main className="main-wrapper">
        <section className="hero-banner">
          <h2>Enterprise Issue &amp; Ticket Tracking</h2>
          <p>Full-stack modern application powered by Next.js App Router, React 19, TypeScript, and real-time state mutation.</p>
        </section>

        {/* Project Jump Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--primary-light)', border: '1px solid #bfdbfe', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '28px' }}>
          <label htmlFor="jumpProjectInput" style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Workspace:
          </label>
          <input
            id="jumpProjectInput"
            type="text"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            placeholder="Enter project name..."
            style={{ minWidth: 220, padding: '10px 14px', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '14px', background: '#fff' }}
          />
          <Link href={`/${encodeURIComponent(projectInput || 'apitest')}`} className="btn">
            Enter Workspace Board
          </Link>
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Quick:</span>
            <button type="button" onClick={() => setProjectInput('apitest')} style={{ background: '#fff', border: '1px solid #bfdbfe', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>apitest</button>
            <button type="button" onClick={() => setProjectInput('core-api')} style={{ background: '#fff', border: '1px solid #bfdbfe', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>core-api</button>
            <button type="button" onClick={() => setProjectInput('mobile-app')} style={{ background: '#fff', border: '1px solid #bfdbfe', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>mobile-app</button>
          </div>
        </div>

        {/* API Specification */}
        <section className="card-panel">
          <div className="card-header">
            <h3>📖 REST API Endpoints</h3>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '4px 8px', borderRadius: '4px' }}>
              App Router Handlers
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fafafa' }}>
              <span className="endpoint-tag get">GET</span>
              <code>/api/issues/[project]</code>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Query issues. Filter by any parameter: <code>?open=true&amp;assigned_to=Name</code>.
              </p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fafafa' }}>
              <span className="endpoint-tag post">POST</span>
              <code>/api/issues/[project]</code>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Create tickets with <code>issue_title</code>, <code>issue_text</code>, <code>created_by</code>.
              </p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fafafa' }}>
              <span className="endpoint-tag put">PUT</span>
              <code>/api/issues/[project]</code>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Update fields or close issue (<code>open: false</code>) with <code>_id</code>.
              </p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fafafa' }}>
              <span className="endpoint-tag del">DEL</span>
              <code>/api/issues/[project]</code>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Delete issue permanently by <code>_id</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Console */}
        <section id="testui" className="card-panel">
          <div className="card-header">
            <h3>⚡ Live API Testing Console (Workspace: <i>{projectInput || 'apitest'}</i>)</h3>
            <a href={`/api/issues/${encodeURIComponent(projectInput || 'apitest')}`} target="_blank" rel="noreferrer" className="nav-link" style={{ padding: '4px 10px', fontSize: '12px', border: '1px solid var(--border-color)' }}>
              Open Raw JSON Feed &nearr;
            </a>
          </div>

          <div className="forms-grid">
            {/* Create */}
            <div className="form-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h4><span className="endpoint-tag post">POST</span> Create Issue</h4>
                <button type="button" onClick={prefillSample} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
                  Pre-fill sample
                </button>
              </div>
              <p className="form-desc">Creates a record on workspace <b>{projectInput || 'apitest'}</b>.</p>
              <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="text" placeholder="* Title (required)" required value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                <textarea placeholder="* Detailed description (required)" required value={postText} onChange={(e) => setPostText(e.target.value)} />
                <input type="text" placeholder="* Created by (required)" required value={postCreatedBy} onChange={(e) => setPostCreatedBy(e.target.value)} />
                <input type="text" placeholder="Assigned to (optional)" value={postAssignedTo} onChange={(e) => setPostAssignedTo(e.target.value)} />
                <input type="text" placeholder="Status note (optional)" value={postStatusText} onChange={(e) => setPostStatusText(e.target.value)} />
                <button type="submit" className="btn">Create Issue</button>
              </form>
            </div>

            {/* Update */}
            <div className="form-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h4><span className="endpoint-tag put">PUT</span> Update Issue</h4>
                {lastId && (
                  <button type="button" onClick={() => setPutId(lastId)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
                    Paste latest ID
                  </button>
                )}
              </div>
              <p className="form-desc">Modify one or more fields via <code>_id</code>.</p>
              <form onSubmit={handlePut} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="text" placeholder="* _id of target issue" required value={putId} onChange={(e) => setPutId(e.target.value)} />
                <input type="text" placeholder="New Title (optional)" value={putTitle} onChange={(e) => setPutTitle(e.target.value)} />
                <textarea placeholder="New Text (optional)" value={putText} onChange={(e) => setPutText(e.target.value)} />
                <input type="text" placeholder="New Created by (optional)" value={putCreatedBy} onChange={(e) => setPutCreatedBy(e.target.value)} />
                <input type="text" placeholder="New Assigned to (optional)" value={putAssignedTo} onChange={(e) => setPutAssignedTo(e.target.value)} />
                <input type="text" placeholder="New Status text (optional)" value={putStatusText} onChange={(e) => setPutStatusText(e.target.value)} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={putClose} onChange={(e) => setPutClose(e.target.checked)} />
                  <span>Close this issue (set open = false)</span>
                </label>
                <button type="submit" className="btn">Apply Update</button>
              </form>
            </div>

            {/* Delete */}
            <div className="form-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h4><span className="endpoint-tag del">DEL</span> Delete Issue</h4>
                {lastId && (
                  <button type="button" onClick={() => setDelId(lastId)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
                    Paste latest ID
                  </button>
                )}
              </div>
              <p className="form-desc">Permanently remove an issue by its <code>_id</code>.</p>
              <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="text" placeholder="* _id to delete" required value={delId} onChange={(e) => setDelId(e.target.value)} />
                <div style={{ flex: 1 }}></div>
                <button type="submit" className="btn btn-danger">Permanently Delete</button>
              </form>
            </div>
          </div>

          {/* Response Payload */}
          <div style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', padding: '20px', color: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Live Response Payload</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#1e293b', color: '#38bdf8' }}>{responseStatus}</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={copyJson} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
                  {copyFeedback}
                </button>
                <button type="button" onClick={() => setResponsePayload('// Cleared')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
                  Clear
                </button>
              </div>
            </div>
            <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#38bdf8', whiteSpace: 'pre-wrap', maxHeight: 350, overflowY: 'auto' }}>
              <code>{responsePayload}</code>
            </pre>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>PulseTrack &bull; Next.js 16 App Router &bull; TypeScript &bull; freeCodeCamp Quality Assurance Project</p>
      </footer>
    </>
  );
}
