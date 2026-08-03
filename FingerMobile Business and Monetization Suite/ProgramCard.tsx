import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/Card';
import { StatusBadge } from './StatusBadge';

interface Program {
  name: string;
  description?: string;
  requirements: string[];
  key: string;
}

interface Eligibility {
  status?: string;
  passedRules?: string[];
  failedRules?: string[];
  nextActions?: string[];
}

interface ProgramCardProps {
  program: Program;
  eligibility: Eligibility;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, eligibility }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{program.name}</span>
          <StatusBadge status={eligibility.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Requirements:</h4>
          <ul className="space-y-1">
            {program.requirements?.map((item: string, idx: number) => (
              <li key={idx} className="text-sm flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Eligibility:</h4>
          <div className="space-y-2">
            <div className="text-xs">
              <span className="font-medium">Passed:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {eligibility.passedRules?.slice(0, 4).map((rule: string, idx: number) => (
                  <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    ✓ {rule}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-xs">
              <span className="font-medium">Next Actions:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {eligibility.nextActions?.map((item: string, idx: number) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};