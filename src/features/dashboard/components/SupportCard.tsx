import { Button } from "@/components/ui/button";

export function SupportCard() {
  return (
    <section className="rounded-2xl bg-[#243349] p-5 text-white shadow-sm sm:rounded-3xl sm:p-7">
      <h2 className="font-headline text-lg font-extrabold">Need Assistance?</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Our concierge support team is available 24/7 for mentors.
      </p>
      <Button className="mt-6 h-10 rounded-full bg-white px-6 font-bold text-slate-950 hover:bg-blue-50">
        Contact Support
      </Button>
    </section>
  );
}
