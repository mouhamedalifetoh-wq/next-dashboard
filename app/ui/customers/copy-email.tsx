'use client';

import { useState } from 'react';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (insecure context, permissions): nothing to do.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="v-icon-btn h-7 w-7 shrink-0"
      aria-label={copied ? 'Email copied' : 'Copy email address'}
      title="Copy email"
    >
      {copied ? (
        <CheckIcon className="w-4 text-virus-neon" />
      ) : (
        <ClipboardDocumentIcon className="w-4" />
      )}
    </button>
  );
}
