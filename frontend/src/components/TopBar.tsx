export default function TopBar() {
    return (
        <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
            <span className="font-medium text-sm text-gray-800">Dasboard</span>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Kian</span>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                    K
                </div>
            </div>
        </header>
    )
}