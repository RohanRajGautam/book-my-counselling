import { HOME_STATS } from '../lib/home.constants'

export function Statistics() {
  return (
    <section className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-10 sm:flex sm:min-h-108 sm:flex-col sm:items-center sm:justify-center">
      <h2 className="mb-12 text-center text-2xl font-extrabold text-white sm:text-3xl">
        A platform that delivers results
      </h2>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
        {HOME_STATS.map((stat) => (
          <div
            key={stat.detail}
            className="flex min-h-44 items-center justify-center rounded-md bg-white p-6"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="text-sm font-bold text-blue-700">{stat.label}</div>
              <div className="text-5xl font-extrabold text-blue-700 sm:text-6xl">{stat.value}</div>
              <div className="text-base font-bold text-blue-700 sm:text-lg">{stat.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
