import React from 'react';
import { Card, Text, Button, Group, Badge } from '@mantine/core';

interface ProgramCardProps {
  title: string;
  summary?: string;
  requirements: string[];
  eligible: boolean;
  onClick?: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  title, 
  summary, 
  requirements, 
  eligible,
  onClick 
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="lg" fw={500}>{title}</Text>
      {summary && <Text size="sm" c="dimmed" mt="xs">{summary}</Text>}
      
      <Group mt="md" mb="xs">
        <Badge color={eligible ? 'green' : 'red'}>
          {eligible ? 'Eligible' : 'Not Eligible'}
        </Badge>
      </Group>
      
      <Text size="sm" fw={600} mt="sm">Requirements:</Text>
      <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
        {requirements.slice(0, 3).map((req, idx) => (
          <li key={idx}>{req}</li>
        ))}
      </ul>
      
      <Button 
        variant="light" 
        color="blue" 
        fullWidth 
        mt="md" 
        radius="md"
        disabled={!eligible}
        onClick={onClick}
      >
        Apply
      </Button>
    </Card>
  );
};

export default ProgramCard;