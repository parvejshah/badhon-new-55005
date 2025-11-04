import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BloodRequest {
  id: string;
  blood_group_needed: string;
  patient_name: string;
  hospital: string;
  contact_number: string;
  urgency: string;
  status: string;
  handled_by_volunteer_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RequestFilters {
  status?: string;
  urgency?: string;
  bloodGroup?: string;
}

export function useBloodRequests() {
  const [loading, setLoading] = useState(false);

  const fetchRequests = async (filters?: RequestFilters): Promise<BloodRequest[]> => {
    setLoading(true);
    try {
      let query = supabase.from('blood_requests').select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.urgency) {
        query = query.eq('urgency', filters.urgency);
      }
      if (filters?.bloodGroup) {
        query = query.eq('blood_group_needed', filters.bloodGroup);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch requests: ' + error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (request: Omit<BloodRequest, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<BloodRequest | null> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('blood_requests')
        .insert({ ...request, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      toast.success('Blood request created successfully!');
      return data;
    } catch (error: any) {
      toast.error('Failed to create request: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string, volunteerId?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const updates: any = { status };
      if (volunteerId) {
        updates.handled_by_volunteer_id = volunteerId;
      }

      const { error } = await supabase
        .from('blood_requests')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Request status updated!');
      return true;
    } catch (error: any) {
      toast.error('Failed to update request: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fulfillRequest = async (requestId: string, donorId: string, volunteerId: string, notes?: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Create donation record
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          donor_id: donorId,
          request_id: requestId,
          volunteer_id: volunteerId,
          donation_date: new Date().toISOString().split('T')[0],
          status: 'completed',
          notes,
        });

      if (donationError) throw donationError;

      // Update request status
      const { error: requestError } = await supabase
        .from('blood_requests')
        .update({ status: 'fulfilled', handled_by_volunteer_id: volunteerId })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Update donor
      const { data: donor } = await supabase
        .from('donors')
        .select('donation_count')
        .eq('id', donorId)
        .single();

      const { error: donorError } = await supabase
        .from('donors')
        .update({
          last_donation_date: new Date().toISOString().split('T')[0],
          donation_count: (donor?.donation_count || 0) + 1,
          status: 'ready',
        })
        .eq('id', donorId);

      if (donorError) throw donorError;

      toast.success('Request fulfilled successfully!');
      return true;
    } catch (error: any) {
      toast.error('Failed to fulfill request: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchRequests,
    createRequest,
    updateRequestStatus,
    fulfillRequest,
  };
}
