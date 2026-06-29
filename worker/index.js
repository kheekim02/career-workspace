/** Serves static assets and injects Cloudflare Web Analytics on HTML when
 *  WEB_ANALYTICS_TOKEN is set via `wrangler secret put WEB_ANALYTICS_TOKEN`. */
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const token = env.WEB_ANALYTICS_TOKEN;
    if (!token) return response;

    const ct = response.headers.get("content-type") || "";
    if (!ct.includes("text/html")) return response;

    const beacon = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${token}"}'></script>`;
    return new HTMLRewriter()
      .on("body", {
        element(el) {
          el.append(beacon, { html: true });
        },
      })
      .transform(response);
  },
};
