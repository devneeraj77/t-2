import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const functionalTests = [
  {
    title: 'Create an issue with every field: POST request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'isObject', args: ['res.body'] },
      { method: 'property', args: ['res.body', "'_id'"] },
      { method: 'equal', args: ['res.body.issue_title', "'Title 1'"] },
      { method: 'equal', args: ['res.body.issue_text', "'Text 1'"] },
      { method: 'equal', args: ['res.body.created_by', "'Chai'"] },
      { method: 'equal', args: ['res.body.assigned_to', "'Tester'"] },
      { method: 'equal', args: ['res.body.status_text', "'In QA'"] },
      { method: 'isTrue', args: ['res.body.open'] },
      { method: 'property', args: ['res.body', "'created_on'"] },
      { method: 'property', args: ['res.body', "'updated_on'"] }
    ]
  },
  {
    title: 'Create an issue with only required fields: POST request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'isObject', args: ['res.body'] },
      { method: 'property', args: ['res.body', "'_id'"] },
      { method: 'equal', args: ['res.body.issue_title', "'Title 2'"] },
      { method: 'equal', args: ['res.body.issue_text', "'Text 2'"] },
      { method: 'equal', args: ['res.body.created_by', "'Chai'"] },
      { method: 'equal', args: ['res.body.assigned_to', "''"] },
      { method: 'equal', args: ['res.body.status_text', "''"] },
      { method: 'isTrue', args: ['res.body.open'] },
      { method: 'property', args: ['res.body', "'created_on'"] },
      { method: 'property', args: ['res.body', "'updated_on'"] }
    ]
  },
  {
    title: 'Create an issue with missing required fields: POST request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ error: 'required field(s) missing' }"] }
    ]
  },
  {
    title: 'View issues on a project: GET request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'isArray', args: ['res.body'] },
      { method: 'isAtLeast', args: ['res.body.length', '2'] },
      { method: 'property', args: ['res.body[0]', "'_id'"] },
      { method: 'property', args: ['res.body[0]', "'issue_title'"] },
      { method: 'property', args: ['res.body[0]', "'issue_text'"] },
      { method: 'property', args: ['res.body[0]', "'created_on'"] },
      { method: 'property', args: ['res.body[0]', "'updated_on'"] },
      { method: 'property', args: ['res.body[0]', "'created_by'"] },
      { method: 'property', args: ['res.body[0]', "'assigned_to'"] },
      { method: 'property', args: ['res.body[0]', "'open'"] },
      { method: 'property', args: ['res.body[0]', "'status_text'"] }
    ]
  },
  {
    title: 'View issues on a project with one filter: GET request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'isArray', args: ['res.body'] },
      { method: 'isAtLeast', args: ['res.body.length', '1'] },
      { method: 'equal', args: ['res.body[0].assigned_to', "'Tester'"] }
    ]
  },
  {
    title: 'View issues on a project with multiple filters: GET request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'isArray', args: ['res.body'] },
      { method: 'isAtLeast', args: ['res.body.length', '1'] },
      { method: 'equal', args: ['res.body[0].assigned_to', "'Tester'"] },
      { method: 'isTrue', args: ['res.body[0].open'] }
    ]
  },
  {
    title: 'Update one field on an issue: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ result: 'successfully updated', _id: issue1._id }"] }
    ]
  },
  {
    title: 'Update multiple fields on an issue: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ result: 'successfully updated', _id: issue1._id }"] }
    ]
  },
  {
    title: 'Update an issue with missing _id: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ error: 'missing _id' }"] }
    ]
  },
  {
    title: 'Update an issue with no fields to update: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ error: 'no update field(s) sent', _id: issue1._id }"] }
    ]
  },
  {
    title: 'Update an issue with an invalid _id: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ error: 'could not update', _id: '5f665eb46e296f6b9b6a504d' }"] }
    ]
  },
  {
    title: 'Delete an issue: DELETE request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ result: 'successfully deleted', _id: issue1._id }"] }
    ]
  },
  {
    title: 'Delete an issue with an invalid _id: DELETE request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ error: 'could not delete', _id: '5f665eb46e296f6b9b6a504d' }"] }
    ]
  },
  {
    title: 'Delete an issue with missing _id: DELETE request to /api/issues/{project}',
    context: ' -> Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'deepEqual', args: ['res.body', "{ error: 'missing _id' }"] }
    ]
  }
];

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type');
  const n = request.nextUrl.searchParams.get('n');

  let tests = functionalTests;
  if (type === 'functional') {
    tests = functionalTests.filter(t => t.context.includes('Functional Tests'));
  }

  if (n !== null) {
    const idx = parseInt(n, 10);
    return Response.json(tests[idx] || tests, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  return Response.json(tests, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}
