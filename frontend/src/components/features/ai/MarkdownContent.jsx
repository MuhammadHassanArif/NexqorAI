import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../../utils/cn";

// How each part of the AI's Markdown answer looks. The page already has an <h1>, so headings start at <h2>.
// Raw HTML inside the answer is never shown (react-markdown ignores it), so an answer cannot inject scripts.
const components = {
  h1: ({ children }) => <h2 className="pt-2 text-xl font-semibold text-ink">{children}</h2>,
  h2: ({ children }) => <h3 className="pt-2 text-lg font-semibold text-ink">{children}</h3>,
  h3: ({ children }) => <h4 className="pt-1 text-base font-semibold text-ink">{children}</h4>,
  h4: ({ children }) => <h5 className="pt-1 text-base font-semibold text-ink">{children}</h5>,
  ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-5 marker:text-primary-400">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1.5 pl-5 marker:text-primary-500">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary-600 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary-200 pl-4 text-ink-soft">{children}</blockquote>
  ),
  hr: () => <hr className="border-line" />,
  // Wide tables scroll sideways inside their own box, so the page never gets wider than the screen
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-line bg-primary-50 px-3 py-2 font-semibold text-ink">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-line px-3 py-2 align-top">{children}</td>,
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl bg-ink p-4 text-sm leading-relaxed text-white">{children}</pre>
  ),
  code: ({ children, className }) => (
    <code className={cn("rounded bg-primary-50 px-1.5 py-0.5 font-mono text-[0.9em] text-primary-700", className)}>
      {children}
    </code>
  ),
};

// Shows the AI's answer (Markdown text) as a nicely formatted document.
export function MarkdownContent({ children }) {
  return (
    <div className="space-y-3 break-words text-sm leading-relaxed text-ink sm:text-base [&_pre_code]:rounded-none [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}