const CUSTOM_CSS = `
<style>
  :root {
    --brand: #0071e3;
    --brand-dark: #005bb5;
    --bg-top: #eef3fb;
    --bg-body: #f7f9fc;
    --text: #1d1d1f;
    --text-muted: #6e6e73;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
                 Roboto, "PingFang SC", "Microsoft YaHei", sans-serif !important;
    background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-body) 260px, var(--bg-body) 100%) !important;
    color: var(--text);
  }
  .container, .container-fluid { max-width: 1200px; }

  /* 卡片化栅格列 */
  .row { margin-left: -10px; margin-right: -10px; }
  .row > [class*="col-"] {
    padding-left: 10px; padding-right: 10px;
    margin-bottom: 20px;
  }
  .row > [class*="col-"] > * {
    background: #fff;
    border-radius: 16px;
    padding: 18px;
    border: 1px solid rgba(0,0,0,.04);
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.12);
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }
  .row > [class*="col-"] > *:hover {
    transform: translateY(-3px);
    border-color: rgba(0,113,227,.18);
    box-shadow: 0 4px 10px rgba(0,0,0,.06), 0 18px 40px -16px rgba(0,0,0,.18);
  }

  /* 按钮圆润化 */
  .btn {
    border-radius: 999px;
    font-size: 13px;
    padding: 6px 14px;
    transition: transform .12s ease;
  }
  .btn:active { transform: scale(.96); }
  .btn-outline-secondary {
    border-color: rgba(0,0,0,.14);
    color: var(--text);
  }
  .btn-outline-secondary:hover {
    background: var(--brand);
    border-color: var(--brand);
    color: #fff;
  }

  /* 说明区 */
  #idBox {
    background: #fff;
    border-radius: 16px;
    padding: 20px 22px;
    margin-top: 8px;
    border: 1px solid rgba(0,0,0,.04);
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.12);
  }
  #idBox hr { border: 0; border-top: 1px solid rgba(0,0,0,.06); margin: 14px 0; }
  #idBox p { margin: 0; color: var(--text-muted); font-size: 14px; line-height: 1.7; }

  /* 顶部留白，避免内容贴边 */
  body > .container,
  body > .container-fluid { padding-top: 28px; padding-bottom: 60px; }
</style>
`;

export async function onRequest(context) {
  try {
    // 如果之前改用了 Service Binding，这里换成：
    // const response = await context.env.APPLEID_WORKER.fetch(context.request);
    const response = await fetch('https://fetch-appleid.mc123.shop/', {
      headers: context.request.headers,
    });

    if (!response.ok) {
      return new Response(`Worker 返回错误: ${response.status}`, { status: 502 });
    }

    // 向 <head> 追加自定义样式，原页面脚本/样式完整保留，复制功能不受影响
    const rewritten = new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append(CUSTOM_CSS, { html: true });
        },
      })
      .transform(response);

    return new Response(rewritten.body, {
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