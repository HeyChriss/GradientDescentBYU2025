'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AssignmentsDisplayProps {
  message: string;
}

export default function AssignmentsDisplay({ message }: AssignmentsDisplayProps) {
  return (
    <div className="bg-slate-800/70 text-slate-100 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto my-6">
      <ReactMarkdown
  components={{
    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-3" {...props} />,
    p: ({ node, ...props }) => <p className="mb-2" {...props} />,
    li: ({ node, ...props }) => (
      <div className="ml-0 mb-2" {...props} /> // no bullet, just margin
    ),
    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
  }}
>
  {message}
</ReactMarkdown>

    </div>
  );
}
