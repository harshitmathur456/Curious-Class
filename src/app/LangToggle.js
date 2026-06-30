"use client";

export default function LangToggleButton() {
  function setLang(lang) {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    } else {
      setTimeout(() => setLang(lang), 300);
    }
  }

  function toggleLang() {
    const btn = document.getElementById("lang-toggle-btn");
    const currentLang = btn.getAttribute("data-lang") || "en";
    if (currentLang === "en") {
      setLang("hi");
      btn.setAttribute("data-lang", "hi");
      btn.textContent = "🌐 EN";
    } else {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      btn.setAttribute("data-lang", "en");
      btn.textContent = "🌐 हिं";
      setTimeout(() => window.location.reload(), 150);
    }
  }

  return (
    <button
      id="lang-toggle-btn"
      data-lang="en"
      onClick={toggleLang}
      title="Toggle Hindi / English"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        background: "#2A7A50",
        color: "white",
        border: "none",
        borderRadius: "50px",
        padding: "10px 18px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(42,122,80,0.35)",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        letterSpacing: "0.3px",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      🌐 हिं
    </button>
  );
}
