import React from 'react';
import {useSocketUpdate} from "./SocketUpdateHook.tsx";

export const DashboardLayout = ({ children, userEmail }: { children: React.ReactNode, userEmail?: string }) => {
    useSocketUpdate();
    return (
        // 'w-full' and 'overflow-x-hidden' ensure the container doesn't create horizontal scrollbars
        <div className="flex min-h-screen w-full bg-gray-100 overflow-x-hidden">

            {/* Sidebar - 'flex-shrink-0' ensures the sidebar doesn't get squished */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
                <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight">
                    ProjectDash
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <a href="/projects" className="block px-4 py-2 rounded-lg bg-indigo font-medium transition shadow-sm">
                        Projects
                    </a>
                    <a href="/settings" className="block px-4 py-2 rounded-lg text-slate-400 hover:text-black hover:bg-slate-800 transition">
                        Settings
                    </a>
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
                    SIGNED IN AS <br/>
                    <span className="text-black font-medium truncate block">{userEmail || 'User'}</span>
                </div>
            </aside>

            {/* Main Content - 'flex-1' and 'min-w-0' allow this container to take all remaining space */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Header - Fixed height with standard padding */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Dashboard</h2>
                    <button
                        onClick={() => window.location.href = '/logout'}
                        className="px-4 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                        Logout
                    </button>
                </header>

                {/* Content Area - 'flex-grow' ensures this fills the bottom of the screen */}
                <section className="p-8 flex-grow">
                    {/* We wrap children in a max-width container if you want it centered,
              or keep it as is for full-width */}
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </section>
            </main>
        </div>
    );
};