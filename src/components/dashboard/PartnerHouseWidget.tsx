import React, {} from 'react';

interface PartnerHouseWidgetProps {
  partners?: { name: string; status: string }[];
}

const PartnerHouseWidget: React.FC<PartnerHouseWidgetProps> = ({
  partners = [
    { name: 'Partner A', status: 'Active' },
    { name: 'Partner B', status: 'Pending' },
    { name: 'Partner C', status: 'Active' }
  ]
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Partner House</h3>
      <div className="space-y-2">
        {partners.map((partner, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{partner.name}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              partner.status === 'Active'
                ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
            }`}>
              {partner.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerHouseWidget;
