import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyRedirect(key, path, options = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
        return; // don't trigger inside typing fields
      }

      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = options.ctrl ? event.ctrlKey : true;
      const shiftMatch = options.shift ? event.shiftKey : true;
      const altMatch = options.alt ? event.altKey : true;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        navigate(path);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, path, options, navigate]);
}
