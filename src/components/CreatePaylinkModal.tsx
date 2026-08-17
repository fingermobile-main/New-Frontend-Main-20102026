import React, {} from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';

interface CreatePaylinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePaylink: () => Promise<void>;
  paylinkAmount: string;
  setPaylinkAmount: (amount: string) => void;
  paylinkdescription?: string;
  setPaylinkDescription: (description?: string) => void;
  ficBalance: number;
  isProcessing: boolean;
}

const CreatePaylinkModal: React.FC<CreatePaylinkModalProps> = ({ 
  isOpen,
  onClose,
  onCreatePaylink,
  paylinkAmount,
  setPaylinkAmount,
  paylinkDescription,
  setPaylinkDescription,
  ficBalance,
  isProcessing
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Paylink</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <input
              id="description"
              type="text"
              placeholder="What is this for?"
              value={paylinkDescription}
              onChange={(e) => setPaylinkDescription(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div>
            <label htmlFor="amount" className="text-sm font-medium">Amount (FIC)</label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={paylinkAmount}
              onChange={(e) => setPaylinkAmount(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="text-sm text-gray-500">
            Available Balance: <span className="font-semibold">{ficBalance} FIC</span>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
            <Button onClick={onCreatePaylink} disabled={isProcessing || !paylinkAmount || !paylinkDescription}>
              {isProcessing ? 'Creating...' : 'Create Paylink'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePaylinkModal;