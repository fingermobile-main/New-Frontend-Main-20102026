import React, { useState } from 'react';
import { flamingoService, FlamingoMeasurements } from '../../services/flamingoService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Save } from 'lucide-react';

interface FlamingoMeasurementFormProps {
  userId: string;
  onSave?: (measurements: FlamingoMeasurements) => void;
}

const FlamingoMeasurementForm: React.FC<FlamingoMeasurementFormProps> = ({ userId, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<FlamingoMeasurements>>({
    height_cm: undefined,
    weight_kg: undefined,
    body_type: 'average',
    chest_cm: undefined,
    waist_cm: undefined,
    hips_cm: undefined,
    shoulder_width_cm: undefined,
    arm_length_cm: undefined,
    inseam_cm: undefined,
    thigh_cm: undefined,
    foot_length_cm: undefined,
    shoe_size_us: undefined,
    preferred_fit: 'regular',
    is_public: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const measurements = await flamingoService.saveMeasurements(userId, formData);
      onSave?.(measurements);
    } catch (error) {
      console.error('Failed to save measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FlamingoMeasurements, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Measurements</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your measurements for personalized size recommendations
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height_cm || ''}
                onChange={(e) => handleChange('height_cm', parseFloat(e.target.value))}
                placeholder="175"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight_kg || ''}
                onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value))}
                placeholder="70"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bodyType">Body Type</Label>
            <Select
              value={formData.body_type}
              onValueChange={(value: string) => handleChange('body_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slim">Slim</SelectItem>
                <SelectItem value="athletic">Athletic</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="curvy">Curvy</SelectItem>
                <SelectItem value="plus">Plus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upper Body */}
          <div>
            <h3 className="font-semibold mb-3">Upper Body</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chest">Chest (cm)</Label>
                <Input
                  id="chest"
                  type="number"
                  value={formData.chest_cm || ''}
                  onChange={(e) => handleChange('chest_cm', parseFloat(e.target.value))}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="waist">Waist (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  value={formData.waist_cm || ''}
                  onChange={(e) => handleChange('waist_cm', parseFloat(e.target.value))}
                  placeholder="85"
                />
              </div>
              <div>
                <Label htmlFor="hips">Hips (cm)</Label>
                <Input
                  id="hips"
                  type="number"
                  value={formData.hips_cm || ''}
                  onChange={(e) => handleChange('hips_cm', parseFloat(e.target.value))}
                  placeholder="95"
                />
              </div>
              <div>
                <Label htmlFor="shoulders">Shoulder Width (cm)</Label>
                <Input
                  id="shoulders"
                  type="number"
                  value={formData.shoulder_width_cm || ''}
                  onChange={(e) => handleChange('shoulder_width_cm', parseFloat(e.target.value))}
                  placeholder="45"
                />
              </div>
            </div>
          </div>

          {/* Lower Body */}
          <div>
            <h3 className="font-semibold mb-3">Lower Body</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inseam">Inseam (cm)</Label>
                <Input
                  id="inseam"
                  type="number"
                  value={formData.inseam_cm || ''}
                  onChange={(e) => handleChange('inseam_cm', parseFloat(e.target.value))}
                  placeholder="80"
                />
              </div>
              <div>
                <Label htmlFor="thigh">Thigh (cm)</Label>
                <Input
                  id="thigh"
                  type="number"
                  value={formData.thigh_cm || ''}
                  onChange={(e) => handleChange('thigh_cm', parseFloat(e.target.value))}
                  placeholder="55"
                />
              </div>
            </div>
          </div>

          {/* Shoes */}
          <div>
            <h3 className="font-semibold mb-3">Shoes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="footLength">Foot Length (cm)</Label>
                <Input
                  id="footLength"
                  type="number"
                  value={formData.foot_length_cm || ''}
                  onChange={(e) => handleChange('foot_length_cm', parseFloat(e.target.value))}
                  placeholder="26"
                />
              </div>
              <div>
                <Label htmlFor="shoeSize">US Shoe Size</Label>
                <Input
                  id="shoeSize"
                  type="number"
                  step="0.5"
                  value={formData.shoe_size_us || ''}
                  onChange={(e) => handleChange('shoe_size_us', parseFloat(e.target.value))}
                  placeholder="9"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <Label htmlFor="fitPreference">Preferred Fit</Label>
            <Select
              value={formData.preferred_fit}
              onValueChange={(value: string) => handleChange('preferred_fit', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fit preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slim">Slim</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
                <SelectItem value="oversized">Oversized</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Measurements'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FlamingoMeasurementForm;
