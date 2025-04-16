"use client";

import React, { useState } from "react";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
} from "@tabler/icons-react";
import { Layout } from "antd";
import { SiderProps } from "antd/lib";
import clsx from "clsx";
import { palettes } from "papak/configs/palettes";
import MainMenu, { type MenuItemType } from "../SideBarMenu";

const { Sider } = Layout;

interface SideBarProps {
  items: MenuItemType[];
  breakpoint?: SiderProps["breakpoint"];
}

const SideBar: React.FC<SideBarProps> = ({ items, breakpoint = "xl" }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint={breakpoint}
      className="bg-black"
      width={264}
      trigger={
        <div
          className={clsx(
            "flex h-[100%] flex-1 flex-row items-center overflow-hidden bg-gray-900 px-4",
            {
              "justify-center": collapsed,
              "justify-start": !collapsed,
            }
          )}
        >
          <>
            {collapsed ? (
              <IconLayoutSidebarRightCollapse color={`${palettes.gray[500]}`} />
            ) : (
              <IconLayoutSidebarLeftCollapse color={`${palettes.gray[500]}`} />
            )}
            <span
              className={clsx(
                "h-full w-full overflow-hidden text-nowrap pl-2 pt-[2px] text-left text-gray-500 transition-all duration-300",
                {
                  hidden: collapsed,
                }
              )}
            >
              Collapse sidebar
            </span>
          </>
        </div>
      }
    >
      <MainMenu items={items} />
    </Sider>
  );
};

export default SideBar;
