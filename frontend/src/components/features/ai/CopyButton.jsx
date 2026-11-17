import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../../ui/Button";

// Copies text to the clipboard and shows "Copied" for two seconds.
export function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older browsers, or a page that is not on HTTPS: use the old way
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }

    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      leftIcon={
        copied ? (
          <Check className="size-4 text-success" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )
      }
    >
      {copied ? "Copied" : label}
    </Button>
  );
}