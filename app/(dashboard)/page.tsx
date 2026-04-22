import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getMessages } from "@/lib/mock-data";

export default async function DashboardPage() {
  const stats = getDashboardStats();
  const recentMessages = (await getMessages()).slice(0, 4);

  return (
    <div className="space-y-4">
      <section className="grid gap-3 xl:grid-cols-[1.35fr,0.65fr]">
        <div className="space-y-3">
          <StatsCards
            totalStations={stats.totalStations}
            openStations={stats.openStations}
            comingSoonStations={stats.comingSoonStations}
            totalActivities={stats.totalActivities}
            unreadMessages={stats.unreadMessages}
            lastLogin={stats.lastLogin}
          />
        </div>

        <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(30,144,255,0.12),rgba(255,255,255,0.7))] dark:bg-[linear-gradient(135deg,rgba(30,144,255,0.22),rgba(8,15,27,0.75))]">
          <CardHeader className="space-y-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">Quick Actions</p>
              <CardTitle className="mt-1.5">Ship the next update fast</CardTitle>
              <CardDescription>Everything is staged for a design-first admin review before real integrations land.</CardDescription>
            </div>
            <div className="grid gap-2">
              <Button asChild className="justify-between">
                <Link href="/stations/new">
                  Add Station
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/activities/new">
                  Add Activity
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/messages">
                  Review inbox
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>

      <ActivityChart />

      <RecentMessages messages={recentMessages} />
    </div>
  );
}
