import {
  Home,
  Inbox,
  Settings,
  Store,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useSidebar } from "@/components/ui/sidebar"; // import useSidebar hook

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatList } from "./ChatList";
import { AppList } from "./AppList";
import { SettingsList } from "./SettingsList";
import { useTheme } from "@/contexts/ThemeContext";

// Menu items.
const items = [
  {
    title: "Apps",
    to: "/",
    icon: Home,
  },
  {
    title: "Chat",
    to: "/chat",
    icon: Inbox,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: Settings,
  },
  {
    title: "Library",
    to: "/library",
    icon: BookOpen,
  },
  {
    title: "Hub",
    to: "/hub",
    icon: Store,
  },
];

export function AppSidebar() {
  const { state } = useSidebar(); // retrieve current sidebar state
  const { isDarkMode, setTheme } = useTheme();

  const routerState = useRouterState();
  const isAppRoute =
    routerState.location.pathname === "/" ||
    routerState.location.pathname.startsWith("/app-details");
  const isChatRoute = routerState.location.pathname === "/chat";
  const isSettingsRoute = routerState.location.pathname.startsWith("/settings");

  let selectedItem: string | null = null;
  if (state === "expanded") {
    if (isAppRoute) {
      selectedItem = "Apps";
    } else if (isChatRoute) {
      selectedItem = "Chat";
    } else if (isSettingsRoute) {
      selectedItem = "Settings";
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-row h-full p-0">
        {/* Left Column: Navigation icons */}
        <div className="flex flex-col w-14 pt-11 items-center border-r border-white/15">
          <div className="mb-2">
            <SidebarTrigger />
          </div>
          <AppIcons />

          {/* Theme toggle at bottom of icons column */}
          <div className="mt-auto mb-4">
            <button
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Content area */}
        <div className="flex-1 overflow-y-auto pt-11">
          <AppList show={selectedItem === "Apps"} />
          <ChatList show={selectedItem === "Chat"} />
          <SettingsList show={selectedItem === "Settings"} />
        </div>
      </SidebarContent>


      <SidebarRail />
    </Sidebar>
  );
}

function AppIcons() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div className="flex flex-col items-center gap-1 mt-4">
      {items.map((item) => {
        const isActive =
          (item.to === "/" && pathname === "/") ||
          (item.to !== "/" && pathname.startsWith(item.to));

        return (
          <Link
            key={item.title}
            to={item.to}
            className={`flex flex-col items-center justify-center gap-0.5 w-11 h-11 rounded-lg transition-colors ${
              isActive
                ? "bg-white/10 text-white"
                : "hover:bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-[10px] mt-0.5">{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
