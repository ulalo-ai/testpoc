import { useState } from 'react';
import { Copy, RefreshCw, Heart, Download } from 'lucide-react';

export default function QuoteGenerator() {
  const [quote, setQuote] = useState('');
  const [french, setFrench] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: `Generate one inspiring quote for social media. Return ONLY this format with no extra text:

ENGLISH: [motivational quote with emojis and 2-3 hashtags, max 280 chars]
FRENCH: [same quote in French with emojis and hashtags, max 280 chars]
KEYWORD: [one keyword for image search]`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content[0].text;
      
      const englishMatch = text.match(/ENGLISH:\s*(.+?)(?=FRENCH:)/s);
      const frenchMatch = text.match(/FRENCH:\s*(.+?)(?=KEYWORD:)/s);
      const keywordMatch = text.match(/KEYWORD:\s*(.+?)$/s);
      
      const englishQuote = englishMatch ? englishMatch[1].trim() : '💡 Keep pushing forward! Success comes to those who never give up. 🚀 #Motivation #Success #DailyInspiration';
      const frenchQuote = frenchMatch ? frenchMatch[1].trim() : '💡 Continue à avancer! Le succès vient à ceux qui ne renoncent jamais. 🚀 #Motivation #Succes #InspirationQuotidienne';
      const keywords = keywordMatch ? keywordMatch[1].trim() : 'motivation success';
      
      setQuote(englishQuote);
      setFrench(frenchQuote);
      setLiked(false);

      try {
        const searchTerms = `nature inspirational animals ${keywords}`;
        const imageResponse = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchTerms)}&orientation=landscape&w=1200&h=630&client_id=a3BcJoWoHiJrVYdWFJULkNZjxoKUHdZTtADc8R5-QAg`
        );
        const imageData = await imageResponse.json();
        setImageUrl(imageData.urls?.regular || imageData.urls?.full || 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200&h=630&fit=crop');
      } catch {
        setImageUrl('https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200&h=630&fit=crop');
      }

    } catch (error) {
      console.error('Error:', error);
      setQuote('💡 Keep pushing forward! Success comes to those who never give up. 🚀 #Motivation #Success #DailyInspiration');
      setFrench('💡 Continue à avancer! Le succès vient à ceux qui ne renoncent jamais. 🚀 #Motivation #Succes #InspirationQuotidienne');
      setImageUrl('https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200&h=630&fit=crop');
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'inspiration-quote.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2">
              Fabrice Personal Devotions
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Daily inspiration + images for X & Instagram 🌍 ✨</p>
          </div>

          {/* Image Display */}
          {imageUrl && (
            <div className="mb-6">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">📸 Inspirational Image</h2>
              <div 
                className="rounded-xl overflow-hidden shadow-lg border-2 border-indigo-200 bg-gray-200 h-48 sm:h-64"
                style={{
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <img 
                  src={imageUrl} 
                  alt="Inspirational" 
                  className="w-full h-full object-cover opacity-0" 
                  onError={(e) => {
                    e.target.parentElement.style.backgroundImage = 'url(https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200&h=630&fit=crop)';
                  }}
                />
              </div>
              <button
                onClick={downloadImage}
                className="w-full mt-2 sm:mt-3 bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
                aria-label="Download image"
              >
                <Download size={18} />
                <span>Download Image</span>
              </button>
            </div>
          )}

          {/* English Quote Display */}
          <div className="mb-5 sm:mb-6">
            <h2 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">🇺🇸 English</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 min-h-24 flex items-center border-2 border-indigo-200">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium">
                {quote || "Click 'Generate Quote' to create your daily inspiration!"}
              </p>
            </div>
            {quote && (
              <button
                onClick={() => copyToClipboard(quote)}
                className="w-full mt-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
                aria-label="Copy English quote"
              >
                <Copy size={16} />
                {copied ? 'Copied!' : 'Copy English'}
              </button>
            )}
          </div>

          {/* French Quote Display */}
          {french && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">🇫🇷 Français</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 min-h-24 flex items-center border-2 border-indigo-200">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium">
                  {french}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(french)}
                className="w-full mt-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
                aria-label="Copy French quote"
              >
                <Copy size={16} />
                {copied ? 'Copied!' : 'Copy French'}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-5 sm:mb-6 mt-6 sm:mt-8">
            <button
              onClick={generateQuote}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-sm sm:text-base"
              aria-label="Generate new quote"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Generating...' : 'Generate'}</span>
            </button>

            {quote && (
              <button
                onClick={() => setLiked(!liked)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all active:scale-95 ${
                  liked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={liked ? 'Unlike quote' : 'Like quote'}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 sm:p-4 rounded text-xs sm:text-sm text-amber-900">
            <p className="font-semibold mb-1">💡 Pro Tips:</p>
            <ul className="space-y-1 text-amber-800 text-xs">
              <li>• Download image & pair with your quote</li>
              <li>• Post in English & French for wider reach</li>
              <li>• Generate multiple and pick favorites</li>
              <li>• Share daily for consistent engagement</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 text-gray-600 text-xs sm:text-sm">
          <p>Share positivity every day! ✨ 🙏</p>
        </div>
      </div>
    </div>
  );
}
