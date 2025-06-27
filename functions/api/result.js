// 边缘函数：读取最新的支付结果
export async function onRequest(context) {
    const { request, env } = context;
    const kv = env.PAYMENT;
    let payment_result = await kv.get("latest_payment_result");
    
    return new Response(JSON.stringify({ payment_result }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
