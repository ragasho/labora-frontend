import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface Tab {
    id: string;
    label: string;
    icon: string;
    color: string;
    bgColor: string;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    language: 'en' | 'ta';
}

export function TabNavigation({ tabs, activeTab, onTabChange, language }: TabNavigationProps) {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const tabsRef = useRef<HTMLDivElement>(null);

    const checkScrollPosition = () => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;

        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    };

    useEffect(() => {
        checkScrollPosition();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);

            return () => {
                container.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            };
        }
    }, []);

    useEffect(() => {
        checkScrollPosition();
    }, [tabs]);

    const scrollToActiveTab = () => {
        if (!scrollContainerRef.current || !tabsRef.current) return;

        const container = scrollContainerRef.current;
        const activeTabElement = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;

        if (activeTabElement) {
            const containerRect = container.getBoundingClientRect();
            const tabRect = activeTabElement.getBoundingClientRect();

            const scrollLeft = container.scrollLeft;
            const tabOffsetLeft = activeTabElement.offsetLeft;
            const tabWidth = activeTabElement.offsetWidth;
            const containerWidth = container.clientWidth;

            // Check if tab is not fully visible
            if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
                const targetScrollLeft = tabOffsetLeft - (containerWidth - tabWidth) / 2;
                container.scrollTo({
                    left: Math.max(0, targetScrollLeft),
                    behavior: 'smooth'
                });
            }
        }
    };

    useEffect(() => {
        scrollToActiveTab();
    }, [activeTab]);

    const scrollLeft = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.7;
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.7;
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="relative bg-white/70 backdrop-blur-xl border-b border-gray-100/80 shadow-sm">
            {/* Left Arrow */}
            {showLeftArrow && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollLeft}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                     bg-gradient-to-r from-white to-white/90 backdrop-blur-md
                     border border-gray-200/60 shadow-lg hover:shadow-xl
                     hover:scale-110 transition-all duration-300
                     h-9 w-9 p-0 rounded-full
                     hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                     hover:border-blue-200/60"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </Button>
                </motion.div>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollRight}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                     bg-gradient-to-l from-white to-white/90 backdrop-blur-md
                     border border-gray-200/60 shadow-lg hover:shadow-xl
                     hover:scale-110 transition-all duration-300
                     h-9 w-9 p-0 rounded-full
                     hover:bg-gradient-to-l hover:from-blue-50 hover:to-indigo-50
                     hover:border-blue-200/60"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </Button>
                </motion.div>
            )}

            {/* Scrollable Tab Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-hidden scroll-smooth px-1"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitScrollbar: { display: 'none' }
                }}
            >
                <div ref={tabsRef} className="flex relative">
                    {tabs.map((tab, index) => (
                        <motion.button
                            key={tab.id}
                            data-tab={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className={`
                relative flex-shrink-0 px-5 py-4 mx-1 
                text-center font-medium transition-all duration-300 ease-out
                rounded-xl border backdrop-blur-sm
                ${
                                activeTab === tab.id
                                    ? `${tab.color} bg-gradient-to-br ${tab.bgColor} to-white/80
                       border-white/40 shadow-lg shadow-black/5
                       ring-2 ring-white/50`
                                    : `text-gray-600 hover:text-gray-800 
                       bg-white/40 hover:bg-white/70
                       border-gray-200/40 hover:border-gray-300/60
                       hover:shadow-md shadow-black/5`
                            }
              `}
                        >
              <span className="inline-flex items-center gap-2.5 whitespace-nowrap relative z-10">
                <motion.span
                    className={`text-xl transition-transform duration-300 ${
                        activeTab === tab.id ? 'scale-110' : 'scale-100'
                    }`}
                    animate={{
                        scale: activeTab === tab.id ? 1.1 : 1,
                        rotate: activeTab === tab.id ? [0, -5, 5, 0] : 0
                    }}
                    transition={{
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.6, delay: 0.1 }
                    }}
                >
                  {tab.icon}
                </motion.span>
                <span className="font-medium tracking-wide">{tab.label}</span>
              </span>

                            {/* Active Tab Indicator */}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent
                           rounded-xl border border-white/40"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                />
                            )}

                            {/* Bottom highlight line for active tab */}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="bottomHighlight"
                                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 
                           bg-gradient-to-r ${tab.color.replace('text-', 'from-')} to-transparent 
                           rounded-full`}
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30
                                    }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Enhanced Gradient Fade Effects */}
            {showLeftArrow && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute left-0 top-0 bottom-0 w-12
                   bg-gradient-to-r from-white/80 via-white/60 to-transparent
                   pointer-events-none z-10"
                />
            )}
            {showRightArrow && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-0 top-0 bottom-0 w-12
                   bg-gradient-to-l from-white/80 via-white/60 to-transparent
                   pointer-events-none z-10"
                />
            )}

            {/* Subtle bottom shadow for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />
        </div>
    );
}