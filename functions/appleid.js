export async function onRequest(context) {
  try {
    // 通过 Service Binding 直接调用 Worker，不经过公共路由
    const response = await context.env.APPLEID_WORKER.fetch(context.request);
    
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return new Response(`代理异常: ${e.message}`, { status: 502 });
  }
}
