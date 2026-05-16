export type ProfileSettingsTab = 'general-info' | 'professional-bio' | 'session-availability' | 'packages'

type ProfileSettingsTabsProps = {
  activeTab: ProfileSettingsTab
  onTabChange: (tab: ProfileSettingsTab) => void
}

const tabs: Array<{ id: ProfileSettingsTab; label: string }> = [
  { id: 'general-info', label: 'General Info' },
  { id: 'professional-bio', label: 'Professional Bio' },
  { id: 'session-availability', label: 'Availability' },
  { id: 'packages', label: 'Packages' },
]

export function ProfileSettingsTabs({ activeTab, onTabChange }: ProfileSettingsTabsProps) {
  return (
    <nav aria-label="Profile settings sections" className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid max-w-[740px] min-w-[560px] grid-cols-4 rounded-full bg-[#eef4ff] p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

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
