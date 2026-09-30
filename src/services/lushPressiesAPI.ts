import React, {} from 'react';
export interface LushPressieItem {id: number;
  name: string;
  description?: string;
}

export interface LushPressiesResponse {message: string;
  items: LushPressieItem[];
}

export const fetchLushPressiesData =
  async (): Promise<LushPressiesResponse> => {
    console.info('Fetching Lush Pressies data...');
    // Simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({message: 'Welcome to Lush Pressies!', items: [
          { id: 1, name: 'Pressie 1', description: 'A lovely pressie.' },
          {id: 2, name: 'Pressie 2', description: 'Another great pressie.' }
        ]
        });
      }, 1000);
    });
  };
