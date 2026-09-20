import { ReactNode } from 'react';
import { AppShell as MantineAppShell, Text, Group, Burger /*, rem */ } from '@mantine/core';  // Removed unused rem import
import { useDisclosure } from '@mantine/hooks';

interface AppShellProps {
  children: ReactNode;
  activeKey?: string;
}

const AppShell = ({ children, activeKey = 'dashboard' }: AppShellProps) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 300, 
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened }
      }}
      footer={{ height: 60 }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <Text size="lg" fw={700}>FingerMobile Business Suite</Text>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="sm" hiddenFrom="sm" className={mobileOpened ? '' : 'hidden'}>
        <MantineAppShell.Section>
          <div className="space-y-2">
            <a 
              href="/overview" 
              className={`block p-2 rounded ${activeKey === 'overview' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Overview
            </a>
            <a 
              href="/monetization" 
              className={`block p-2 rounded ${activeKey === 'monetization' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Monetization
            </a>
            <a 
              href="/revenue" 
              className={`block p-2 rounded ${activeKey === 'revenue' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Revenue
            </a>
            <a 
              href="/verification" 
              className={`block p-2 rounded ${activeKey === 'verification' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Verification
            </a>
            <a 
              href="/admin" 
              className={`block p-2 rounded ${activeKey === 'admin' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Admin
            </a>
            <a 
              href="/affiliate" 
              className={`block p-2 rounded ${activeKey === 'affiliate' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Affiliate
            </a>
            <a 
              href="/hallmarks" 
              className={`block p-2 rounded ${activeKey === 'hallmarks' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Hallmarks
            </a>
          </div>
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        {children}
      </MantineAppShell.Main>

      <MantineAppShell.Footer>
        <Text size="sm" ta="center" pt="sm">© 2023 FingerMobile Business Suite</Text>
      </MantineAppShell.Footer>
    </MantineAppShell>
  );
};

export default AppShell;