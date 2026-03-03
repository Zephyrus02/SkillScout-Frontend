export default function SidebarQuickLinks() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
      <h3 className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Quick Links
      </h3>
      <nav className="space-y-1 mt-2">
        <a
          href="#resume"
          className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-sm font-medium transition-colors"
        >
          <span>Resume</span>
          <span className="material-icons text-base">chevron_right</span>
        </a>
        {["Key Skills", "Employment", "Education"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase().replace(" ", "-")}`}
            className="flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-colors"
          >
            <span>{l}</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-500">
              Add
            </span>
          </a>
        ))}
        <a
          href="#projects"
          className="flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-colors"
        >
          <span>Projects</span>
          <span className="material-icons text-base">chevron_right</span>
        </a>
      </nav>
    </div>
  );
}
