import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto w-full">
                <div className="p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
