import Image from 'next/image'

const QUOTES = [
  {
    name: 'Sam Altman',
    role: 'CEO, OpenAI',
    quote:
      'AI will be the greatest force for economic empowerment and a lot of people getting rich we have ever seen.',
    image: '/home/ashwin.png',
  },
  {
    name: 'Marc Andreessen',
    role: 'VC, Andreessen Horowitz',
    quote:
      'AI will not just be a new tool, it will be a fundamental shift in how all technology is built and used.',
    image: '/home/ashwin.png',
  },
]

export function QuotesMarquee() {
  return (
    <section
      className="overflow-hidden border-y border-[#d9e3f6] bg-white pb-8"
      aria-label="Quotes"
    >
      <style>
        {`
          @keyframes quotes-marquee {
            from {
              transform: translate3d(0, 0, 0);
            }

            to {
              transform: translate3d(-50%, 0, 0);
            }
          }

          .quotes-marquee-track {
            --quotes-duration: 38s;
            animation: quotes-marquee var(--quotes-duration) linear infinite;
            min-width: max-content;
            transform: translate3d(0, 0, 0);
            will-change: transform;
          }

          @media (max-width: 640px) {
            .quotes-marquee-track {
              --quotes-duration: 28s;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .quotes-marquee-track {
              --quotes-duration: 90s;
            }
          }
        `}
      </style>

      <div className="relative mt-7 sm:mt-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 sm:w-24" />
        <div className="w-10sm:w-24 pointer-events-none absolute inset-y-0 right-0 z-20" />

        <div
          className="quotes-marquee-track flex w-max"
          style={{
            animation: 'quotes-marquee var(--quotes-duration, 38s) linear infinite',
          }}
        >
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className="flex shrink-0" aria-hidden={groupIndex === 1}>
              {QUOTES.map((item) => (
                <article
                  key={`${item.name}-${groupIndex}`}
                  className="relative grid h-[430px] w-[min(88vw,360px)] shrink-0 grid-rows-[190px_1fr] overflow-hidden border border-[#d9e3f6] bg-white shadow-[0_18px_46px_rgba(18,28,42,0.08)] sm:h-[360px] sm:w-[700px] sm:grid-cols-[1fr_250px] sm:grid-rows-1 lg:w-[760px] lg:grid-cols-[1fr_292px]"
                >
                  <div className="relative overflow-hidden bg-white sm:order-2">
                    <div className="absolute inset-x-10 bottom-3 h-8 rounded-full bg-[#004ac6]/10 blur-xl sm:inset-x-8 sm:bottom-5 sm:h-10" />

                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 292px, (min-width: 640px) 250px, 88vw"
                      className="pointer-events-none scale-150 object-contain grayscale"
                    />
                  </div>

                  <div className="flex min-w-0 flex-col px-5 py-5 sm:px-8 sm:py-8 lg:px-9">
                    <span className="mb-4 block h-1 w-12 rounded-full bg-[#6cf8bb]" />
                    <blockquote className="text-[1.08rem] leading-[1.42] font-semibold text-[#121c2a] sm:text-[1.45rem] lg:text-[1.58rem]">
                      {item.quote}
                    </blockquote>

                    <div className="mt-auto pt-5">
                      <p className="text-xl leading-none font-extrabold tracking-tight text-[#004ac6] sm:text-2xl">
                        {item.name}
                      </p>
                      <p className="mt-2 text-sm leading-snug font-bold text-[#5d6574] sm:text-base">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
