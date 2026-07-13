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
      <Text size="xs" fw={500} c="dimmed" mb="xs">{title}</Text>
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="xl" fw={700} mb="xs">{value}</Text>
          <Text size="sm" c="teal" fw={500} mb="xs">{change}</Text>
          {helper && <Text size="xs" c="dimmed">{helper}</Text>}
        </div>
        {icon && <Box>{icon}</Box>}
      </Group>
      {label && <Text size="xs" c="dimmed" mt="xs">{label}</Text>}
    </Card>
  );
};

export default MetricCard;