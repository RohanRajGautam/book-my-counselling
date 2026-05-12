

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Star } from "lucide-react";

export function StatSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white text-slate-900">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Users className="w-4 h-4 mr-2 text-blue-600" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">142</div>
          <p className="text-xs font-medium text-emerald-500 mt-1">+12 this month</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-600 text-white">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider opacity-80">Upcoming This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">8</div>
          <p className="text-xs font-medium opacity-80 mt-1">Next session in 2 hours</p>
        </CardContent>
      </Card>

      <Card className="bg-white text-slate-900">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">4.9</div>
          <p className="text-xs font-medium text-slate-500 mt-1">From 86 student reviews</p>
        </CardContent>
      </Card>
    </div>
  );
}