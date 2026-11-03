export async function onRequest(context) {
  // 将请求转发到你的 Worker
  const workerUrl = new URL('https://fetch-appleid.mc123.shop/');
  // 如果希望保留原始路径（比如 /appleid?t=123），可以这样处理
  // const url = new URL(context.request.url);
  // workerUrl.search = url.search;

  const response = await fetch(workerUrl.toString(), {
    // 可以按需转发 headers、method、body 等
    headers: context.request.headers,
  });

  // 直接将 Worker 的响应返回给浏览器
  // 此时页面和“API”同源，完全不会有 CORS 问题
  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}