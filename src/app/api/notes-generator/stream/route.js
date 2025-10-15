// src/app/api/notes-generator/stream/route.js
import redisClient from "@/lib/redis";
function getSubscriberClient() {
    return redisClient.duplicate();
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
        return new Response("Missing jobId", { status: 400 });
    }

    const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
    };


    const subscriber = getSubscriberClient();
    await subscriber.connect();

    const channel = `job_status:${jobId}`;
    const stream = new ReadableStream({
        start(controller) {
            
            const sendEvent = (event, data) => {
                controller.enqueue(`event: ${event}\n`);
                controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
            };

            // Redis Pub/Sub listener
            subscriber.subscribe(channel, (message) => {
                const data = JSON.parse(message);
                sendEvent('update', data);

                if (data.status === 'completed' || data.status === 'failed') {
                    // Close the connection once the job is finished
                    controller.close();
                    subscriber.unsubscribe(channel);
                    subscriber.quit();
                }
            });

          
            req.signal.addEventListener('abort', () => {
                console.log(`Client disconnected from job ${jobId}. Unsubscribing.`);
                subscriber.unsubscribe(channel);
                subscriber.quit();
                controller.close();
            });

            
            redisClient.get(`notes:status:${jobId}`).then(status => {
                if (status === 'completed') {
                    
                    redisClient.get(`notes:data:${jobId}`).then(data => {
                        sendEvent('update', { jobId, status: 'completed', progress: 1.0, details: { result: data ? JSON.parse(data) : null } });
                        controller.close();
                        subscriber.unsubscribe(channel);
                        subscriber.quit();
                    });
                } else if (status === 'failed') {
                    sendEvent('update', { jobId, status: 'failed', progress: 0.0, details: { error: 'Job previously failed.' } });
                    controller.close();
                    subscriber.unsubscribe(channel);
                    subscriber.quit();
                } else if (!status) {
                    sendEvent('update', { jobId, status: 'pending', progress: 0.0, details: { message: 'Job queued...' } });
                }
            });
        },
    });

    return new Response(stream, { headers });
}