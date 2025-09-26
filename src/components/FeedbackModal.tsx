import React, { useState } from 'react';
import { X, Send, MessageSquare, AlertTriangle, Lightbulb, Star } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState<'oneri' | 'hata' | 'genel'>('oneri');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simüle edilmiş gönderim (gerçek uygulamada API çağrısı yapılır)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // 2 saniye sonra modalı kapat
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setMessage('');
      setEmail('');
      setRating(0);
      setFeedbackType('oneri');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Geri Bildiriminiz Alındı!</h3>
            <p className="text-gray-600">
              Değerli geri bildiriminiz için teşekkür ederiz. En kısa sürede değerlendireceğiz.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                Geri Bildirim
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Geri Bildirim Türü
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('oneri')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      feedbackType === 'oneri'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Lightbulb className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">Öneri</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('hata')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      feedbackType === 'hata'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">Hata</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('genel')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      feedbackType === 'genel'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <MessageSquare className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">Genel</div>
                  </button>
                </div>
              </div>

              {/* Rating (sadece genel geri bildirim için) */}
              {feedbackType === 'genel' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Sitemizi Değerlendirin
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {feedbackType === 'oneri' ? 'Öneriniz' : 
                   feedbackType === 'hata' ? 'Hata Detayları' : 'Mesajınız'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder={
                    feedbackType === 'oneri' 
                      ? 'Hangi hesaplama aracını eklemek istersiniz? Önerilerinizi paylaşın...'
                      : feedbackType === 'hata'
                      ? 'Karşılaştığınız hatayı detaylı olarak açıklayın...'
                      : 'Düşüncelerinizi bizimle paylaşın...'
                  }
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  E-posta (İsteğe Bağlı)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Geri dönüş istiyorsanız e-posta adresinizi paylaşabilirsiniz
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !message.trim() || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Gönder</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;