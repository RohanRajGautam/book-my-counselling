import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const bookings = [
  { name: "Alex Stratten", major: "Computer Science Major • Career Pivot", time: "Today, 2:00 PM", duration: "45 min session", initial: "AS", type: "join" },
  { name: "Maria Jenkins", major: "Pre-Med • Resume Review", time: "Tomorrow, 10:30 AM", duration: "30 min session", initial: "MJ", type: "details" },
];

export function UpcomingBookings() {
  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Upcoming Bookings</h2>
        <Button variant="link" className="text-blue-600">View All</Button>
      </div>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.name} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="bg-blue-100 text-blue-700 font-bold">
                <AvatarFallback>{booking.initial}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-slate-900">{booking.name}</h3>
                <p className="text-sm text-slate-500">{booking.major}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-slate-900">{booking.time}</p>
                <p className="text-xs text-slate-500">{booking.duration}</p>
              </div>
              <Button variant={booking.type === "join" ? "default" : "outline"} className={booking.type === "join" ? "bg-blue-600" : ""}>
                {booking.type === "join" ? "Join" : "Details"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}