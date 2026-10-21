import React, {} from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description?: string;
  features: PlanFeature[];
  popular?: boolean;
  icon?: React.ReactNode;
}

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onSelect?: (planId: string) => void;
  currentPlan?: string;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  onSelect,
  currentPlan
}) => {
  const isCurrentPlan = currentPlan === plan.id;

  return (
    <Card className={`relative border-slate-200 ${plan.popular ? 'border-primary ring-1 ring-primary shadow-lg' : ''}`}>
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-semibold">
          <Star className="h-3 w-3 mr-1" />
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {plan.icon || <Crown className="h-6 w-6 text-primary" />}
          <CardTitle className="text-slate-900 font-bold">{plan.name}</CardTitle>
        </div>
        <CardDescription className="text-slate-700 font-medium">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-900">
            ${plan.price}
            <span className="text-lg font-medium text-slate-700">
              /{plan.period}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check
                className={`h-5 w-5 flex-shrink-0 ${
                  feature.included ? 'text-green-600' : 'text-slate-500'
                }`}
              />
              <span
                className={`text-sm ${
                  feature.included ? 'text-slate-800 font-medium' : 'text-slate-500 line-through'
                }`}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? 'outline' : plan.popular ? 'default' : 'outline'}
          onClick={() => onSelect?.(plan.id)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPlanCard;
