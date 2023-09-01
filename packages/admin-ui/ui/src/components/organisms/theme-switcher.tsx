import { Moon, Sun } from "@medusajs/icons"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { clsx } from "clsx"
import React, { ReactNode, useEffect, useState } from "react"

interface RadixMenuItem {
  label: string
  shortcut?: string
  icon?: ReactNode
}

interface User {
  name: string
  url?: string
}

interface ThemeSwitcherProps {}

const themes = [
  {
    key: "light",
    label: "Light",
    icon: <Sun />,
  },
  {
    key: "dark",
    label: "Dark",
    icon: <Moon />,
  },
]

const ThemeSwitcher = (props: ThemeSwitcherProps) => {
  const [preferredTheme, setPreferredTheme] = useState<null | string>(null)

  useEffect(() => {
    try {
      let found = localStorage.getItem("theme")
      setPreferredTheme(found)
    } catch (error) {}
  }, [])

  useEffect(() => {
    const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = (_e: MediaQueryListEvent) => {
      setPreferredTheme("system")
    }
    prefersDarkQuery.addEventListener("change", updateTheme)

    return () => {
      prefersDarkQuery.removeEventListener("change", updateTheme)
    }
  }, [])

  return (
    <div className="relative inline-block text-left">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger
          className={clsx(
            "inline-flex select-none justify-center rounded-md px-2.5 py-2 text-sm font-medium",
            "bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 hover:dark:bg-gray-800",
            "border border-gray-300 dark:border-transparent",
            "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
          )}
        >
          {(function () {
            switch (preferredTheme) {
              case "light":
                return (
                  <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )
              case "dark":
                return (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )
            }
          })()}
          {/* {isDark ? "dark" : "light"} */}
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            align="end"
            sideOffset={5}
            className={clsx(
              "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
              "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56",
              "bg-gray-50 dark:bg-gray-800"
            )}
          >
            {themes.map(({ key, label, icon }, i) => {
              return (
                <DropdownMenuPrimitive.Item
                  key={`theme-${i}`}
                  className={clsx(
                    "flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                    "text-gray-500 focus:bg-gray-200 dark:text-gray-400 dark:focus:bg-gray-700"
                  )}
                  onClick={() => {
                    if (
                      localStorage.theme === "dark" ||
                      (!("theme" in localStorage) &&
                        window.matchMedia("(prefers-color-scheme: dark)")
                          .matches)
                    ) {
                      document.documentElement.classList.add("dark")
                    } else {
                      document.documentElement.classList.remove("dark")
                    }

                    // Whenever the user explicitly chooses light mode
                    localStorage.theme = "light"

                    // Whenever the user explicitly chooses dark mode
                    localStorage.theme = "dark"

                    // Whenever the user explicitly chooses to respect the OS preference
                    localStorage.removeItem("theme")
                  }}
                >
                  {React.cloneElement(icon, {
                    className: "w-5 h-5 mr-2 text-gray-700 dark:text-gray-300",
                  })}
                  <span className="flex-grow text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </DropdownMenuPrimitive.Item>
              )
            })}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </div>
  )
}

export { ThemeSwitcher }
