'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';

interface AssignmentsDisplayProps {
  message: string;
  taskResult?: any;
}

export default function AssignmentsDisplay({ message, taskResult }: AssignmentsDisplayProps) {
  const handleDownload = async (fileData: any) => {
    try {
      const response = await fetch('/api/flashcards/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: fileData.format,
          content: fileData.content,
          filename: fileData.filename,
          mimeType: fileData.mimeType
        })
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  return (
    <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8 shadow-2xl mb-8">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children, ...props }) => <h1 className="text-2xl font-bold mb-4 text-slate-100" {...props}>{children}</h1>,
            h2: ({ children, ...props }) => <h2 className="text-xl font-semibold mb-3 text-slate-100" {...props}>{children}</h2>,
            h3: ({ children, ...props }) => <h3 className="text-lg font-semibold mb-2 text-slate-100" {...props}>{children}</h3>,
            p: ({ children, ...props }) => <p className="mb-2 text-slate-100 leading-relaxed" {...props}>{children}</p>,
            ul: ({ children, ...props }) => <ul className="list-disc list-inside mb-2 text-slate-100" {...props}>{children}</ul>,
            ol: ({ children, ...props }) => <ol className="list-decimal list-inside mb-2 text-slate-100" {...props}>{children}</ol>,
            li: ({ children, ...props }) => <li className="mb-1 text-slate-100" {...props}>{children}</li>,
            strong: ({ children, ...props }) => <strong className="font-bold text-slate-100" {...props}>{children}</strong>,
            em: ({ children, ...props }) => <em className="italic text-slate-100" {...props}>{children}</em>,
            code: ({ children, ...props }) => <code className="bg-slate-600 px-1 py-0.5 rounded text-slate-100 text-sm" {...props}>{children}</code>,
            pre: ({ children, ...props }) => <pre className="bg-slate-600 p-3 rounded-lg overflow-x-auto mb-2" {...props}>{children}</pre>,
            blockquote: ({ children, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-200 mb-2" {...props}>{children}</blockquote>,
            a: ({ children, href, ...props }) => <a href={href} className="text-blue-400 hover:text-blue-300 underline" {...props}>{children}</a>,
          }}
        >
          {message}
        </ReactMarkdown>
      </div>

      {/* Flashcard Download Section */}
      {taskResult && taskResult.downloadFiles && taskResult.downloadFiles.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-600/50">
          <h3 className="text-lg font-semibold mb-4 text-slate-100">Download Flashcards</h3>
          <div className="flex flex-wrap gap-3">
            {taskResult.downloadFiles.map((file: any, index: number) => (
              <button
                key={index}
                onClick={() => handleDownload(file)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download size={16} />
                Download {file.format.toUpperCase()}
              </button>
            ))}
          </div>
          
          {taskResult.metadata && (
            <div className="mt-4 p-4 bg-slate-600/30 rounded-lg">
              <p className="text-slate-300 text-sm">
                <strong>Deck:</strong> {taskResult.metadata.deckName} | 
                <strong> Cards:</strong> {taskResult.metadata.totalCards} | 
                <strong> Difficulty:</strong> {taskResult.metadata.difficulty}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}