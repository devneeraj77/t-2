const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let issue1;
  let issue2;

  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title 1',
        issue_text: 'Text 1',
        created_by: 'Chai',
        assigned_to: 'Tester',
        status_text: 'In QA'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Title 1');
        assert.equal(res.body.issue_text, 'Text 1');
        assert.equal(res.body.created_by, 'Chai');
        assert.equal(res.body.assigned_to, 'Tester');
        assert.equal(res.body.status_text, 'In QA');
        assert.isTrue(res.body.open);
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        issue1 = res.body;
        done();
      });
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title 2',
        issue_text: 'Text 2',
        created_by: 'Chai'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Title 2');
        assert.equal(res.body.issue_text, 'Text 2');
        assert.equal(res.body.created_by, 'Chai');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        assert.isTrue(res.body.open);
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        issue2 = res.body;
        done();
      });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title 3'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'required field(s) missing' });
        done();
      });
  });

  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/test')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtLeast(res.body.length, 2);
        assert.property(res.body[0], '_id');
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        done();
      });
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/test')
      .query({ assigned_to: 'Tester' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtLeast(res.body.length, 1);
        assert.equal(res.body[0].assigned_to, 'Tester');
        done();
      });
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/test')
      .query({ open: true, assigned_to: 'Tester' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtLeast(res.body.length, 1);
        assert.equal(res.body[0].assigned_to, 'Tester');
        assert.isTrue(res.body[0].open);
        done();
      });
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: issue1._id,
        issue_title: 'Updated Title 1'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: issue1._id });
        done();
      });
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: issue1._id,
        issue_title: 'New Title Again',
        issue_text: 'New Text Again',
        open: false
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: issue1._id });
        done();
      });
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({
        issue_title: 'No _id Sent'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: issue1._id
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: issue1._id });
        done();
      });
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: '5f665eb46e296f6b9b6a504d',
        issue_title: 'Invalid ID Test'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not update', _id: '5f665eb46e296f6b9b6a504d' });
        done();
      });
  });

  test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/test')
      .send({
        _id: issue1._id
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully deleted', _id: issue1._id });
        done();
      });
  });

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/test')
      .send({
        _id: '5f665eb46e296f6b9b6a504d'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not delete', _id: '5f665eb46e296f6b9b6a504d' });
        done();
      });
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/test')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });
});
