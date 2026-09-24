export default { async fetch() { return new Response('Migration bridge closed', { status: 410, headers: { 'Cache-Control': 'no-store' } }); } };
