import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Droplet, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user, isAdmin, isVolunteer } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDonors: 0,
    pendingRequests: 0,
    totalDonations: 0,
  });

  const isAdminOrVolunteer = isAdmin || isVolunteer;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          {isAdmin && 'Admin Dashboard - Full system access'}
          {isVolunteer && !isAdmin && 'Volunteer Dashboard - Manage donors and requests'}
          {!isAdmin && !isVolunteer && 'Donor Dashboard - View your contribution'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonors}</div>
            <p className="text-xs text-muted-foreground">
              Registered in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting fulfillment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAdminOrVolunteer ? (
              <>
                <Button
                  className="w-full"
                  onClick={() => navigate('/requests')}
                >
                  <Droplet className="h-4 w-4 mr-2" />
                  View Blood Requests
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate('/donors')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Donors
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate('/certificates')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Generate Certificates
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="w-full"
                  onClick={() => navigate('/requests')}
                >
                  <Droplet className="h-4 w-4 mr-2" />
                  View Blood Requests
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate('/profile')}
                >
                  Update My Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
