import { supabase } from "@/app/utils/supabase/supabaseClient";

export interface OfferData {
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  category?: string;
  min_order_amount?: number;
  start_date: string;
  end_date: string;
  display_type: 'modal' | 'banner';
}

export const fetchOffers = async () => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

export const createOffer = async (offerData: OfferData) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .insert([{
        ...offerData,
        is_active: true,
        category: offerData.category || null,
        min_order_amount: offerData.min_order_amount || null
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

export const updateOffer = async (offerId: string, offerData: OfferData) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .update({
        ...offerData,
        category: offerData.category || null,
        min_order_amount: offerData.min_order_amount || null
      })
      .eq('id', offerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
};

export const deleteOffer = async (offerId: string) => {
  try {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', offerId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
};

export const toggleOfferStatus = async (offerId: string, isActive: boolean) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .update({ is_active: isActive })
      .eq('id', offerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error toggling offer status:', error);
    throw error;
  }
};

export const getActiveOffers = async () => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching active offers:', error);
    return [];
  }
};