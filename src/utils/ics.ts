import React from 'react';
import ical from 'ical-generator';

export const generateICSFile = (
  eventDetails: {
    title: string;
    description?: string;
    start: Date;
    end?: Date;
    url?: string;
    location?: string;
  }) => {
  const cal = ical();

  cal.createEvent({
    start: eventDetails.start,
    end: eventDetails.end || new Date(eventDetails.start.getTime() + 60 * 60 * 1000), // Default to 1 hour duration
    summary: eventDetails.title,
    description: eventDetails.description,
    url: eventDetails.url,
    location: eventDetails.location
  });

  return cal.toString();
};
