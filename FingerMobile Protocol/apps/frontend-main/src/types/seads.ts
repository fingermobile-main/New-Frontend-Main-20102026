export interface SeadsInitiative {
  id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  progress: number;
  members: number;
  target: number;
  imageUrl: string;
  startDate: string; // Adding this property
  endDate?: string; // Adding this property
  organizer: {
    name: string;
    avatarUrl: string;
  };
}
