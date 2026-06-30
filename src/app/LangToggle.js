"use client";

import { useEffect, useState } from "react";

export default function LangToggleButton() {
  const [isHindi, setIsHindi] = useState(false);

  // On mount, check the current cookie to sync button state
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
    if (match && match[1] === "hi") {
      setIsHindi(true);
    }
  }, []);

  function setCookie(name, value, path = "/") {
    document.cookie = `${name}=${value}; path=${path}`;
    // Also set on the root domain (needed for Google Translate)
    document.cookie = `${name}=${value}; path=${path}; domain=${window.location.hostname}`;
  }

  function clearCookie(name, path = "/") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${window.location.hostname};`;
  }

  function toggleLang() {
    if (!isHindi) {
      // Switch to Hindi: set the googtrans cookie and reload
      setCookie("googtrans", "/en/hi");
      window.location.reload();
    } else {
      // Switch back to English: clear the cookie and reload
      clearCookie("googtrans");
      window.location.reload();
    }
  }

  return (
    <button
      id="lang-toggle-btn"
      onClick={toggleLang}
      title={isHindi ? "Switch to English" : "हिंदी में देखें"}
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
        transition: "transform 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        letterSpacing: "0.3px",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {isHindi ? "🌐 EN" : "🌐 हिं"}
    </button>
  );
}

