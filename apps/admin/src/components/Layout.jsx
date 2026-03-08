import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />
            <main className="flex-1 overflow-hidden h-full">
                <div className="w-full h-full flex flex-col overflow-hidden">
                    <div className="p-4 sm:p-6 md:p-8 w-full h-full overflow-hidden flex flex-col">
                        <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col overflow-hidden">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
