export type AdminCreateMentorTab = 'general-info' | 'professional-bio'

type AdminCreateMentorTabsProps = {
  activeTab: AdminCreateMentorTab
  onTabChange: (tab: AdminCreateMentorTab) => void
  /** Accessible label announced for the tab list. Defaults to the create copy. */
  ariaLabel?: string
}

const tabs: Array<{ id: AdminCreateMentorTab; label: string }> = [
  { id: 'general-info', label: 'General Info' },
  { id: 'professional-bio', label: 'Professional Bio' },
]

export function AdminCreateMentorTabs({
  activeTab,
  onTabChange,
  ariaLabel = 'Create mentor sections',
}: AdminCreateMentorTabsProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="grid max-w-[740px] min-w-[560px] grid-cols-2 rounded-full bg-[#eef4ff] p-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onTabChange(tab.id)}
              className={[
                'rounded-full px-4 py-3 text-center text-sm font-extrabold whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-700 hover:text-blue-700',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
