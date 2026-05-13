import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProfilePhotoCard() {
  return (
    <section className="rounded-2xl bg-white p-5 text-center shadow-sm sm:rounded-3xl sm:p-7">
      <div className="mx-auto flex size-36 items-center justify-center rounded-full border-[5px] border-blue-700 bg-[#eef4ff] p-2">
        <div className="relative size-full rounded-full bg-white shadow-inner">
          <div className="absolute inset-4 rounded-md bg-[linear-gradient(135deg,#dbe7ff,#ffffff_45%,#cfe0ff)]" />
          <div className="absolute bottom-1 right-1 flex size-10 items-center justify-center rounded-full bg-blue-700 text-white shadow-sm">
            <Camera className="size-5" />
          </div>
        </div>
      </div>

      <h2 className="mt-7 font-headline text-xl font-extrabold text-slate-950">
        Profile Photo
      </h2>
      <p className="mx-auto mt-2 max-w-44 text-sm leading-5 text-slate-500">
        Upload a high-resolution headshot for your mentor profile.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="ghost" className="h-12 rounded-xl bg-[#eef4ff] font-bold">
          Remove
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-xl border-blue-700 font-bold text-blue-700 hover:bg-blue-50"
        >
          Update
        </Button>
      </div>
    </section>
  );
}
