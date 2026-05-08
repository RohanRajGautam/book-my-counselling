const Statistics = () => {
  return (
    <div className="mb-22 bg-gradient-to-r from-[#6CF8BB33] to-[#2563EB1A] px-4 py-10 sm:flex sm:h-108 sm:flex-col sm:items-center sm:justify-center">
      <h2 className="mb-12 text-center text-2xl font-extrabold sm:text-3xl">
        A platform that delivers results
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:min-w-7xl sm:grid-cols-4 sm:gap-8">
        <div className="flex min-h-44 items-center justify-center rounded-md bg-white p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="text-sm font-bold text-blue-700">Career enhanced for</div>
            <div className="text-5xl font-extrabold text-blue-700 sm:text-6xl">89%</div>
            <div className="text-base font-bold text-blue-700 sm:text-lg">Happy members</div>
          </div>
        </div>

        <div className="flex min-h-44 items-center justify-center rounded-md bg-white p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="text-sm font-bold text-blue-700">Empowered by</div>
            <div className="text-5xl font-extrabold text-blue-700 sm:text-6xl">200k</div>
            <div className="text-base font-bold text-blue-700 sm:text-lg">Expert mentors</div>
          </div>
        </div>

        <div className="flex min-h-44 items-center justify-center rounded-md bg-white p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="text-sm font-bold text-blue-700">Global community from</div>
            <div className="text-5xl font-extrabold text-blue-700 sm:text-6xl">150</div>
            <div className="text-base font-bold text-blue-700 sm:text-lg">Countries</div>
          </div>
        </div>

        <div className="flex min-h-44 items-center justify-center rounded-md bg-white p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="text-sm font-bold text-blue-700">We have build over</div>
            <div className="text-5xl font-extrabold text-blue-700 sm:text-6xl">200M+</div>
            <div className="text-base font-bold text-blue-700 sm:text-lg">Connections</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
