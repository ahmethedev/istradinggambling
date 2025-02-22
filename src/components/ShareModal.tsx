import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Share2, Copy, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export default function ShareModal({ isOpen, onClose, imageUrl }: ShareModalProps) {
  const { t } = useTranslation();

  const handleCopyLink = async () => {
    if (imageUrl) {
      try {
        await navigator.clipboard.writeText(imageUrl);
        toast.success(t('share.linkCopied'));
      } catch (err) {
        toast.error(t('share.copyError'));
      }
    }
  };

  const handleTwitterShare = () => {
    if (imageUrl) {
      const text = t('share.twitterText');
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center">
            <Share2 className="mx-auto h-12 w-12 text-indigo-600" />
            <Dialog.Title className="mt-4 text-lg font-medium text-gray-900">
              {t('share.title')}
            </Dialog.Title>
          </div>

          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Simulation Results"
                className="w-full rounded-lg shadow-lg"
              />
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {t('share.copyLink')}
                </button>
                
                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1DA1F2] hover:bg-[#1a8cd8]"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  {t('share.shareTwitter')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}