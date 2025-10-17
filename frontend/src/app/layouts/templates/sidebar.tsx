"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";



/**
 * Utility to conditionally join Tailwind classes.
 */
function cn(...classes: Array<string | undefined | false | null>) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Reusable Sidebar Component
 * - Responsive, collapsible, and customizable
 * - Smooth expand/collapse with Framer Motion
 * - Active route highlighting using next/navigation
 * - Accessible semantics and keyboard support
 */

// Types
export type SidebarMenuItem = {
    label: string;
    href: string;
    icon: React.ReactNode; // pass any React node (e.g., React Icons, custom SVGs)
    exact?: boolean; // if true, requires exact path match; otherwise startsWith
    external?: boolean; // if true, open in new tab
    onClick?: (e?: React.MouseEvent) => void; // optional click handler
};

export type SidebarProps = {
    menuItems: SidebarMenuItem[];
    isCollapsed?: boolean; // controlled collapsed state (if omitted, component is uncontrolled)
    defaultCollapsed?: boolean; // initial state when uncontrolled
    onToggle?: (next: boolean) => void;
    className?: string;
    ariaLabel?: string; // nav label for accessibility
    collapsedWidth?: number; // px
    expandedWidth?: number; // px
    header?: React.ReactNode; // optional top content (e.g., logo)
    footer?: React.ReactNode; // optional bottom content (e.g., user avatar)
};

export default function Sidebar({
    menuItems,
    isCollapsed,
    defaultCollapsed = false,
    onToggle,
    className,
    ariaLabel = "Sidebar",
    collapsedWidth = 72, // 4.5rem
    expandedWidth = 256, // 16rem
    header,
    footer,
}: SidebarProps) {
    const pathname = usePathname();

    // Controlled/uncontrolled pattern
    const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
    const collapsed = isCollapsed ?? internalCollapsed;

    const handleToggle = React.useCallback(() => {
        const next = !collapsed;
        onToggle?.(next);
        if (isCollapsed === undefined) {
            setInternalCollapsed(next);
        }
    }, [collapsed, isCollapsed, onToggle]);

    const navId = React.useId();

    return (
        <motion.aside
            aria-label={ariaLabel}
            className={cn(
                "relative h-full flex flex-col border border-gray-200/80 dark:border-neutral-800/80 bg-black/20 dark:bg-black",
                "backdrop-blur supports-[backdrop-filter]:bg-white/50",
                "rounded-xl shadow-sm",
                className
            )}
            initial={false}
            animate={{ width: collapsed ? collapsedWidth : expandedWidth }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
            {/* Top bar: header + toggle */}
            <div className="flex items-center gap-2 p-2">
                <div className="flex-1 min-w-0">
                    <AnimatePresence initial={false}>
                        {!collapsed && header ? (
                            <motion.div
                                key="header"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="truncate"
                            >
                                {header}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                <button
                    type="button"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-pressed={!collapsed}
                    aria-controls={navId}
                    onClick={handleToggle}
                    className={cn(
                        "inline-flex items-center justify-center rounded-md",
                        "p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                        "hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-700/80"
                    )}
                    title={collapsed ? "Expand" : "Collapse"}
                >
                    {/* Simple hamburger/chevron combo icon */}
                    <motion.svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ rotate: collapsed ? 180 : 0 }}
                        transition={{ type: "tween", duration: 0.2 }}
                    >
                        <path d="M3 6h14M3 10h10M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </motion.svg>
                </button>
            </div>

            {/* Navigation */}
            <nav id={navId} className="flex-1 overflow-y-auto">
                <ul className="px-2 py-1 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = item.external
                            ? false
                            : item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        const baseItem =
                            "group flex items-center w-full gap-3 rounded-lg px-2 py-2 transition-colors outline-none";
                        const colors = isActive
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 ring-1 ring-indigo-100 dark:ring-indigo-500/20"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800";

                        // When collapsed, center icons and provide tooltips via title attribute
                        return (
                            <li key={item.href} className="w-full">
                                <Link
                                    href={item.href}
                                    target={item.external ? "_blank" : undefined}
                                    rel={item.external ? "noreferrer noopener" : undefined}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(baseItem, colors, "focus-visible:ring-2 focus-visible:ring-indigo-500")}
                                    title={collapsed ? item.label : undefined}
                                    onClick={(e) => {
                                        if (item.onClick) {
                                            item.onClick(e);
                                        }
                                    }}
                                >
                                    <span
                                        className={cn(
                                            "shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md",
                                            isActive
                                                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                                : "bg-purple-700/80 text-white",
                                            "transition-colors"
                                        )}
                                        aria-hidden
                                    >
                                        {item.icon}
                                    </span>

                                    {/* Animated label */}
                                    <AnimatePresence initial={false}>
                                        {!collapsed ? (
                                            <motion.span
                                                key="label"
                                                className="truncate text-sm font-medium"
                                                initial={{ opacity: 0, x: -6 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -6 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        ) : null}
                                    </AnimatePresence>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer slot (e.g., account switcher) */}
            {(footer || !collapsed) && (
                <div className="p-2">
                    <AnimatePresence initial={false}>
                        {!collapsed && footer ? (
                            <motion.div
                                key="footer"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.15 }}
                            >
                                {footer}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            )}
        </motion.aside>
    );
}

/* ========================================================================
     Example Usage (snippets) — For reference only.
     Copy these into your page/components as needed.
     ========================================================================

     Note: The icons below are minimal inline SVGs for demonstration.
     You can replace them with any icon library (e.g. react-icons, heroicons).
*/

// Example inline icons (demo)
///*
const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 3l9 8h-3v9h-12v-9H3l9-8z" />
    </svg>
);
const FolderIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M10 4l2 2h8v12H4V4h6z" />
    </svg>
);
const CogIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
        <path d="M4 12a8 8 0 0116 0 8 8 0 11-16 0z" fill="currentColor" opacity="0.2" />
    </svg>
);
const HelpIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm1 15h-2v-2h2zm1.07-7.75l-.9.92A2.49 2.49 0 0012 12h-1v-1a3.5 3.5 0 013.5-3.5 2.5 2.5 0 11-1.43 4.75z" />
    </svg>
);
//*/

