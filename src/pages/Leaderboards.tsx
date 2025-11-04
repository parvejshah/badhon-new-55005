import { useState, useEffect } from 'react';
import { useDonors } from '@/hooks/useDonors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BloodGroupBadge } from '@/components/BloodGroupBadge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export default function Leaderboards() {
  const { fetchDonors } = useDonors();
  const [topDonors, setTopDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchDonors();
      const sorted = [...data].sort((a, b) => b.donation_count - a.donation_count);
      setTopDonors(sorted.slice(0, 10));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8" />
          Donor Leaderboards
        </h1>
        <p className="text-muted-foreground">Top blood donors in our community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Donors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading leaderboard...</div>
            </div>
          ) : topDonors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No donors found
            </div>
          ) : (
            <div className="space-y-4">
              {topDonors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex-shrink-0 w-12 text-center">
                    {getRankIcon(index)}
                  </div>

                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg font-semibold">
                      {donor.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{donor.name}</h3>
                      <BloodGroupBadge bloodGroup={donor.blood_group} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {donor.hall} • {donor.department}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {donor.donation_count}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {donor.donation_count === 1 ? 'donation' : 'donations'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
