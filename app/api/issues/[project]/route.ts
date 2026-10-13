import { NextRequest } from 'next/server';
import { issueStore } from '@/lib/issueStore';

export const dynamic = 'force-dynamic';

async function parseBody(request: Request): Promise<Record<string, any>> {
  const contentType = request.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      return await request.json();
    }
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const obj: Record<string, any> = {};
      formData.forEach((val, key) => {
        obj[key] = val.toString();
      });
      return obj;
    }
    const text = await request.text();
    try {
      return JSON.parse(text);
    } catch {
      const params = new URLSearchParams(text);
      const obj: Record<string, any> = {};
      params.forEach((val, key) => {
        obj[key] = val;
      });
      return obj;
    }
  } catch {
    return {};
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project: string }> }
) {
  const { project } = await params;
  const searchParams = request.nextUrl.searchParams;
  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    filters[key] = value;
  });

  const issues = issueStore.get(project, filters);
  return Response.json(issues);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const { project } = await params;
  const body = await parseBody(request);
  const result = issueStore.create(project, body);
  return Response.json(result);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const { project } = await params;
  const body = await parseBody(request);
  const result = issueStore.update(project, body);
  return Response.json(result);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const { project } = await params;
  const body = await parseBody(request);
  const result = issueStore.delete(project, body._id);
  return Response.json(result);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
