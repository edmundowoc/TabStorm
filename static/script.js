const form = document.getElementById("trafficForm");
const output = document.getElementById("output");
const loader = document.getElementById("loader");
const startBtn = document.getElementById("startBtn");

const API_URL = "https://website-traffic-injector.onrender.com/run";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    output.classList.add("hidden");
    loader.classList.remove("hidden");

    const payload = {
        url: document.getElementById("url").value,
        visits: parseInt(document.getElementById("visits").value),
        proxy_type: document.getElementById("proxyType").value,
        proxy_data: document.getElementById("proxyData").value || null
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        loader.classList.add("hidden");
        output.classList.remove("hidden");
        output.textContent = JSON.stringify(data, null, 2);

    } catch (err) {
        loader.classList.add("hidden");
        output.classList.remove("hidden");
        output.textContent = "❌ Błąd połączenia z API:\n" + err;
    }
});
