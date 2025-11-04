import { useState, useEffect } from 'react';
import { useDonors } from '@/hooks/useDonors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BloodGroupBadge } from '@/components/BloodGroupBadge';
import { DonorStatusBadge } from '@/components/DonorStatusBadge';
import { Search, Plus, Mail, Phone, Users } from 'lucide-react';
import { BLOOD_GROUPS } from '@/lib/bloodGroupColors';

export default function Donors() {
  const { fetchDonors, loading } = useDonors();
  const [donors, setDonors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [hallFilter, setHallFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDonors();
  }, [bloodGroupFilter, hallFilter, statusFilter]);

  const loadDonors = async () => {
    const filters: any = {};
    if (bloodGroupFilter !== 'all') filters.bloodGroup = bloodGroupFilter;
    if (hallFilter !== 'all') filters.hall = hallFilter;
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (searchTerm) filters.search = searchTerm;

    const data = await fetchDonors(filters);
    setDonors(data);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDonors();
  };

  const halls = [
    'Shaheed Rafiq Hall', 'Jinnah Hall', 'Amar Ekushey Hall',
    'Shahid Salam-Barkat Hall', 'Suhrawardy Hall', 'Shaheed Sergeant Zahurul Haq Hall',
    'Fazlul Huq Muslim Hall', 'Haji Muhammad Mohsin Hall', 'Bishwakabi Rabindranath Hall',
    'Shamsun Nahar Hall', 'Bangladesh-Kuwait Maitree Hall', 'Bangabandhu Sheikh Mujibur Rahman Hall',
    'Begum Fazilatunnesa Mujib Hall', 'Dr. Muhammad Shahidullah Hall', 'Ruqayyah Hall',
    'Bangamata Sheikh Fazilatunnessa Mujib Hall', 'Kabi Jasimuddin Hall', 'Kabi Sufia Kamal Hall',
    'Masterda Surya Sen Hall'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Donor Management</h1>
          <p className="text-muted-foreground">Manage and track all registered blood donors</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Donor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search by name, phone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Groups</SelectItem>
                {BLOOD_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={hallFilter} onValueChange={setHallFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Hall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Halls</SelectItem>
                {halls.map((hall) => (
                  <SelectItem key={hall} value={hall}>{hall}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="going">Going</SelectItem>
                <SelectItem value="donated">Donated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Donors ({donors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Hall</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Donations</TableHead>
                  <TableHead>Last Donation</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="animate-pulse">Loading donors...</div>
                    </TableCell>
                  </TableRow>
                ) : donors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No donors found matching the filters
                    </TableCell>
                  </TableRow>
                ) : (
                  donors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">{donor.name}</TableCell>
                      <TableCell>
                        <BloodGroupBadge bloodGroup={donor.blood_group} />
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{donor.hall}</TableCell>
                      <TableCell>{donor.department}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {donor.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {donor.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {donor.donation_count}
                      </TableCell>
                      <TableCell>
                        {donor.last_donation_date || 'Never'}
                      </TableCell>
                      <TableCell>
                        <DonorStatusBadge status={donor.status} lastDonationDate={donor.last_donation_date} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
