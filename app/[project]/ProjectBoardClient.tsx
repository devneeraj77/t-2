'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Issue } from '@/lib/issueStore';

export default function ProjectBoardClient({ projectName }: { projectName: string }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [statusText, setStatusText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/issues/${encodeURIComponent(projectName)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setIssues(data);
      }
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [projectName]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(projectName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue_title: title,
          issue_text: text,
          created_by: createdBy,
          assigned_to: assignedTo,
          status_text: statusText
        })
      });
      const data = await res.json();
      if (data && data._id) {
        setTitle('');
        setText('');
        setCreatedBy('');
        setAssignedTo('');
        setStatusText('');
        setShowForm(false);
        fetchIssues();
      } else {
        alert(data.error || 'Failed to create issue');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating issue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (issueId: string, currentOpen: boolean) => {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(projectName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: issueId,
          open: !currentOpen
        })
      });
      const data = await res.json();
      if (data && data.result === 'successfully updated') {
        fetchIssues();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (issueId: string) => {
    if (!confirm(`Permanently delete issue ${issueId}?`)) return;
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(projectName)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: issueId })
      });
      const data = await res.json();
      if (data && data.result === 'successfully deleted') {
        fetchIssues();
      }
    } catch (err) {
      console.error('Failed to delete issue:', err);
    }
  };

  const copyId = (id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1200);
      });
    }
  };

  // Stats calculation
  const totalCount = issues.length;
  const openCount = issues.filter(i => i.open).length;
  const closedCount = totalCount - openCount;

  // Filter & Search
  let displayed = issues;
  if (filter === 'open') displayed = displayed.filter(i => i.open);
  if (filter === 'closed') displayed = displayed.filter(i => !i.open);

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    displayed = displayed.filter(i =>
      i.issue_title?.toLowerCase().includes(q) ||
      i.issue_text?.toLowerCase().includes(q) ||
      i.created_by?.toLowerCase().includes(q) ||
      i.assigned_to?.toLowerCase().includes(q) ||
      i.status_text?.toLowerCase().includes(q) ||
      i._id?.toLowerCase().includes(q)
    );
  }

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <Link href="/" className="brand">
            <div className="brand-icon">⚡</div>
            <div>
              <h1>PulseTrack</h1>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-2px' }}>
                Project Board
              </p>
            </div>
          </Link>
          <nav className="header-nav">
            <Link href="/" className="nav-link">&larr; API Console &amp; Docs</Link>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="nav-link btn-cta"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              {showForm ? 'Close Form' : '+ Create Issue'}
            </button>
          </nav>
        </div>
      </header>

      <main className="main-wrapper">
        {/* Project Header Banner */}
        <div style={{ marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              All issues for: {projectName}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              Interactive workspace board for tracking, assigning, and resolving issues.
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginTop: 18 }}>
            <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 10, padding: '14px 18px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Issues</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>{totalCount}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 10, padding: '14px 18px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--open-border)' }}>
              <div style={{ fontSize: 12, color: '#047857', fontWeight: 600, textTransform: 'uppercase' }}>Open Issues</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#047857', marginTop: 4 }}>{openCount}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 10, padding: '14px 18px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--closed-border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Resolved / Closed</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-muted)', marginTop: 4 }}>{closedCount}</div>
            </div>
          </div>
        </div>

        {/* Create Issue Panel */}
        {showForm && (
          <div className="card-panel" style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
            <div className="card-header">
              <h3>📝 Submit a New Issue</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>* Required fields</span>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <input
                  type="text"
                  placeholder="* Issue Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="* Created by (Your Name / Team)"
                  required
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                />
              </div>
              <textarea
                placeholder="* Detailed description, reproduction steps, or notes..."
                required
                style={{ minHeight: 85 }}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <input
                  type="text"
                  placeholder="Assigned to (Optional)"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Status note (e.g. Critical, In Review)"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn">
                  {submitting ? 'Publishing...' : 'Publish Ticket →'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar: Filters & Instant Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`btn btn-secondary ${filter === 'all' ? 'active' : ''}`}
              style={{ background: filter === 'all' ? 'var(--primary)' : '#f1f5f9', color: filter === 'all' ? '#fff' : 'var(--text-main)' }}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('open')}
              className={`btn btn-secondary ${filter === 'open' ? 'active' : ''}`}
              style={{ background: filter === 'open' ? 'var(--primary)' : '#f1f5f9', color: filter === 'open' ? '#fff' : 'var(--text-main)' }}
            >
              Open ({openCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('closed')}
              className={`btn btn-secondary ${filter === 'closed' ? 'active' : ''}`}
              style={{ background: filter === 'closed' ? 'var(--primary)' : '#f1f5f9', color: filter === 'closed' ? '#fff' : 'var(--text-main)' }}
            >
              Closed ({closedCount})
            </button>
          </div>

          <div style={{ minWidth: 240, flex: 1, maxWidth: 360 }}>
            <input
              type="text"
              placeholder="Search issues by keyword, author, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 13, background: '#fff' }}
            />
          </div>
        </div>

        {/* Issue Cards Display */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            Loading tickets...
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>No tickets found</h4>
            <p>
              {issues.length === 0
                ? `No issues logged yet for workspace ${projectName}. Click + Create Issue above to add one!`
                : 'No issues match your current filter or search criteria.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {displayed.map((issue) => {
              const openstatus = issue.open ? 'open' : 'closed';
              return (
                <div key={issue._id} className={`issue ${openstatus}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-main)', padding: '3px 8px', borderRadius: 4, color: 'var(--text-muted)' }}>
                        id: {issue._id}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyId(issue._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, cursor: 'pointer' }}
                      >
                        {copiedId === issue._id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <span className={`status-pill ${issue.open ? 'open' : 'closed'}`}>
                      {issue.open ? 'Open' : 'Resolved'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                    {issue.issue_title} - ({openstatus})
                  </h3>

                  <p style={{ margin: '8px 0', fontSize: '14.5px', color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                    {issue.issue_text}
                  </p>

                  {issue.status_text && (
                    <p style={{ fontSize: 13, color: '#475569', background: '#f8fafc', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
                      <b>Status Note:</b> {issue.status_text}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-muted)' }}>
                    <span><b>Reporter:</b> {issue.created_by || 'Unknown'}</span>
                    <span><b>Assignee:</b> {issue.assigned_to || 'Unassigned'}</span>
                    <span><b>Created:</b> {issue.created_on}</span>
                    <span><b>Updated:</b> {issue.updated_on}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                    {issue.open ? (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(issue._id, true)}
                        className="btn btn-secondary"
                        style={{ fontSize: 12, padding: '5px 12px' }}
                      >
                        ✓ close?
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(issue._id, false)}
                        className="btn btn-secondary"
                        style={{ fontSize: 12, padding: '5px 12px', background: '#eff6ff', color: 'var(--primary)' }}
                      >
                        ↻ Reopen
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(issue._id)}
                      className="btn btn-danger"
                      style={{ fontSize: 12, padding: '5px 12px' }}
                    >
                      🗑 delete?
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>PulseTrack &bull; Next.js 16 App Router &bull; TypeScript</p>
      </footer>
    </>
  );
}
