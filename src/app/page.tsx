'use client';

import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setText('');
      setProgress('');
    }
  };

  const recognizeText = async () => {
    if (!image) return;

    setLoading(true);
    setProgress('Initializing OCR engine...');

    try {
      const result = await Tesseract.recognize(
        image,
        'eng', // change to 'eng+fra', 'deu', etc. if needed
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(`Progress: ${Math.round(m.progress * 100)}%`);
            }
          },
        }
      );
      setText(result.data.text);
      setProgress('Done!');
    } catch (err: any) {
      setText('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Document Text Scanner (Next.js + Tesseract.js)
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          {image && (
            <div className="mt-8">
              <img
                src={image}
                alt="Uploaded document"
                className="max-w-full h-auto rounded border border-gray-300 mx-auto"
              />
              <div className="mt-6 text-center">
                <button
                  onClick={recognizeText}
                  disabled={loading}
                  className={`px-8 py-4 rounded text-white font-semibold text-lg ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Scanning…' : 'Extract Text'}
                </button>
                {progress && <p className="mt-4 text-lg">{progress}</p>}
              </div>
            </div>
          )}

          {text && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Extracted Text:</h2>
              <pre className="bg-gray-100 p-6 rounded-lg overflow-x-auto text-left whitespace-pre-wrap">
                {text}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(text)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}