interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  return (
    <pre className="bg-[#0a0a0a] border border-[#1f1f23] rounded-lg p-4 overflow-x-auto">
      <code className="text-[13px] font-mono text-[#e5e7eb] leading-relaxed whitespace-pre">
        {code}
      </code>
    </pre>
  );
}
