import type { Metadata } from 'next'
import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { ContextProvider } from '@/context'
import { AppProvider } from '@/context/AppContext'
import StyledComponentsRegistry from '@/lib/registry'
import I18NProvider from '@/components/I18NProvider'
import AppLayout from './components/AppLayout'
import { TabProvider } from '@/context/TabContext'

export const metadata: Metadata = {
  title: 'EVM Tools',
  description: 'A modular EVM wallet toosl'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <StyledComponentsRegistry>
          <ContextProvider>
            <I18NProvider>
              <AppProvider>
                <TabProvider>
                  <AppLayout>{children}</AppLayout>
                </TabProvider>
              </AppProvider>
            </I18NProvider>
          </ContextProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
