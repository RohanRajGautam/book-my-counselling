import React from 'react'

const RecentActivity = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Recent Activity
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Latest updates from your dashboard
                  </p>
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-4">
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-2" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      New student booking confirmed
                    </p>
                    <span className="text-xs text-slate-500">
                      2 minutes ago
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-2" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Advisory session updated successfully
                    </p>
                    <span className="text-xs text-slate-500">
                      1 hour ago
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-2" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Reminder for tomorrow’s consultation
                    </p>
                    <span className="text-xs text-slate-500">
                      5 hours ago
                    </span>
                  </div>
                </div>

              </div>
            </section>
  )
}

export default RecentActivity