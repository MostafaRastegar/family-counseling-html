'use client';

import { type ReactNode } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { NotificationContextProvider } from 'papak/configs/notificationContextProvider';
import { useThemeProvider } from 'papak/utils/useThemeProvider';

// const px2rem = px2remTransformer({
//   rootValue: 16, // 32px = 1rem; @default 16
// });
export default function Template({ children }: { children: ReactNode }) {
  const { ConfigProvider } = useThemeProvider();

  return (
    <ConfigProvider rtl={true}>
      {/* <StyleProvider transformers={[px2rem]}> */}
      <StyleProvider>
        <NotificationContextProvider>{children}</NotificationContextProvider>
      </StyleProvider>
    </ConfigProvider>
  );
}
