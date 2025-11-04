import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DonorData } from '@/components/DataPreview';
import { toast } from 'sonner';

export interface Sheet {
  id: string;
  sheet_name: string;
  hall_name: string | null;
  created_at: string;
  updated_at: string;
  total_rows: number;
}

export interface SheetWithData extends Sheet {
  sheet_data: DonorData[];
}

export function useSheets() {
  const [loading, setLoading] = useState(false);

  const saveSheet = async (
    sheetName: string,
    hallName: string,
    donorData: DonorData[]
  ): Promise<string | null> => {
    setLoading(true);
    try {
      // Insert sheet metadata
      const { data: sheet, error: sheetError } = await (supabase as any)
        .from('sheets')
        .insert({
          sheet_name: sheetName,
          hall_name: hallName,
          total_rows: donorData.length,
        })
        .select()
        .single();

      if (sheetError || !sheet) throw sheetError || new Error('Failed to create sheet');

      // Insert sheet data rows
      const dataRows = donorData.map(donor => ({
        sheet_id: sheet.id,
        serial_no: donor.serialNo,
        donor_name: donor.donorName,
        father_name: donor.fatherName,
        mother_name: donor.motherName,
        blood_group: donor.bloodGroup,
        department: donor.department,
        donation_count: donor.donationCount,
      }));

      const { error: dataError } = await (supabase as any)
        .from('sheet_data')
        .insert(dataRows);

      if (dataError) throw dataError;

      toast.success('Sheet saved successfully!');
      return sheet.id;
    } catch (error: any) {
      toast.error('Failed to save sheet: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSheets = async (): Promise<Sheet[]> => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('sheets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error('Failed to fetch sheets: ' + error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSheetWithData = async (sheetId: string): Promise<SheetWithData | null> => {
    setLoading(true);
    try {
      const { data: sheet, error: sheetError } = await (supabase as any)
        .from('sheets')
        .select('*')
        .eq('id', sheetId)
        .single();

      if (sheetError || !sheet) throw sheetError || new Error('Sheet not found');

      const { data: sheetData, error: dataError } = await (supabase as any)
        .from('sheet_data')
        .select('*')
        .eq('sheet_id', sheetId)
        .order('serial_no', { ascending: true });

      if (dataError) throw dataError;

      const donorData: DonorData[] = (sheetData || []).map(row => ({
        serialNo: row.serial_no,
        donorName: row.donor_name,
        fatherName: row.father_name,
        motherName: row.mother_name,
        bloodGroup: row.blood_group,
        department: row.department,
        donationCount: row.donation_count,
      }));

      return {
        ...sheet,
        sheet_data: donorData,
      };
    } catch (error: any) {
      toast.error('Failed to fetch sheet data: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSheet = async (sheetId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('sheets')
        .delete()
        .eq('id', sheetId);

      if (error) throw error;
      toast.success('Sheet deleted successfully!');
      return true;
    } catch (error: any) {
      toast.error('Failed to delete sheet: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSheetData = async (
    sheetId: string,
    donorData: DonorData[]
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Delete existing data
      await (supabase as any).from('sheet_data').delete().eq('sheet_id', sheetId);

      // Insert updated data
      const dataRows = donorData.map(donor => ({
        sheet_id: sheetId,
        serial_no: donor.serialNo,
        donor_name: donor.donorName,
        father_name: donor.fatherName,
        mother_name: donor.motherName,
        blood_group: donor.bloodGroup,
        department: donor.department,
        donation_count: donor.donationCount,
      }));

      const { error } = await (supabase as any).from('sheet_data').insert(dataRows);
      if (error) throw error;

      // Update total_rows
      await (supabase as any)
        .from('sheets')
        .update({ total_rows: donorData.length })
        .eq('id', sheetId);

      toast.success('Sheet data updated successfully!');
      return true;
    } catch (error: any) {
      toast.error('Failed to update sheet data: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSheet = async (
    sheetId: string,
    sheetName: string,
    hallName: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('sheets')
        .update({ 
          sheet_name: sheetName,
          hall_name: hallName,
          updated_at: new Date().toISOString()
        })
        .eq('id', sheetId);

      if (error) throw error;
      toast.success('Sheet updated successfully!');
      return true;
    } catch (error: any) {
      toast.error('Failed to update sheet: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createEmptySheet = async (
    sheetName: string,
    hallName: string
  ): Promise<string | null> => {
    setLoading(true);
    try {
      const { data: sheet, error } = await (supabase as any)
        .from('sheets')
        .insert({
          sheet_name: sheetName,
          hall_name: hallName,
          total_rows: 0,
        })
        .select()
        .single();

      if (error || !sheet) throw error || new Error('Failed to create sheet');
      toast.success('Sheet created successfully!');
      return sheet.id;
    } catch (error: any) {
      toast.error('Failed to create sheet: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveSheet,
    fetchSheets,
    fetchSheetWithData,
    deleteSheet,
    updateSheetData,
    updateSheet,
    createEmptySheet,
  };
}
