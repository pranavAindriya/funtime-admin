import {
  SquaresFour,
  Users,
  Phone,
  HandCoins,
  Scales,
  HandArrowDown,
  Trophy,
  Notification,
  Shield,
  ChartPieSlice,
  Translate,
  FileText,
  CardsThree,
  Files,
  Coins,
} from "@phosphor-icons/react";

export const MODULES = {
  DASHBOARD: "Dashboard",
  USERS: "Users",
  CALLS: "Calls",
  COINS: "Coin",
  BANNER: "Banner",
  TDS: "TDS Report",
  COIN_PURCHASE: "Coin Purchase",
  CONVERSION: "Conversion",
  WITHDRAWAL: "Withdrawal",
  LEADERBOARD: "Leader Board",
  NOTIFICATIONS: "Notifications",
  REPORT_BLOCK: "Report / Block",
  REPORTS: "Reports",
  LANGUAGE: "Language",
  CMS: "CMS Page",
};

export const sidebarItems = [
  {
    text: "Dashboard",
    icon: SquaresFour,
    link: "/dashboard",
    module: MODULES.DASHBOARD,
  },
  {
    text: "Users",
    icon: Users,
    link: "/users",
    module: MODULES.USERS,
  },
  {
    text: "Calls",
    icon: Phone,
    link: "/calls",
    module: MODULES.CALLS,
  },
  {
    text: "Coins",
    icon: HandCoins,
    link: "/coins",
    module: MODULES.COINS,
  },
  {
    text: "Conversion",
    icon: Scales,
    link: "/conversion",
    module: MODULES.CONVERSION,
  },
  {
    text: "Withdrawal",
    icon: HandArrowDown,
    link: "/withdrawals",
    module: MODULES.WITHDRAWAL,
  },
  {
    text: "Leader Board",
    icon: Trophy,
    link: "/leaderboard",
    module: MODULES.LEADERBOARD,
  },
  {
    text: "Notifications",
    icon: Notification,
    link: "/notifications",
    module: MODULES.NOTIFICATIONS,
  },
  {
    text: "Banner",
    icon: CardsThree,
    link: "/banner",
    module: MODULES.BANNER,
  },
  {
    text: "Report / Block",
    icon: Shield,
    link: "/reportandblock",
    module: MODULES.REPORT_BLOCK,
  },
  {
    text: "Reports",
    icon: ChartPieSlice,
    link: "/reports",
    module: MODULES.REPORTS,
  },
  {
    text: "TDS Report",
    icon: Files,
    link: "/tdsreport",
    module: MODULES.TDS,
  },
  {
    text: "Coin Purchase",
    icon: Coins,
    link: "/coin-purchase",
    module: MODULES.COIN_PURCHASE,
  },
  {
    text: "Language",
    icon: Translate,
    link: "/language",
    module: MODULES.LANGUAGE,
  },
];

export const getModuleFromPath = (path) => {
  const basePath = "/" + path.split("/")[1];

  const pathModuleMap = {
    "/dashboard": MODULES.DASHBOARD,
    "/users": MODULES.USERS,
    "/calls": MODULES.CALLS,
    "/coins": MODULES.COINS,
    "/conversion": MODULES.CONVERSION,
    "/withdrawals": MODULES.WITHDRAWAL,
    "/leaderboard": MODULES.LEADERBOARD,
    "/notifications": MODULES.NOTIFICATIONS,
    "/banner": MODULES.BANNER,
    "/reportandblock": MODULES.REPORT_BLOCK,
    "/reports": MODULES.REPORTS,
    "/tdsreport": MODULES.TDS,
    "/coin-purchase": MODULES.COIN_PURCHASE,
    "/language": MODULES.LANGUAGE,
  };

  return pathModuleMap[basePath];
};

export default sidebarItems;
