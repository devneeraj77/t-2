'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class IssueStore {
  constructor(storageFilePath) {
    this.storageFile = storageFilePath || path.join(process.cwd(), 'data', 'issues.json');
    this.issues = [];
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(this.storageFile)) {
        const raw = fs.readFileSync(this.storageFile, 'utf8');
        this.issues = JSON.parse(raw);
        if (!Array.isArray(this.issues)) this.issues = [];
      }
    } catch (e) {
      console.warn('IssueStore: Could not load existing data from disk, using empty store.', e.message);
      this.issues = [];
    }
  }

  saveToDisk() {
    try {
      const dir = path.dirname(this.storageFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storageFile, JSON.stringify(this.issues, null, 2), 'utf8');
    } catch (e) {
      console.warn('IssueStore: Could not save data to disk:', e.message);
    }
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  create(project, data) {
    const { issue_title, issue_text, created_by, assigned_to, status_text } = data;

    if (!issue_title || !issue_text || !created_by) {
      return { error: 'required field(s) missing' };
    }

    const now = new Date().toISOString();
    const issue = {
      _id: this.generateId(),
      issue_title: String(issue_title),
      issue_text: String(issue_text),
      created_on: now,
      updated_on: now,
      created_by: String(created_by),
      assigned_to: (assigned_to !== undefined && assigned_to !== null) ? String(assigned_to) : '',
      open: true,
      status_text: (status_text !== undefined && status_text !== null) ? String(status_text) : '',
      project: String(project)
    };

    this.issues.push(issue);
    this.saveToDisk();

    return this.sanitizeIssue(issue);
  }

  get(project, filters = {}) {
    let result = this.issues.filter(i => i.project === project);

    for (let key in filters) {
      if (!Object.prototype.hasOwnProperty.call(filters, key)) continue;
      const val = filters[key];
      if (val === undefined) continue;

      if (key === 'open') {
        const boolVal = (val === 'true' || val === true);
        result = result.filter(i => i.open === boolVal);
      } else if (key === '_id') {
        result = result.filter(i => i._id === val);
      } else {
        result = result.filter(i => String(i[key]) === String(val));
      }
    }

    return result.map(i => this.sanitizeIssue(i));
  }

  update(project, body) {
    const { _id } = body;
    if (!_id) {
      return { error: 'missing _id' };
    }

    const updateKeys = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
    let hasField = false;
    for (const key of updateKeys) {
      if (body[key] !== undefined && body[key] !== '') {
        hasField = true;
        break;
      }
    }

    if (!hasField) {
      return { error: 'no update field(s) sent', _id: _id };
    }

    const issue = this.issues.find(i => i._id === _id);
    if (!issue) {
      return { error: 'could not update', _id: _id };
    }

    if (body.issue_title !== undefined && body.issue_title !== '') {
      issue.issue_title = String(body.issue_title);
    }
    if (body.issue_text !== undefined && body.issue_text !== '') {
      issue.issue_text = String(body.issue_text);
    }
    if (body.created_by !== undefined && body.created_by !== '') {
      issue.created_by = String(body.created_by);
    }
    if (body.assigned_to !== undefined && body.assigned_to !== '') {
      issue.assigned_to = String(body.assigned_to);
    }
    if (body.status_text !== undefined && body.status_text !== '') {
      issue.status_text = String(body.status_text);
    }
    if (body.open !== undefined && body.open !== '') {
      issue.open = (body.open === false || body.open === 'false') ? false : true;
    }

    issue.updated_on = new Date().toISOString();
    this.saveToDisk();

    return { result: 'successfully updated', _id: _id };
  }

  delete(project, _id) {
    if (!_id) {
      return { error: 'missing _id' };
    }

    const idx = this.issues.findIndex(i => i._id === _id);
    if (idx === -1) {
      return { error: 'could not delete', _id: _id };
    }

    this.issues.splice(idx, 1);
    this.saveToDisk();

    return { result: 'successfully deleted', _id: _id };
  }

  sanitizeIssue(issue) {
    return {
      _id: issue._id,
      issue_title: issue.issue_title,
      issue_text: issue.issue_text,
      created_on: issue.created_on,
      updated_on: issue.updated_on,
      created_by: issue.created_by,
      assigned_to: issue.assigned_to,
      open: issue.open,
      status_text: issue.status_text
    };
  }
}

module.exports = new IssueStore();
