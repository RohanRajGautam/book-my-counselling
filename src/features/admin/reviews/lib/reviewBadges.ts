/** Rating filter value — `all` disables the filter, otherwise an exact star rating. */
export type ReviewRatingFilter = 1 | 2 | 3 | 4 | 5 | 'all'

export interface ReviewFilterOption<V> {
  value: V
  label: string
}

/** Options for the exact-rating select. `<option>` can't hold an icon, so the
 *  star is a character. */
export const REVIEW_RATING_OPTIONS: ReviewFilterOption<ReviewRatingFilter>[] = [
  { value: 'all', label: 'Any rating' },
  { value: 5, label: '★ 5' },
  { value: 4, label: '★ 4' },
  { value: 3, label: '★ 3' },
  { value: 2, label: '★ 2' },
  { value: 1, label: '★ 1' },
]
