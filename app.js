/* Loads the dashboard's bundled application source in ordered segments. */
(async () => {
  const base = "https://raw.githubusercontent.com/mehradharmanshu013-spec/R-M/main/assets/";
  const parts = ["app-01.part","app-02.part","app-03.part","app-04.part","app-05.part","app-06.part","app-07.part","app-08.part","app-09.part","app-10.part","app-11.part","app-12.part","app-13.part","app-14.part","app-15.part"];
  const responses = await Promise.all(parts.map(async (name) => {
    const response = await fetch(base + name);
    if (!response.ok) throw new Error("Could not load dashboard asset: " + name);
    return response.text();
  }));
  const source = responses.join("");
  const blobUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  try { await import(blobUrl); } finally { URL.revokeObjectURL(blobUrl); }
})().catch((error) => {
  console.error("Quote Status Dashboard failed to start:", error);
  const root = document.querySelector("#quote-dashboard");
  if (root) root.insertAdjacentHTML("afterbegin", '<p role="alert">The dashboard could not load. Please refresh the page.</p>');
});
