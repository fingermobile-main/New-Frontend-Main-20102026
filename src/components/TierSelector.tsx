import React, { useState } from 'react';
interface TierSelectorProps {
  tiers?: Array<{
    id: string;
    name: string;
    price: number;
    features: string[];
    popular?: boolean;
    color?: string;
  }>;
  selectedTier?: string;
  onSelect?: (tierId: string) => void;
}

const TierSelector: React.FC<TierSelectorProps> = ({
  tiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: ['Access to basic content', 'Community support', 'Monthly updates'],
      popular: false,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 24.99,
      features: ['All Basic features', 'Priority support', 'Weekly updates', 'Advanced analytics', 'Custom branding'],
      popular: true,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      features: ['All Pro features', '24/7 dedicated support', 'Daily updates', 'API access', 'White-label solution', 'Custom integrations'],
      popular: false,
      color: 'green'
    }
  ],
  selectedTier,
  onSelect
}) => {
  const [selected, setSelected] = useState<string>(selectedTier || '');

  const handleSelect = (tierId: string) => {
    setSelected(tierId);
    if (onSelect) {
      onSelect(tierId);
    }
  };

  const getColorClasses = (color: string, isPopular: boolean) => {
    const colors: any = {
      blue: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-300',
        button: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-100 text-blue-950 border border-blue-400 font-bold'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-300',
        button: 'bg-purple-600 hover:bg-purple-700',
        badge: 'bg-purple-100 text-purple-950 border border-purple-400 font-bold'
      },
      green: {
        bg: 'from-green-50 to-green-100',
        border: 'border-green-300',
        button: 'bg-green-600 hover:bg-green-700',
        badge: 'bg-green-100 text-green-950 border border-green-400 font-bold'
      }
    };

    return colors[color] || colors.blue;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Select the perfect plan for your needs</p>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const colorClasses = getColorClasses(tier.color || 'blue', tier.popular || false);
          const isSelected = selected === tier.id;

          return (
            <div
              key={tier.id}
              onClick={() => handleSelect(tier.id)} role="button" tabIndex={0}
              className={`relative bg-gradient-to-br ${colorClasses.bg} border-2 rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105 ${
                isSelected ? colorClasses.border : 'border-gray-200'
              } ${tier.popular ? 'shadow-xl' : 'shadow-md'}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={`px-4 py-1 ${colorClasses.badge} rounded-full text-sm font-semibold`}>
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{formatCurrency(tier.price)}</span>
                <span className="text-gray-600">/month</span>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Select Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(tier.id);
                }}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  isSelected
                    ? colorClasses.button + ' text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {isSelected ? '✓ Selected' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Note */}
      <div className="text-center text-sm text-gray-600 mt-6">
        <p>All plans include a 14-day free trial. No credit card required.</p>
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
          Compare all features →
        </a>
      </div>
    </div>
  );
};

export default TierSelector;
