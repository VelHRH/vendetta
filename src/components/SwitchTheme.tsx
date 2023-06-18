"use client";
import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonStar, SunIcon } from "lucide-react";

const SwitchTheme: FC = () => {
 const { systemTheme, theme, setTheme } = useTheme();
 const [mounted, setMounted] = useState(false);
 useEffect(() => {
  setMounted(true);
 }, []);
 if (!mounted) return null;
 const themeChanger = () => {
  const currentTheme = theme === "system" ? systemTheme : theme;
  setTheme(currentTheme === "light" ? "dark" : "light");
 };
 return (
  <button
   onClick={themeChanger}
   className="duration-200 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
  >
   {theme === "dark" ? <MoonStar /> : <SunIcon />}
  </button>
 );
};

export default SwitchTheme;