/**
// 1) Fully expanded with labeled items
"use client";

export default function ExpandedSidebarExample() {
    const items: SidebarMenuItem[] = [
        { label: "Home", href: "/", icon: <HomeIcon />, exact: true },
        { label: "Projects", href: "/projects", icon: <FolderIcon /> },
        { label: "Settings", href: "/settings", icon: <CogIcon /> },
        { label: "Help", href: "https://example.com/docs", icon: <HelpIcon />, external: true },
    ];

    return (
        <div className="h-screen p-4 bg-gray-50 dark:bg-neutral-950">
            <Sidebar
                menuItems={items}
                defaultCollapsed={false}
                className="h-full"
                header={<div className="text-sm font-semibold text-gray-800 dark:text-gray-100">My App</div>}
                footer={
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        v1.0.0 • © {new Date().getFullYear()}
                    </div>
                }
            />
        </div>
    );
}
*/

/**
// 2) Collapsed showing only icons
"use client";

export default function CollapsedSidebarExample() {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const items: SidebarMenuItem[] = [
        { label: "Home", href: "/", icon: <HomeIcon />, exact: true },
        { label: "Projects", href: "/projects", icon: <FolderIcon /> },
        { label: "Settings", href: "/settings", icon: <CogIcon /> },
    ];

    return (
        <div className="h-screen p-4 bg-gray-50 dark:bg-neutral-950">
            <Sidebar
                menuItems={items}
                isCollapsed={isCollapsed}
                onToggle={setIsCollapsed}
                className="h-full"
            />
        </div>
    );
}
*/

/**
// 3) Integrated into a simple layout with main content area
"use client";

export default function LayoutWithSidebarExample() {
    const [collapsed, setCollapsed] = useState(false);
    const items: SidebarMenuItem[] = [
        { label: "Home", href: "/", icon: <HomeIcon />, exact: true },
        { label: "Projects", href: "/projects", icon: <FolderIcon /> },
        { label: "Settings", href: "/settings", icon: <CogIcon /> },
        { label: "Help", href: "/help", icon: <HelpIcon /> },
    ];

    return (
        <div className="h-screen grid grid-cols-[auto_1fr] gap-4 p-4 bg-gray-50 dark:bg-neutral-950">
            <Sidebar
                menuItems={items}
                isCollapsed={collapsed}
                onToggle={setCollapsed}
                className="h-full"
                header={<div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Dashboard</div>}
            />
            <main className="rounded-xl border border-gray-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 p-6 shadow-sm overflow-auto">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Main Content</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Resize the window and toggle the sidebar to see it in action. Active route highlighting
                    is based on the current URL via usePathname().
                </p>
            </main>
        </div>
    );
}
*/