import worker from "./worker.js";
const marker="<!-- OMODOS4_RECOVERY_V2 -->";
const injection=`${marker}<link rel="stylesheet" href="/omodos4/hotfix.css"><script src="/omodos4/hotfix.js" defer></script><script src="/omodos4/patrol-area-feedback.js" defer></script>`;
export { MaintenanceStore } from "./worker.js";
export default {
  async fetch(request, env, ctx) {
    const response = await worker.fetch(request, env, ctx);
    const url = new URL(request.url);
    const type = response.headers.get("content-type") || "";
    if (request.method !== "GET" || !type.includes("text/html") || url.pathname.startsWith("/api/")) return response;
    const html = await response.text();
    if (html.includes(marker)) return new Response(html, response);
    const body = html.includes("</body>") ? html.replace("</body>", injection+"</body>") : html+injection;
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.set("cache-control","no-store, no-cache, must-revalidate");
    return new Response(body,{status:response.status,statusText:response.statusText,headers});
  }
};