import {
  MentorEditorFallbackShell,
  MentorEditorSkeletonCard,
  MentorEditorSkeletonHeader,
  MentorEditorSkeletonTabs,
} from '../../_shared/MentorEditorSkeleton'

export function AdminEditMentorFallback() {
  return (
    <MentorEditorFallbackShell>
      <MentorEditorSkeletonHeader />
      <MentorEditorSkeletonTabs />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
        <div className="space-y-6 sm:space-y-7">
          <MentorEditorSkeletonCard lines={4} />
          <MentorEditorSkeletonCard lines={4} />
          <MentorEditorSkeletonCard lines={6} />
        </div>
        <MentorEditorSkeletonCard lines={3} />
      </div>
    </MentorEditorFallbackShell>
  )
}
