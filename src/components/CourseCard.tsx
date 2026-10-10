import React, {} from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CourseCardProps {
  title: string;
  description?: string;
  instructor: string;
  duration: string;
  level: string;
  price?: number;
  enrolled: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  instructor,
  duration,
  level,
  price,
  enrolled
}) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 space-y-1">
          <p className="text-xs">Instructor: {instructor}</p>
          <p className="text-xs">Duration: {duration}</p>
          <p className="text-xs">Level: {level}</p>
          <p className="text-sm font-semibold mt-2">${typeof price === 'number' ? price.toFixed(2) : '0.00'}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-xs text-muted-foreground mb-2">
          {enrolled} students enrolled
        </div>
        <Button className="w-full">Enroll Now</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;