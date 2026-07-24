import { useEffect, useRef, memo } from "react";
import { toast } from "sonner";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = memo(({ content, className }: MarkdownRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const preElements = containerRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      if (pre.querySelector(".copy-code-btn")) return;

      pre.style.position = "relative";
      pre.style.paddingRight = "3rem";

      const button = document.createElement("button");
      button.className =
        "copy-code-btn absolute right-3 top-3 p-1.5 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer flex items-center justify-center";
      button.type = "button";
      button.setAttribute("aria-label", "Copy code");

      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      `;

      button.addEventListener("click", () => {
        const code = pre.querySelector("code");
        if (!code) return;

        const textToCopy = code.innerText;

        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            button.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><path d="M20 6 9 17l-5-5"/></svg>
            `;
            toast.success("Kode berhasil disalin!");

            setTimeout(() => {
              button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              `;
            }, 2000);
          })
          .catch((err) => {
            console.error("Gagal menyalin kode:", err);
            toast.error("Gagal menyalin kode.");
          });
      });

      pre.appendChild(button);
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={
        className ||
        "prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-display prose-p:text-muted-foreground/95 prose-a:text-primary leading-relaxed"
      }
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
});

MarkdownRenderer.displayName = "MarkdownRenderer";
