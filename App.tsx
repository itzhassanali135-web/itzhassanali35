
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import HistoryCard from './components/HistoryCard';
import { transformImage } from './services/geminiService';
import { AppStatus, ImageState, TransformationResult } from './types';

// Main Application Component
const App: React.FC = () => {
  const [images, setImages] = useState<ImageState>({ source: null, reference: null });
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TransformationResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TransformationResult | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleTransform = async () => {
    if (!images.source || !images.reference) {
      setError("Please ensure both images are uploaded.");
      return;
    }

    try {
      setStatus(AppStatus.TRANSFORMING);
      setError(null);
      
      const resultImageUrl = await transformImage(images.source, images.reference, prompt);
      
      const newResult: TransformationResult = {
        id: crypto.randomUUID(),
        sourceUrl: images.source,
        referenceUrl: images.reference,
        resultUrl: resultImageUrl,
        timestamp: Date.now(),
        prompt: prompt
      };

      setCurrentResult(newResult);
      setHistory(prev => [newResult, ...prev]);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error("App Error:", err);
      setError(err.message || "An unexpected error occurred during transformation.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setImages({ source: null, reference: null });
    setCurrentResult(null);
    setStatus(AppStatus.IDLE);
    setError(null);
    setPrompt("");
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              StyleMorph
            </span>
          </div>
          <button 
            onClick={() => setIsAboutOpen(!isAboutOpen)}
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            How it works
          </button>
        </div>
      </nav>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg relative">
            <button onClick={() => setIsAboutOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-bold mb-4 text-white">How it works</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Our AI extracts the aesthetic profile from your reference image—colors, textures, and lighting—and applies it to your photo while perfectly preserving its content and facial identity.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center font-bold">1</div>
                <p className="text-slate-300">Upload a style reference image.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center font-bold">2</div>
                <p className="text-slate-300">Upload the target photo to be styled.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center font-bold">3</div>
                <p className="text-slate-300">Generate a high-quality style transfer.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Transform Your <span className="text-indigo-500">Style</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Apply the aesthetic of any reference image to your photos using advanced AI style transfer.
          </p>
        </div>

        {/* Uploader Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ImageUploader 
            label="1. Reference Style"
            image={images.reference}
            onImageSelect={(img) => setImages(prev => ({ ...prev, reference: img }))}
            description="The aesthetic, colors, and lighting will be used."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12" /></svg>}
          />
          <ImageUploader 
            label="2. Your Photo"
            image={images.source}
            onImageSelect={(img) => setImages(prev => ({ ...prev, source: img }))}
            description="The content and subject will be preserved."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
        </div>

        {/* Prompt Input */}
        <div className="max-w-2xl mx-auto mb-12">
           <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider block mb-2">Additional Instructions (Optional)</label>
           <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'Make it more vibrant', 'Add a slight film grain'..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-200"
            rows={3}
           />
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleTransform}
            disabled={status === AppStatus.TRANSFORMING || !images.source || !images.reference}
            className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl
              ${status === AppStatus.TRANSFORMING 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'}
            `}
          >
            {status === AppStatus.TRANSFORMING ? 'Morphing...' : 'Start Style Transfer'}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Result Area */}
        {currentResult && status === AppStatus.SUCCESS && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center">Your Result</h2>
            <div className="max-w-2xl mx-auto glass rounded-3xl p-4 shadow-2xl overflow-hidden">
               <img src={currentResult.resultUrl} alt="Result" className="w-full rounded-2xl shadow-inner" />
               <div className="mt-6 flex justify-between items-center p-2">
                 <button 
                  onClick={reset}
                  className="text-slate-400 hover:text-white transition-colors font-medium"
                 >
                   Start Over
                 </button>
                 <a 
                  href={currentResult.resultUrl} 
                  download="morphed-image.png"
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-colors font-medium"
                 >
                   Download
                 </a>
               </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-24 border-t border-slate-900 pt-20">
            <h2 className="text-2xl font-bold mb-12">Recent Generations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {history.map(item => (
                <HistoryCard key={item.id} result={item} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
