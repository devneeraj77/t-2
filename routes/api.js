'use strict';

const crypto = require('crypto');

// In-memory store for issues
let issues = [];

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let projectIssues = issues.filter(i => i.project === project);

      for (let key in req.query) {
        if (!Object.prototype.hasOwnProperty.call(req.query, key)) continue;
        let value = req.query[key];
        if (value === undefined) continue;

        if (key === 'open') {
          let boolValue = (value === 'true' || value === true);
          projectIssues = projectIssues.filter(i => i.open === boolValue);
        } else if (key === '_id') {
          projectIssues = projectIssues.filter(i => i._id === value);
        } else {
          projectIssues = projectIssues.filter(i => String(i[key]) === String(value));
        }
      }

      let result = projectIssues.map(i => ({
        _id: i._id,
        issue_title: i.issue_title,
        issue_text: i.issue_text,
        created_on: i.created_on,
        updated_on: i.updated_on,
        created_by: i.created_by,
        assigned_to: i.assigned_to,
        open: i.open,
        status_text: i.status_text
      }));

      return res.json(result);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      let now = new Date().toISOString();
      let newIssue = {
        _id: crypto.randomBytes(12).toString('hex'),
        issue_title: String(issue_title),
        issue_text: String(issue_text),
        created_on: now,
        updated_on: now,
        created_by: String(created_by),
        assigned_to: (assigned_to !== undefined && assigned_to !== null) ? String(assigned_to) : '',
        open: true,
        status_text: (status_text !== undefined && status_text !== null) ? String(status_text) : '',
        project: project
      };

      issues.push(newIssue);

      return res.json({
        _id: newIssue._id,
        issue_title: newIssue.issue_title,
        issue_text: newIssue.issue_text,
        created_on: newIssue.created_on,
        updated_on: newIssue.updated_on,
        created_by: newIssue.created_by,
        assigned_to: newIssue.assigned_to,
        open: newIssue.open,
        status_text: newIssue.status_text
      });
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      const updateFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
      let hasUpdate = false;
      for (let field of updateFields) {
        if (req.body[field] !== undefined && req.body[field] !== '') {
          hasUpdate = true;
          break;
        }
      }

      if (!hasUpdate) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }

      let issue = issues.find(i => i._id === _id);
      if (!issue) {
        return res.json({ error: 'could not update', _id: _id });
      }

      if (issue_title !== undefined && issue_title !== '') issue.issue_title = issue_title;
      if (issue_text !== undefined && issue_text !== '') issue.issue_text = issue_text;
      if (created_by !== undefined && created_by !== '') issue.created_by = created_by;
      if (assigned_to !== undefined && assigned_to !== '') issue.assigned_to = assigned_to;
      if (status_text !== undefined && status_text !== '') issue.status_text = status_text;
      if (open !== undefined && open !== '') {
        issue.open = (open === false || open === 'false') ? false : true;
      }
      issue.updated_on = new Date().toISOString();

      return res.json({ result: 'successfully updated', _id: _id });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let _id = req.body._id;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      let index = issues.findIndex(i => i._id === _id);
      if (index === -1) {
        return res.json({ error: 'could not delete', _id: _id });
      }

      issues.splice(index, 1);
      return res.json({ result: 'successfully deleted', _id: _id });
    });
    
};
