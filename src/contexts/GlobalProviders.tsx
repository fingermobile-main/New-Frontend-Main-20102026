import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ToastProvider } from '../components/Toast';
import AuthProvider from './AuthContext';
import { BeatwaveNGProvider } from './BeatwaveNGContext';
import { ContentProvider } from './ContentContext';
import GroupProvider from './GroupContext';
import { HapticFeedbackProvider } from './HapticFeedbackContext';
import { IdentityAuthProvider } from './IdentityAuthContext';
import { MonetizationProvider } from './MonetizationContext';
import PostProvider from './PostContext';
import { ProfileProvider } from './ProfileContext';
import { SuperViAuthProvider } from './SuperViAuthContext';
import { AppProvider } from './AppContext';
import { Web3Provider } from './Web3Context';
import { OnboardingProvider } from './OnboardingContext';
import { P2PProvider } from './P2PContext';
import { Dancia4TvProvider } from './Dancia4TvProvider';
import { MarketplaceProvider } from './MarketplaceContext';
import { CamusProvider } from './CamusContext';

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
                                      {children}
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
