# Services Extension Layer

Project Dali keeps the Worker lean. When workloads exceed Worker limits (e.g., heavy video rendering, perceptual hashing, large PDF generation), move logic into a Cloudflare Container and expose it via a Service binding.

## When to create a Service
- Long-running CPU tasks that might exceed Worker CPU time.
- Workloads needing native libraries (ffmpeg, OpenCV, etc.).
- Batch jobs processing large datasets from R2.

## Integration Pattern
1. Define a new containerized service and deploy it via Cloudflare.
2. Add a service binding in `wrangler.toml` pointing to the service.
3. Create a helper in `src/lib/services/*.ts` to call the service.
4. Invoke from agents or routes via tools, maintaining typed contracts.

```ts
// Example placeholder usage
// const response = await env.MY_SERVICE.fetch('https://service/run', { method: 'POST', body: JSON.stringify(payload) });
```

// TODO(Jules): add service binding in wrangler.toml when first container is introduced.
