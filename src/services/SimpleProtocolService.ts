import React from 'react';
import { setupProtocolNotifications } from './protocolNotificationService';

let initialized = false;

/**
 * Initialize protocol notifications when the app starts
 */
export const initializeProtocolNotifications = () => {
  if (initialized) {
    console.info('Protocol notifications already initialized');
    return;
  }
  
  // Set up the protocol notifications integration
  setupProtocolNotifications();
  
  console.info('Protocol notifications initialized');
  initialized = true;
};

export default initializeProtocolNotifications;