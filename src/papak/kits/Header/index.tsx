"use client";

import React from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { IconBell, IconHelp, IconUser } from "@tabler/icons-react";
import { Badge, Button, Layout, Menu, theme } from "antd";
import { palettes } from "papak/configs/palettes";

const { Header: AntHeader } = Layout;
const { Item } = Menu;

interface SideBarProps {
  handleThemeMode: () => void;
  isDarkMode: boolean;
  handleThemeDirection: () => void;
  isRtlMode: boolean;
  profileMenu?: React.ReactNode;
  notification?: React.ReactNode;
  children?: React.ReactNode;
  customLogo?: React.ReactNode;
  logoText?: string;
}

const Header: React.FC<SideBarProps> = ({
  handleThemeMode,
  isDarkMode,
  isRtlMode,
  handleThemeDirection,
  profileMenu,
  notification,
  children,
  logoText,
  customLogo,
}) => {
  const segment = useSelectedLayoutSegment();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menu = (
    <Menu>
      <Item>English</Item>
      <Item>فارسی</Item>
    </Menu>
  );

  return (
    <AntHeader className="sticky top-0 z-[999] flex items-center justify-end gap-4 p-0 px-4 dark:border-gray-700">
      {/* <div>
        <Button
          onClick={() => handleThemeDirection()}
          shape="circle"
          icon={<span className="font-bold">{isRtlMode ? 'EN' : 'فا'}</span>}
        />
      </div>
      <div>
        <Button
          shape="circle"
          onClick={() => handleThemeMode()}
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        />
      </div> */}
      {customLogo ? (
        customLogo
      ) : (
        <div className="box-border flex flex-col content-center items-center bg-primary-main dark:bg-[#141414] ltr:mr-auto rtl:ml-auto">
          <div className="relative  flex w-full flex-1 items-center justify-center rounded-md">
            <img src="/logo_icon.svg" />
            {!!logoText && (
              <span className="pl-2 text-sm font-bold text-white">
                {logoText}
              </span>
            )}
          </div>
        </div>
      )}
      {children}
      <div className="h-6 w-[1px] bg-white opacity-20" />
      {!!notification && notification}

      {profileMenu && (
        <div className="flex flex-row items-center">{profileMenu}</div>
      )}
    </AntHeader>
  );
};

export default Header;
