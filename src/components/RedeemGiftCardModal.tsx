import React, { useState } from 'react';
import { Gift, QrCode, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import { Card, CardContent } from '@/components/ui/Card';

interface RedeemGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem?: (code: string) => void;
}

const RedeemGiftCardModal: React.FC<RedeemGiftCardModalProps> = ({
  isOpen,
  onClose,
  onRedeem
}) => {
  const [code, setCode] = React.useState('');
  const [isRedeeming, setIsRedeeming] = React.useState(false);
  const [redeemStatus, setRedeemStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [giftCardInfo, setGiftCardInfo] = React.useState<{
    amount: number;
    issuer: string;
    expiryDate: string;
  } | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) return;

    setIsRedeeming(true);

    // Simulate API call
    setTimeout(() => {
      const isValid = code.length >= 10;
      if (isValid) {
        setRedeemStatus('success');
        setGiftCardInfo({
          amount: 50,
          issuer: 'FingerMobile Protocol',
          expiryDate: '2027-12-31'
        });
        onRedeem?.(code);
      } else {
        setRedeemStatus('error');
      }
      setIsRedeeming(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRedeem();
    }
  };

  const resetForm = () => {
    setCode('');
    setRedeemStatus('idle');
    setGiftCardInfo(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" />
            Redeem Gift Card
          </DialogTitle>
          <DialogDescription>
            Enter your gift card code to add funds to your account
          </DialogDescription>
        </DialogHeader>

        {redeemStatus === 'idle' && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="gift-code">Gift Card Code</Label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="gift-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="pl-10 uppercase tracking-wider font-mono"
                  maxLength={19}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the 16-digit code from your gift card
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleRedeem}
              disabled={!code.trim() || isRedeeming}
            >
              {isRedeeming ? 'Verifying...' : 'Redeem'}
            </Button>
          </div>
        )}

        {redeemStatus === 'success' && giftCardInfo && (
          <div className="mt-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-green-700">Successfully Redeemed!</h3>
                    <p className="text-green-600 mt-1">
                      ${giftCardInfo.amount} has been added to your account
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Issuer: {giftCardInfo.issuer}</p>
                    <p>Expires: {new Date(giftCardInfo.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button className="w-full mt-4" onClick={onClose}>
              Continue
            </Button>
          </div>
        )}

        {redeemStatus === 'error' && (
          <div className="mt-4">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <X className="h-16 w-16 mx-auto text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold text-red-700">Invalid Code</h3>
                    <p className="text-red-600 mt-1">
                      The gift card code you entered is invalid or has expired
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={resetForm}>
                Try Again
              </Button>
              <Button className="flex-1" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {redeemStatus === 'idle' && (
          <DialogFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              Gift cards can be purchased from authorized retailers or received as gifts
            </p>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RedeemGiftCardModal;
