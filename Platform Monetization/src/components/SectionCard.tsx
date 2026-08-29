import React from 'react';
import { Card, Title, Text } from '@mantine/core';
import { cn } from '../../lib/utils';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  children, 
  className,
  subtitle
}) => {
  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      className={cn("mb-6", className)}
    >
      <Title order={2} className="mb-2 text-lg">{title}</Title>
      {subtitle && <Text size="sm" c="dimmed" className="mb-4">{subtitle}</Text>}
      {children}
    </Card>
  );
};

export default SectionCard;