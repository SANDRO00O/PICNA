export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const apiKey = env.NASA_API_KEY;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}${date ? `&date=${date}` : ""}`;
    
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch APOD" }), { status: res.status });
    }
    
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}