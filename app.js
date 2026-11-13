/* Robust loader for the dashboard's bundled application source. */
(async () => {
  const base = "https://raw.githubusercontent.com/mehradharmanshu013-spec/R-M/main/assets/";
  const parts = Array.from({ length: 15 }, (_, i) => `app-${String(i + 1).padStart(2, "0")}.part`);

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load script: " + src));
    document.head.appendChild(script);
  });

  // Chart.js is an optional CDN dependency; retry through jsDelivr if cdnjs failed.
  if (!window.Chart) {
    try {
      await loadScript("https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js");
    } catch (error) {
      console.warn("Chart.js could not be loaded; dashboard charts may be unavailable.", error);
    }
  }

  const fetchPart = async (name) => {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(base + name, { cache: "no-cache" });
        if (!response.ok) throw new Error(name + " returned HTTP " + response.status);
        const body = await response.text();
        if (!body) throw new Error(name + " was empty");
        return body;
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }
    throw lastError;
  };

  const responses = await Promise.all(parts.map(fetchPart));
  const source = responses.join("");
  const blobUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));

  try {
    // The payload is a self-contained IIFE, so execute it as a classic script.
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const onError = (event) => {
        window.removeEventListener("error", onError);
        reject(event.error || new Error(event.message || "Dashboard script execution failed"));
      };
      window.addEventListener("error", onError, { once: true });
      script.src = blobUrl;
      script.onload = () => {
        window.removeEventListener("error", onError);
        resolve();
      };
      script.onerror = () => {
        window.removeEventListener("error", onError);
        reject(new Error("The dashboard application bundle could not be executed."));
      };
      document.head.appendChild(script);
    });
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
})().catch((error) => {
  console.error("Quote Status Dashboard failed to start:", error);
  const root = document.querySelector("#quote-dashboard");
  if (root) {
    const notice = document.createElement("p");
    notice.setAttribute("role", "alert");
    notice.style.cssText = "margin:12px 24px;padding:12px;border:1px solid #b45309;border-radius:8px;color:#fbbf24;background:#451a03";
    notice.textContent = "The dashboard could not load: " + (error && error.message ? error.message : "Unknown startup error") + ". Open the browser console for details.";
    root.insertBefore(notice, root.firstChild);
  }
});