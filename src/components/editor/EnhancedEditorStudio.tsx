import React, { useState } from 'react';
import {
  SparklesIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CloudArrowUpIcon,
  MusicalNoteIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  MicrophoneIcon,
  PhotoIcon,
  LinkIcon,
  FaceSmileIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';

export type AttachmentType =
  | 'gift_tip'
  | 'fic_transfer'
  | 'commerce_embed'
  | 'audio_embed'
  | 'voice_note'
  | 'uhd_media'
  | 'social_link'
  | 'uhd_sticker'
  | 'heavy_document';

export interface PostcardAttachment {
  type: AttachmentType;
  data: Record<string, unknown>;
}

export interface PostcardPayload {
  caption: string;
  is_ai_generated: boolean;
  ai_badge_label?: string;
  attachments: PostcardAttachment[];
  audience_demographics?: Record<string, unknown>;
}

interface EnhancedEditorStudioProps {
  // eslint-disable-next-line no-unused-vars
  onPostcardPublished?: (postcard: PostcardPayload) => void;
}

const AI_BADGE_OPTIONS = [
  'AI-Generated Art',
  'AI-Assisted Text',
  'Deepfake Synthetic',
  'Automated Translation',
  'Fully Synthetic Media'
];

const EnhancedEditorStudio: React.FC<EnhancedEditorStudioProps> = ({ onPostcardPublished }) => {
  const [caption, setCaption] = useState('');
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [aiBadgeLabel, setAiBadgeLabel] = useState(AI_BADGE_OPTIONS[0]);
  const [attachments, setAttachments] = useState<PostcardAttachment[]>([]);
  const [activeAttachmentDrawer, setActiveAttachmentDrawer] = useState<AttachmentType | null>(null);

  // Form states for individual attachments
  const [giftAmount, setGiftAmount] = useState('100');
  const [giftCurrency, setGiftCurrency] = useState<'GEMS' | 'FIC'>('GEMS');
  const [giftMessage, setGiftMessage] = useState('');

  const [ficRecipient, setFicRecipient] = useState('');
  const [ficAmount, setFicAmount] = useState('50');

  const [productTitle, setProductTitle] = useState('');
  const [productId, setProductId] = useState('');
  const [productPrice, setProductPrice] = useState('2500');

  const [audioTitle, setAudioTitle] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioBpm, setAudioBpm] = useState('128');

  const [voiceDuration, setVoiceDuration] = useState('45');
  const [voiceUrl, setVoiceUrl] = useState('https://storage.fingermobileprotocol.com/audio/voice-sample.mp3');

  const [uhdResolution, setUhdResolution] = useState('3840x2160 (4K UHD)');
  const [uhdMediaUrl, setUhdMediaUrl] = useState('');
  const [isHdr, setIsHdr] = useState(true);

  const [socialUrl, setSocialUrl] = useState('');
  const [socialTitle, setSocialTitle] = useState('');

  const [stickerName, setStickerName] = useState('Holographic Neon Finger');
  const [stickerId, setStickerId] = useState('sticker_holo_01');

  // Heavy 2GB Document Chunked Upload State
  const [heavyFileName, setHeavyFileName] = useState('');
  const [heavyFileSizeMb, setHeavyFileSizeMb] = useState('250');
  const [chunkUploadProgress, setChunkUploadProgress] = useState<number | null>(null);
  const [chunkUploadStatus, setChunkUploadStatus] = useState<string | null>(null);

  // Validation
  const isCaptionValid = caption.trim().length > 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleAddAttachment = (type: AttachmentType, data: Record<string, unknown>) => {
    setAttachments((prev) => [...prev, { type, data }]);
    setActiveAttachmentDrawer(null);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSimulateChunkedUpload = async () => {
    if (!heavyFileName.trim()) return;
    setChunkUploadProgress(0);
    setChunkUploadStatus('Initiating 2GB chunked upload protocol...');

    try {
      // Simulate chunk-by-chunk progress
      for (let p = 15; p <= 100; p += 25) {
        await new Promise((r) => setTimeout(r, 200));
        setChunkUploadProgress(p);
        setChunkUploadStatus(`Streaming chunk sequence... ${p}%`);
      }

      setChunkUploadStatus('Assembling byte hashes & verifying checksum...');
      await new Promise((r) => setTimeout(r, 250));

      handleAddAttachment('heavy_document', {
        filename: heavyFileName,
        sizeMb: parseFloat(heavyFileSizeMb) || 100,
        streamingUrl: `https://storage.fingermobileprotocol.com/heavy/${encodeURIComponent(heavyFileName)}`,
        checksumVerified: true
      });

      setChunkUploadProgress(null);
      setChunkUploadStatus('Chunked upload complete!');
      setHeavyFileName('');
    } catch {
      setChunkUploadStatus('Upload failed. Please check network connection.');
    }
  };

  const handlePublishPostcard = async () => {
    if (!isCaptionValid) return;
    setIsSubmitting(true);
    setSubmissionFeedback(null);

    const payload: PostcardPayload = {
      caption: caption.trim(),
      is_ai_generated: isAiGenerated,
      ai_badge_label: isAiGenerated ? aiBadgeLabel : undefined,
      attachments
    };

    try {
      const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      const response = await fetch('/api/postcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to publish postcard');
      }

      setSubmissionFeedback({
        type: 'success',
        message: 'Postcard successfully published to the FingerMobile network!'
      });
      setCaption('');
      setAttachments([]);
      setIsAiGenerated(false);

      if (onPostcardPublished) {
        onPostcardPublished(payload);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Publication failed';
      setSubmissionFeedback({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Postcard &amp; Rich Media Studio</h2>
            <p className="text-xs text-purple-100">
              UGC Postcards with Mandatory AI Labeling &amp; 9 Multi-Tier Attachments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-white/20 rounded-full font-mono">
            {attachments.length}/9 Attachments
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Feedback alert */}
        {submissionFeedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${
              submissionFeedback.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {submissionFeedback.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0 text-green-600" />
            ) : (
              <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 text-red-600" />
            )}
            <p className="text-sm font-medium">{submissionFeedback.message}</p>
          </div>
        )}

        {/* Caption Field with Mandatory Validation */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="postcard-caption" className="block text-sm font-semibold text-gray-800">
              Postcard Caption <span className="text-red-500">* (Mandatory)</span>
            </label>
            <span
              className={`text-xs font-mono ${
                isCaptionValid ? 'text-gray-500' : 'text-red-500 font-bold'
              }`}
            >
              {caption.trim().length} chars
            </span>
          </div>
          <textarea
            id="postcard-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write your postcard message or caption here... (Mandatory non-empty text required)"
            rows={4}
            className={`w-full p-4 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
              !caption && isSubmitting
                ? 'border-red-400 bg-red-50/30 focus:ring-red-500'
                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200 bg-gray-50/50'
            }`}
          />
          {!isCaptionValid && caption.length > 0 && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <ExclamationCircleIcon className="w-4 h-4" />
              Caption cannot consist of whitespace only.
            </p>
          )}
        </div>

        {/* AI-Generated Content Declaration Block */}
        <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-purple-600" />
              <div>
                <span className="text-sm font-bold text-gray-900">
                  AI-Generated Content Declaration
                </span>
                <p className="text-xs text-gray-500">
                  Transparency compliance: Declare synthetic, modified, or generative media
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAiGenerated}
                onChange={(e) => setIsAiGenerated(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {isAiGenerated && (
            <div className="pt-3 border-t border-purple-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label htmlFor="ai-badge-label-select" className="text-xs font-semibold text-purple-900 whitespace-nowrap">
                AI Badge Label:
              </label>
              <select
                id="ai-badge-label-select"
                value={aiBadgeLabel}
                onChange={(e) => setAiBadgeLabel(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs bg-white border border-purple-300 rounded-lg text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                {AI_BADGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="text-xs px-2.5 py-1 bg-purple-200 text-purple-800 rounded-md font-mono">
                Preview: 🤖 {aiBadgeLabel}
              </span>
            </div>
          )}
        </div>

        {/* 9 Attachment Type Quick Bar */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Attach Media &amp; Interactive Assets (Up to 9 Types)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('gift_tip')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'gift_tip'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-800 shadow-sm'
                  : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50 text-gray-700'
              }`}
            >
              <GiftIcon className="w-5 h-5 text-yellow-600" />
              <span className="text-[10px] font-bold">Gift Tip</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('fic_transfer')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'fic_transfer'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                  : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-700'
              }`}
            >
              <CurrencyDollarIcon className="w-5 h-5 text-emerald-600" />
              <span className="text-[10px] font-bold">FIC Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('commerce_embed')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'commerce_embed'
                  ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700'
              }`}
            >
              <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-bold">Commerce</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('audio_embed')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'audio_embed'
                  ? 'border-pink-500 bg-pink-50 text-pink-800 shadow-sm'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50 text-gray-700'
              }`}
            >
              <MusicalNoteIcon className="w-5 h-5 text-pink-600" />
              <span className="text-[10px] font-bold">BeatwaveNG</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('voice_note')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'voice_note'
                  ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-sm'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-700'
              }`}
            >
              <MicrophoneIcon className="w-5 h-5 text-orange-600" />
              <span className="text-[10px] font-bold">Voice Note</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('uhd_media')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'uhd_media'
                  ? 'border-purple-500 bg-purple-50 text-purple-800 shadow-sm'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700'
              }`}
            >
              <PhotoIcon className="w-5 h-5 text-purple-600" />
              <span className="text-[10px] font-bold">UHD Media</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('social_link')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'social_link'
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-800 shadow-sm'
                  : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 text-gray-700'
              }`}
            >
              <LinkIcon className="w-5 h-5 text-cyan-600" />
              <span className="text-[10px] font-bold">Social Link</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('uhd_sticker')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'uhd_sticker'
                  ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-sm'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 text-gray-700'
              }`}
            >
              <FaceSmileIcon className="w-5 h-5 text-teal-600" />
              <span className="text-[10px] font-bold">Sticker</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttachmentDrawer('heavy_document')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                activeAttachmentDrawer === 'heavy_document'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-800 shadow-sm'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-700'
              }`}
            >
              <DocumentArrowUpIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-[10px] font-bold">2GB Chunk</span>
            </button>
          </div>
        </div>

        {/* Active Attachment Configuration Drawer */}
        {activeAttachmentDrawer && (
          <div className="p-5 bg-gray-50 rounded-xl border border-slate-300 animate-fade-in space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 capitalize">
                Configure {activeAttachmentDrawer.replace('_', ' ')}
              </h4>
              <button
                type="button"
                onClick={() => setActiveAttachmentDrawer(null)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>

            {/* Gift Tip Drawer */}
            {activeAttachmentDrawer === 'gift_tip' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="gift-currency-select" className="text-xs font-semibold text-gray-700 block mb-1">Currency</label>
                  <select
                    id="gift-currency-select"
                    value={giftCurrency}
                    onChange={(e) => setGiftCurrency(e.target.value as 'GEMS' | 'FIC')}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="GEMS">💎 Gems</option>
                    <option value="FIC">🪙 FIC Tokens</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gift-amount-input" className="text-xs font-semibold text-gray-700 block mb-1">Amount</label>
                  <input
                    id="gift-amount-input"
                    type="number"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="gift-message-input" className="text-xs font-semibold text-gray-700 block mb-1">Greeting Message</label>
                  <input
                    id="gift-message-input"
                    type="text"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Enjoy this postcard gift!"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddAttachment('gift_tip', {
                        currency: giftCurrency,
                        amount: parseFloat(giftAmount) || 10,
                        message: giftMessage
                      })
                    }
                    className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-bold"
                  >
                    Add Gift Tip
                  </button>
                </div>
              </div>
            )}

            {/* FIC Transfer Drawer */}
            {activeAttachmentDrawer === 'fic_transfer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="fic-recipient-input" className="text-xs font-semibold text-gray-700 block mb-1">Recipient Handle or Address</label>
                  <input
                    id="fic-recipient-input"
                    type="text"
                    value={ficRecipient}
                    onChange={(e) => setFicRecipient(e.target.value)}
                    placeholder="@creator_wallet"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="fic-transfer-amount-input" className="text-xs font-semibold text-gray-700 block mb-1">FIC Amount</label>
                  <input
                    id="fic-transfer-amount-input"
                    type="number"
                    value={ficAmount}
                    onChange={(e) => setFicAmount(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddAttachment('fic_transfer', {
                        recipient: ficRecipient,
                        amount: parseFloat(ficAmount) || 1
                      })
                    }
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                  >
                    Attach FIC Transfer
                  </button>
                </div>
              </div>
            )}

            {/* Commerce Embed Drawer */}
            {activeAttachmentDrawer === 'commerce_embed' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="commerce-product-title-input" className="text-xs font-semibold text-gray-700 block mb-1">Product Title</label>
                  <input
                    id="commerce-product-title-input"
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="FingerMobile Merch Hoodie"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="commerce-sku-input" className="text-xs font-semibold text-gray-700 block mb-1">Product ID / SKU</label>
                  <input
                    id="commerce-sku-input"
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="PROD-FM-001"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="commerce-price-input" className="text-xs font-semibold text-gray-700 block mb-1">Price (₦ or FIC)</label>
                  <input
                    id="commerce-price-input"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddAttachment('commerce_embed', {
                        title: productTitle || 'Storefront Product',
                        productId: productId || 'PROD-01',
                        price: parseFloat(productPrice) || 1000
                      })
                    }
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                  >
                    Attach Commerce Embed
                  </button>
                </div>
              </div>
            )}

            {/* Audio Embed Drawer */}
            {activeAttachmentDrawer === 'audio_embed' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="audio-track-title-input" className="text-xs font-semibold text-gray-700 block mb-1">Track Title</label>
                  <input
                    id="audio-track-title-input"
                    type="text"
                    value={audioTitle}
                    onChange={(e) => setAudioTitle(e.target.value)}
                    placeholder="Afrobeats Sunrise"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="audio-stream-url-input" className="text-xs font-semibold text-gray-700 block mb-1">Stream URL / Beatwave ID</label>
                  <input
                    id="audio-stream-url-input"
                    type="text"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://audio.fingermobileprotocol.com/tracks/123.mp3"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="audio-bpm-input" className="text-xs font-semibold text-gray-700 block mb-1">BPM</label>
                  <input
                    id="audio-bpm-input"
                    type="number"
                    value={audioBpm}
                    onChange={(e) => setAudioBpm(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddAttachment('audio_embed', {
                        title: audioTitle || 'BeatwaveNG Stream',
                        url: audioUrl,
                        bpm: parseInt(audioBpm, 10) || 120
                      })
                    }
                    className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold"
                  >
                    Attach Beatwave Track
                  </button>
                </div>
              </div>
            )}

            {/* Voice Note Drawer */}
            {activeAttachmentDrawer === 'voice_note' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="voice-audio-url-input" className="text-xs font-semibold text-gray-700 block mb-1">Audio Clip URL</label>
                  <input
                    id="voice-audio-url-input"
                    type="text"
                    value={voiceUrl}
                    onChange={(e) => setVoiceUrl(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="voice-duration-input" className="text-xs font-semibold text-gray-700 block mb-1">Duration (seconds)</label>
                  <input
                    id="voice-duration-input"
                    type="number"
                    value={voiceDuration}
                    onChange={(e) => setVoiceDuration(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddAttachment('voice_note', {
                        url: voiceUrl,
                        durationSec: parseInt(voiceDuration, 10) || 30
                      })
                    }
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold"
                  >
                    Attach Voice Note
                  </button>
                </div>
              </div>
            )}

            {/* UHD Media Drawer */}
            {activeAttachmentDrawer === 'uhd_media' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor="uhd-media-url-input" className="text-xs font-semibold text-gray-700 block mb-1">4K/8K Media Asset URL</label>
                  <input
                    id="uhd-media-url-input"
                    type="text"
                    value={uhdMediaUrl}
                    onChange={(e) => setUhdMediaUrl(e.target.value)}
                    placeholder="https://media.fingermobileprotocol.com/uhd/4k-film.mp4"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="uhd-resolution-select" className="text-xs font-semibold text-gray-700 block mb-1">Resolution Standard</label>
                  <select
                    id="uhd-resolution-select"
                    value={uhdResolution}
                    onChange={(e) => setUhdResolution(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="3840x2160 (4K UHD)">3840x2160 (4K UHD)</option>
                    <option value="7680x4320 (8K FUHD)">7680x4320 (8K FUHD)</option>
                  </select>
                </div>
                <div className="sm:col-span-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={isHdr}
                      onChange={(e) => setIsHdr(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    HDR10+ / Dolby Vision Color Profile
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddAttachment('uhd_media', {
                        url: uhdMediaUrl || 'https://storage.fingermobileprotocol.com/uhd/sample.mp4',
                        resolution: uhdResolution,
                        hdr: isHdr
                      })
                    }
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
                  >
                    Attach UHD Media
                  </button>
                </div>
              </div>
            )}

            {/* Social Link Drawer */}
            {activeAttachmentDrawer === 'social_link' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="social-link-url-input" className="text-xs font-semibold text-gray-700 block mb-1">Target Link URL</label>
                  <input
                    id="social-link-url-input"
                    type="text"
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder="https://fingermobileprotocol.com/doc"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="social-link-title-input" className="text-xs font-semibold text-gray-700 block mb-1">Link Title / Anchor</label>
                  <input
                    id="social-link-title-input"
                    type="text"
                    value={socialTitle}
                    onChange={(e) => setSocialTitle(e.target.value)}
                    placeholder="fingermobileprotocol Specification"
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddAttachment('social_link', {
                        url: socialUrl,
                        title: socialTitle || socialUrl
                      })
                    }
                    className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold"
                  >
                    Attach Social Link
                  </button>
                </div>
              </div>
            )}

            {/* Sticker Drawer */}
            {activeAttachmentDrawer === 'uhd_sticker' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sticker-name-input" className="text-xs font-semibold text-gray-700 block mb-1">Sticker Name</label>
                  <input
                    id="sticker-name-input"
                    type="text"
                    value={stickerName}
                    onChange={(e) => setStickerName(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="sticker-id-input" className="text-xs font-semibold text-gray-700 block mb-1">Sticker ID</label>
                  <input
                    id="sticker-id-input"
                    type="text"
                    value={stickerId}
                    onChange={(e) => setStickerId(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddAttachment('uhd_sticker', {
                        stickerId,
                        name: stickerName,
                        animated: true
                      })
                    }
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold"
                  >
                    Attach Sticker
                  </button>
                </div>
              </div>
            )}

            {/* Heavy 2GB Document Chunked Upload Drawer */}
            {activeAttachmentDrawer === 'heavy_document' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="heavy-filename-input" className="text-xs font-semibold text-gray-700 block mb-1">Document File Name</label>
                    <input
                      id="heavy-filename-input"
                      type="text"
                      value={heavyFileName}
                      onChange={(e) => setHeavyFileName(e.target.value)}
                      placeholder="Protocol-Master-Archive-2GB.iso"
                      className="w-full p-2 text-xs border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="heavy-filesize-input" className="text-xs font-semibold text-gray-700 block mb-1">File Size (MB - up to 2048MB)</label>
                    <input
                      id="heavy-filesize-input"
                      type="number"
                      max="2048"
                      value={heavyFileSizeMb}
                      onChange={(e) => setHeavyFileSizeMb(e.target.value)}
                      className="w-full p-2 text-xs border rounded-lg bg-white"
                    />
                  </div>
                </div>

                {chunkUploadProgress !== null && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 transition-all duration-200"
                        style={{ width: `${chunkUploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] font-mono text-indigo-700">{chunkUploadStatus}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!heavyFileName.trim() || chunkUploadProgress !== null}
                    onClick={handleSimulateChunkedUpload}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    Stream &amp; Chunk Upload (2GB Engine)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attached Items List */}
        {attachments.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-700 mb-2">Attached Items ({attachments.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {attachments.map((att, idx) => (
                <div
                  key={`${att.type}-${idx}`}
                  className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg flex items-center gap-2 text-xs"
                >
                  <PaperClipIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-semibold text-gray-800 capitalize">
                    {att.type.replace('_', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(idx)}
                    className="text-gray-400 hover:text-red-500 font-bold ml-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Postcard Publish Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {isCaptionValid ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" /> Ready to publish
              </span>
            ) : (
              <span className="text-gray-400">Caption required to publish</span>
            )}
          </div>

          <button
            type="button"
            disabled={!isCaptionValid || isSubmitting}
            onClick={handlePublishPostcard}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Postcard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEditorStudio;
