import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Droplet, Clock, Activity, Calendar } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6');
  const [stats, setStats] = useState<any>({
    totalDonors: 0,
    activeDonors: 0,
    totalDonations: 0,
    pendingRequests: 0,
    avgResponseTime: 0,
  });
  const [bloodGroupData, setBloodGroupData] = useState<any[]>([]);
  const [donationTrends, setDonationTrends] = useState<any[]>([]);
  const [hallData, setHallData] = useState<any[]>([]);
  const [requestStatusData, setRequestStatusData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const monthsAgo = parseInt(timeRange);
      const startDate = startOfMonth(subMonths(new Date(), monthsAgo));

      // Load basic stats
      const { data: donors } = await supabase
        .from('donors')
        .select('id, blood_group, hall, status, donation_count');

      const { data: donations } = await supabase
        .from('donations')
        .select('donation_date, status')
        .gte('donation_date', format(startDate, 'yyyy-MM-dd'));

      const { data: requests } = await supabase
        .from('blood_requests')
        .select('status, created_at, urgency')
        .gte('created_at', startDate.toISOString());

      // Calculate stats
      const activeDonors = donors?.filter(d => d.status === 'ready').length || 0;
      const pendingRequests = requests?.filter(r => r.status === 'pending').length || 0;

      setStats({
        totalDonors: donors?.length || 0,
        activeDonors,
        totalDonations: donations?.length || 0,
        pendingRequests,
        avgResponseTime: calculateAvgResponseTime(requests || []),
      });

      // Blood group distribution
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const bgData = bloodGroups.map(group => ({
        name: group,
        donors: donors?.filter(d => d.blood_group === group).length || 0,
      }));
      setBloodGroupData(bgData);

      // Donation trends by month
      const trends = calculateMonthlyTrends(donations || [], monthsAgo);
      setDonationTrends(trends);

      // Hall statistics
      const hallStats = calculateHallStats(donors || []);
      setHallData(hallStats.slice(0, 10)); // Top 10 halls

      // Request status distribution
      const statusData = [
        { name: 'Pending', value: requests?.filter(r => r.status === 'pending').length || 0 },
        { name: 'In Progress', value: requests?.filter(r => r.status === 'in_progress').length || 0 },
        { name: 'Fulfilled', value: requests?.filter(r => r.status === 'fulfilled').length || 0 },
        { name: 'Cancelled', value: requests?.filter(r => r.status === 'cancelled').length || 0 },
      ];
      setRequestStatusData(statusData);

    } catch (error: any) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgResponseTime = (requests: any[]) => {
    const fulfilledRequests = requests.filter(r => r.status === 'fulfilled');
    if (fulfilledRequests.length === 0) return 0;
    // Simplified calculation - in production, track actual fulfillment timestamps
    return 2.5; // hours (placeholder)
  };

  const calculateMonthlyTrends = (donations: any[], months: number) => {
    const trends = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const count = donations.filter(d => {
        const donationDate = new Date(d.donation_date);
        return donationDate >= monthStart && donationDate <= monthEnd;
      }).length;

      trends.push({
        month: format(monthStart, 'MMM yyyy'),
        donations: count,
      });
    }
    return trends;
  };

  const calculateHallStats = (donors: any[]) => {
    const hallMap = new Map();
    donors.forEach(donor => {
      const current = hallMap.get(donor.hall) || { total: 0, active: 0, donations: 0 };
      hallMap.set(donor.hall, {
        total: current.total + 1,
        active: current.active + (donor.status === 'ready' ? 1 : 0),
        donations: current.donations + donor.donation_count,
      });
    });

    return Array.from(hallMap.entries())
      .map(([hall, data]) => ({ hall, ...data }))
      .sort((a, b) => b.donations - a.donations);
  };

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Track donation trends and system performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDonors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Active Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.activeDonors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplet className="h-4 w-4 text-red-600" />
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.totalDonations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pendingRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Avg Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgResponseTime}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Monthly donation activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blood Group Distribution</CardTitle>
            <CardDescription>Number of donors per blood group</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bloodGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="donors" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Halls by Donations</CardTitle>
            <CardDescription>Most active residential halls</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hallData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="hall" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="donations" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
            <CardDescription>Current status of blood requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
