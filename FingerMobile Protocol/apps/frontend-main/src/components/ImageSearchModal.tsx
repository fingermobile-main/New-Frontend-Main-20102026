/*
 * FingerMobile Protocol™ - Image Search Modal
 * Re-exports the unified Sovereign Commerce Visual Search Modal
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React from 'react';
import {
  CommerceVisualSearchModal,
  VisualSearchResultItem
} from './commerce/CommerceVisualSearchModal';

export interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect?: (imageUrl: string) => void;
  onSelectProduct?: (product: VisualSearchResultItem) => void;
  initialStore?: 'all' | 'marketplace' | 'ownit' | 'flamingo' | 'storefront' | 'fingerlux';
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  onSelectProduct,
  initialStore = 'all'
}) => {
  return (
    <CommerceVisualSearchModal
      isOpen={isOpen}
      onClose={onClose}
      initialStore={initialStore}
      onSelectProduct={(product) => {
        if (onImageSelect) {
          onImageSelect(product.image_url);
        }
        if (onSelectProduct) {
          onSelectProduct(product);
        }
      }}
    />
  );
};

export default ImageSearchModal;
