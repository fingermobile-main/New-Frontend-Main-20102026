import React, { useState } from 'react';
import { Image, Type, Move, RotateCw, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Slider } from '@/components/ui/Slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';

interface WatermarkPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  onApply?: (watermarkConfig: any) => void;
}

const WatermarkPreviewModal: React.FC<WatermarkPreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onApply
}) => {
  const [watermarkText, setWatermarkText] = React.useState('© 2026');
  const [opacity, setOpacity] = React.useState(50);
  const [position, setPosition] = React.useState('bottom-right');
  const [fontSize, setFontSize] = React.useState(24);
  const [color, setColor] = React.useState('#ffffff');

  const handleApply = () => {
    onApply?.({
      text: watermarkText,
      opacity,
      position,
      fontSize,
      color
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Watermark Preview
          </DialogTitle>
          <DialogDescription>
            Customize and preview your watermark before applying
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="watermark-text">Watermark Text</Label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="watermark-text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Opacity: {opacity}%</Label>
              <Slider
                value={[opacity]}
                onValueChange={(value: number[]) => setOpacity(value[0])}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Size: {fontSize}px</Label>
              <Slider
                value={[fontSize]}
                onValueChange={(value: number[]) => setFontSize(value[0])}
                min={12}
                max={72}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"  />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image loaded
                </div>
              )}
              <div
                className="absolute pointer-events-none font-bold"
                style={{
                  opacity: opacity / 100,
                  fontSize: `${fontSize}px`,
                  color: color,
                  ...(position === 'top-left' && { top: '10px', left: '10px' }),
                  ...(position === 'top-right' && { top: '10px', right: '10px' }),
                  ...(position === 'center' && {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }),
                  ...(position === 'bottom-left' && { bottom: '10px', left: '10px' }),
                  ...(position === 'bottom-right' && { bottom: '10px', right: '10px' })
                }}
              >
                {watermarkText}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            <Download className="h-4 w-4 mr-2" />
            Apply Watermark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WatermarkPreviewModal;
