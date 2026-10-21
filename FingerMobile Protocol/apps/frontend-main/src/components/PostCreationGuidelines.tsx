import React, {} from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface PostCreationGuidelinesProps {
  category?: string;
}

const PostCreationGuidelines: React.FC<PostCreationGuidelinesProps> = ({ category }) => {
  const guidelines = {
    general: [
      { title: 'Be Respectful', description: 'Treat all members with respect and courtesy' },
      { title: 'Stay On Topic', description: 'Keep your content relevant to the community' },
      { title: 'No Spam', description: 'Avoid excessive self-promotion or repetitive posts' },
      { title: 'Quality Content', description: 'Share valuable, original content when possible' }
    ],
    marketplace: [
      { title: 'Accurate Descriptions', description: 'Provide honest and detailed product descriptions' },
      { title: 'Clear Pricing', description: 'Display prices clearly in FIC or approved currencies' },
      { title: 'Legitimate Items', description: 'Only list items you legally own and can sell' },
      { title: 'Response Time', description: 'Respond to inquiries within 24 hours' }
    ],
    education: [
      { title: 'Verified Information', description: 'Ensure educational content is accurate and verified' },
      { title: 'Cite Sources', description: 'Reference credible sources when sharing facts' },
      { title: 'No Misinformation', description: 'Avoid spreading unverified claims or rumors' },
      { title: 'Constructive Tone', description: 'Present information in a helpful, educational manner' }
    ]
  };

  const selectedGuidelines = category ? guidelines[category as keyof typeof guidelines] || guidelines.general : guidelines.general;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Post Creation Guidelines</h3>
      </div>

      <div className="space-y-3">
        {selectedGuidelines.map((guideline, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-950 font-bold text-sm border  border-blue-400 font-black">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{guideline.title}</p>
              <p className="text-xs text-gray-600 mt-1">{guideline.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Note:</strong> Violations may result in content removal or account restrictions.
          Review our full Community Standards for more details.
        </p>
      </div>
    </div>
  );
};

export default PostCreationGuidelines;
