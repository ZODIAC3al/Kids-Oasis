'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Heart, User, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const MobileNav = () => {
    const pathname = usePathname();
    const { user } = useSelector((state: RootState) => state.auth);

    const getDashboardPath = () => {
        if (!user) return "/login";
        if (user.role === "admin") return "/dashboard/admin";
        if (user.role === "nurseryOwner" || user.role === "academyOwner") return "/dashboard/academy";
        if (user.role === "teacher") return "/dashboard/teacher";
        return "/dashboard/parent";
    };

    const items = [
        { path: "/", icon: Home, label: "Home" },
        { path: "/academies", icon: Search, label: "Search" },
        { path: "/favorites", icon: Heart, label: "Favorites" },
        { path: user ? getDashboardPath() : "/login", icon: Bell, label: "Alerts" },
        { path: user ? "/profile" : "/login", icon: User, label: "Profile" },
    ];

    const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.includes(path));

    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="flex items-center justify-around bg-[#2B2440] rounded-full py-3 px-2 shadow-[0_10px_30px_-8px_rgba(43,36,64,0.5)]">
                {items.map(({ path, icon: Icon, label }) => {
                    const active = isActive(path);
                    return (
                        <Link key={label} href={path} aria-label={label} className="relative flex flex-col items-center px-3">
                            {active && (
                                <motion.span
                                    layoutId="mobile-nav-indicator"
                                    className="absolute -top-3 w-6 h-1 rounded-full bg-[#FF6F5E]"
                                />
                            )}
                            <span
                                className={`relative flex items-center justify-center w-6 h-6 transition-colors ${active ? "text-[#FF6F5E]" : "text-white/50"
                                    }`}
                                style={active ? { filter: "drop-shadow(0 0 6px rgba(255,111,94,0.7))" } : undefined}
                            >
                                <Icon className="w-5 h-5" strokeWidth={2} />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;