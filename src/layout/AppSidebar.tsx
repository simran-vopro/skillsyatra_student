import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
    ChevronDownIcon,
    GridIcon,
    TableIcon,
    UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
    Calendar,
    ChartArea,
    CopyPlusIcon,
    CreditCard,
    Diamond,
    ListIcon,
    Settings,
    Speaker,
    User,
    Users,
    LayoutDashboard, // New Icon for Dashboard (Lucide)
    BookOpen, // New Icon for My Courses (Lucide)
    MessageSquare, // New Icon for Forum (Lucide)
    MonitorPlay, // New Icon for Ask Instructor (Lucide)
    CalendarCheck, // New Icon for Practicals Booking (Lucide)
    HelpCircle, // New Icon for FAQs/Knowledge Base (Lucide)
    FileText, // New Icon for Support Tickets (Lucide)
    Shield, // New Icon for Login & Security (Lucide)
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const { adminUser } = useAuth(); // Note: This hook might need renaming if used for students (e.g., useStudentAuth)

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: string;
        index: number;
    } | null>(null);

    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    // ✅ Student Portal: Remove all admin/instructor-specific restrictions
    const blocked: string[] = []; // No block for student portal

    // ***************************************************************
    // 🛑 START: STUDENT PORTAL SIDEBAR OPTIONS
    // ***************************************************************

    // 1. MAIN (Dashboard, Courses)
    const main: NavItem[] = useMemo(
        () => [
            // 1. Dashboard
            { icon: <LayoutDashboard />, name: "Dashboard", path: "/" },
            // 2. My Courses
            { icon: <BookOpen />, name: "My Courses", path: "/my-courses" },
            // Events or Calendar View (All Activity)
            { icon: <Calendar />, name: "Events Calendar", path: "/events" },
        ],
        [] // No adminUser dependency needed for a static student menu
    );

    // 2. LEARNING & INTERACTION (Forum, Instructor, Practicals)
    const learning: NavItem[] = useMemo(
        () => [
            // 3. Forum Page
            { icon: <MessageSquare />, name: "Forum & Discussions", path: "/forum" },
            // 4. Ask Instructor
            { icon: <MonitorPlay />, name: "Ask Instructor", path: "/ask-instructor" },
            // 5. Practicals Booking Calendar
            { icon: <CalendarCheck />, name: "Practicals Booking", path: "/practicals-booking" },
        ],
        []
    );

    // 3. ACCOUNT & SUPPORT (Profile, Payments, Support, Settings)
    const support: NavItem[] = useMemo(
        () => [
            // 7. Payment History / Orders
            { icon: <CreditCard />, name: "Payment History", path: "/payment-history" },
            // 8. Support Tickets (Student Helpdesk)
            { icon: <FileText />, name: "Support Tickets", path: "/tickets" },
            // 10. FAQs / Knowledge Base
            { icon: <HelpCircle />, name: "FAQs & Knowledge", path: "/faq" },
        ],
        []
    );

    // 4. USER & SETTINGS (Profile, Security)
    const user: NavItem[] = useMemo(
        () => [
            // 6. Profile & Account Settings
            { icon: <User />, name: "Profile & Settings", path: "/profile" },
            // 9. Login & Security Settings
            { icon: <Shield />, name: "Login & Security", path: "/security" },
        ],
        []
    );

    // ***************************************************************
    // 🛑 END: STUDENT PORTAL SIDEBAR OPTIONS
    // ***************************************************************


    // ✅ Submenu handling (Updated to use new menu types)
    useEffect(() => {
        let submenuMatched = false;
        // Check only the new student-centric menus (main, learning, support, user)
        ["main", "learning", "support", "user"].forEach(
            (menuType) => {
                const items =
                    menuType === "main"
                        ? main
                        : menuType === "learning"
                            ? learning
                            : menuType === "support"
                                ? support
                                : user;

                items.forEach((nav, index) => {
                    if (nav.subItems) {
                        nav.subItems.forEach((subItem) => {
                            if (isActive(subItem.path)) {
                                setOpenSubmenu({ type: menuType, index });
                                submenuMatched = true;
                            }
                        });
                    }
                });
            }
        );
        if (!submenuMatched) setOpenSubmenu(null);
    }, [location, isActive, main, learning, support, user]); // Added dependencies for useEffect



    const handleSubmenuToggle = (index: number, menuType: string) => {
        setOpenSubmenu((prev) =>
            prev && prev.type === menuType && prev.index === index
                ? null
                : { type: menuType, index }
        );
    };

    // ✅ Generic Renderer (No change needed here)
    const renderMenuItems = (items: NavItem[], menuType: string) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? "menu-item-active"
                                : "menu-item-inactive"
                                }`}
                        >
                            <span className="menu-item-icon-size">{nav.icon}</span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className="menu-item-text">{nav.name}</span>
                            )}
                            <ChevronDownIcon
                                className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                                    openSubmenu?.index === index
                                    ? "rotate-180 text-brand-500"
                                    : ""
                                    }`}
                            />
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                to={nav.path}
                                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                                    }`}
                            >
                                <span className="menu-item-icon-size">{nav.icon}</span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo */}
            <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                <Link to="/">
                    {(isExpanded || isHovered || isMobileOpen) ? (
                        <span className="text-black dark:text-white font-bold text-3xl flex items-baseline">
                            SKILLS YATRA <div className="bg-sky-500 h-2 w-2 ml-1"></div>
                        </span>
                    ) : (
                        <span className="text-black dark:text-white font-bold text-3xl">
                            SY <div className="bg-sky-500 h-2 w-2"></div>
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation (Updated Sections and Content) */}
            <div className="flex flex-col overflow-y-auto no-scrollbar">
                <nav className="mb-6 flex flex-col gap-6">
                    {/* SECTION: MAIN */}
                    <div>
                        <h2 className="mb-3 text-xs uppercase text-gray-400">Main</h2>
                        {renderMenuItems(main, "main")}
                    </div>
                    {/* SECTION: LEARNING */}
                    <div>
                        <h2 className="mb-3 text-xs uppercase text-gray-400">Learning & Interaction</h2>
                        {renderMenuItems(learning, "learning")}
                    </div>
                    {/* SECTION: SUPPORT */}
                    <div>
                        <h2 className="mb-3 text-xs uppercase text-gray-400">Account & Support</h2>
                        {renderMenuItems(support, "support")}
                    </div>
                    {/* SECTION: USER/SETTINGS */}
                    <div>
                        <h2 className="mb-3 text-xs uppercase text-gray-400">Settings</h2>
                        {renderMenuItems(user, "user")}
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;