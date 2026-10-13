export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(`// Next.js App Router Issue Tracker API Routes\n// Handlers located in app/api/issues/[project]/route.ts`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
