"use client";
import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonStar, SunIcon } from "lucide-react";
import { Button, buttonVariants } from "./ui/Button";
import { cn } from "@/lib/utils";

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
  <Button
   onClick={themeChanger}
   className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
  >
   {theme === "dark" ? <MoonStar /> : <SunIcon />}
  </Button>
 );
};

export default SwitchTheme;
