import { Edit2, ExternalLink, Globe2, Link2 } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ProfilePresence() {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7">
      <h2 className="font-headline text-xl font-extrabold text-slate-950">
        Profile & Presence
      </h2>

      <div className="mt-7 flex flex-col items-center text-center">
        <Avatar className="size-20 border-4 border-blue-100">
          <AvatarImage alt="Dr. Emily Chen" />
          <AvatarFallback className="bg-blue-100 text-xl font-bold text-blue-700">
            EC
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-5 font-headline text-lg font-extrabold text-slate-950">
          Dr. Emily Chen
        </h3>
        <p className="mt-1 max-w-44 text-sm leading-5 text-slate-500">
          PhD Cognitive Science • 10+ yrs exp
        </p>
      </div>

      <p className="mt-8 text-xs font-bold uppercase leading-none tracking-[0.12em] text-slate-500">
        Personal Bio
      </p>
      <p className="mt-3 rounded-2xl bg-[#eef4ff] p-5 text-sm leading-6 text-slate-700">
        Specialized in helping undergraduates navigate academic writing and research
        methodologies. Former admissions officer with deep insights into graduate school
        applications.
      </p>

      <p className="mt-7 text-xs font-bold uppercase leading-none tracking-[0.12em] text-slate-500">
        Professional Links
      </p>
      <div className="mt-3 space-y-3">
        <ProfileLink href="#" icon={<Link2 className="size-5 text-blue-700" />}>
          LinkedIn Profile
        </ProfileLink>
        <ProfileLink href="#" icon={<Globe2 className="size-5 text-blue-700" />}>
          Academic Portfolio
        </ProfileLink>
      </div>

      <Button
        variant="outline"
        className="mt-7 h-11 w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-blue-700 hover:bg-blue-50"
      >
        <Edit2 className="size-4" />
        Edit Profile
      </Button>
    </section>
  );
}

function ProfileLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center justify-between rounded-2xl bg-[#e6efff] px-4 text-sm font-bold text-slate-800 transition hover:bg-blue-100"
    >
      <span className="flex items-center gap-3">
        {icon}
        {children}
      </span>
      <ExternalLink className="size-4 text-slate-400" />
    </Link>
  );
}
