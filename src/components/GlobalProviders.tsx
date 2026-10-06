import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ToastProvider } from './Toast';
import AuthProvider from '../contexts/AuthContext';
import { BeatwaveNGProvider } from '../contexts/BeatwaveNGContext';
import { ContentProvider } from '../contexts/ContentContext';
import GroupProvider from '../contexts/GroupContext';
import { HapticFeedbackProvider } from '../contexts/HapticFeedbackContext';
import { IdentityAuthProvider } from '../contexts/IdentityAuthContext';
import { MonetizationProvider } from '../contexts/MonetizationContext';
import PostProvider from '../contexts/PostContext';
import { ProfileProvider } from '../contexts/ProfileContext';
import { SuperViAuthProvider } from '../contexts/SuperViAuthContext';
import { AppProvider } from '../contexts/AppContext';
import { Web3Provider } from '../contexts/Web3Context';
import { OnboardingProvider } from '../contexts/OnboardingContext';
import { P2PProvider } from '../contexts/P2PContext';
import { Dancia4TvProvider } from '../contexts/Dancia4TvProvider';
import { MarketplaceProvider } from '../contexts/MarketplaceContext';
import { CamusProvider } from '../contexts/CamusContext';
import { LushMatchProvider } from '../contexts/LushMatchContext';

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CamusProvider>
      <ToastProvider>
        <HapticFeedbackProvider>
          <SuperViAuthProvider>
            <AuthProvider>
              <AppProvider>
                <Web3Provider>
                  <IdentityAuthProvider>
                    <ProfileProvider>
                      <MonetizationProvider>
                        <ContentProvider>
                          <PostProvider>
                            <GroupProvider>
                              <OnboardingProvider>
                                <P2PProvider>
                                  <BeatwaveNGProvider>
                                    <Dancia4TvProvider>
                                      <MarketplaceProvider>
                                        <ToastContainer
                                          position="top-right"
                                          autoClose={5000}
                                          hideProgressBar={false}
                                          newestOnTop
                                          closeOnClick
                                          rtl={false}
                                          pauseOnFocusLoss
                                          draggable
                                          pauseOnHover
                                          theme="light"
                                        />
                                        <LushMatchProvider>{children}</LushMatchProvider>
                                      </MarketplaceProvider>
                                    </Dancia4TvProvider>
                                  </BeatwaveNGProvider>
                                </P2PProvider>
                              </OnboardingProvider>
                            </GroupProvider>
                          </PostProvider>
                        </ContentProvider>
                      </MonetizationProvider>
                    </ProfileProvider>
                  </IdentityAuthProvider>
                </Web3Provider>
              </AppProvider>
            </AuthProvider>
          </SuperViAuthProvider>
        </HapticFeedbackProvider>
      </ToastProvider>
    </CamusProvider>
  );
};
