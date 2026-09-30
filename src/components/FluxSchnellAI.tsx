import React, { useState } from 'react';
import { Sparkles, Image, Wand2, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';

interface FluxSchnellAIProps {
  onGenerate?: (prompt: string, options: unknown) => void;
}

const FluxSchnellAI: React.FC<FluxSchnellAIProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = React.useState('');
  const [style, setStyle] = React.useState('realistic');
  const [aspectRatio, setAspectRatio] = React.useState('1:1');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI image generation
    setTimeout(() => {
      const mockImageUrl = `https://picsum.photos/800/800?random=${Date.now()}`;
      setGeneratedImage(mockImageUrl);
      setIsGenerating(false);
      onGenerate?.(prompt, { style, aspectRatio });
    }, 3000);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `flux-ai-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Flux Schnell AI Image Generator
          </CardTitle>
          <CardDescription>
            Create stunning images from text descriptions using advanced AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Be specific and detailed for better results
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="digital-art">Digital Art</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="3d-render">3D Render</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                  <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                  <SelectItem value="4:3">Standard (4:3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Image
              </>
            )}
          </Button>

          {generatedImage && (
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={generatedImage}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button variant="outline" className="w-full" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FluxSchnellAI;
