
import React from 'react';
import { TransformationResult } from '../types';

interface HistoryCardProps {
  result: TransformationResult;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ result }) => {
  return (
    <div className="glass rounded-2xl overflow-hidden group">
      <div className="relative aspect-square">
        <img src={result.resultUrl} alt="Result" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
           <p className="text-xs text-slate-300 line-clamp-2">{new Date(result.timestamp).toLocaleString()}</p>
        </div>
      </div>
      <div className="p-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
          <img src={result.sourceUrl} alt="Source" className="w-full h-full object-cover" />
        </div>
        <div className="text-indigo-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
          <img src={result.referenceUrl} alt="Reference" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
