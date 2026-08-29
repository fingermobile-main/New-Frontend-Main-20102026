import React from 'react';
import { Card, Text, Group, Box } from '@mantine/core';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  label?: string;
  helper?: string;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change,
  label,
  helper,
  icon
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {label && <Text size="sm" c="dimmed">{label}</Text>}
      <Group justify="space-between" align="center" mt="xs">
        <div>
          <Text size="xl" fw={500}>{value}</Text>
          <Text size="sm" c="dimmed">{helper}</Text>
        </div>
        {icon && <Box>{icon}</Box>}
      </Group>
    </Card>
  );
};

export default MetricCard;