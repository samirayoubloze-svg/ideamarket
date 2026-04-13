/**
 * useIdeas Hook
 * Custom hook for ideas-related operations
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { useIdeaStore } from '../store/ideaStore';

export interface IdeaInput {
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  tags?: string[];
}

export interface IdeaResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const useIdeas = () => {
  const store = useIdeaStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(API_ENDPOINTS.IDEAS.LIST);

      if (!response.success) {
        const errorMsg = response.error || 'Failed to fetch ideas';
        setError(errorMsg);
        return;
      }

      // Update store with fetched ideas
      const ideas = response.data as any[];
      store.setIdeas(ideas);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch ideas';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const fetchIdeaById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(API_ENDPOINTS.IDEAS.GET(id));

      if (!response.success) {
        const errorMsg = response.error || 'Failed to fetch idea';
        setError(errorMsg);
        return null;
      }

      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch idea';
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createIdea = async (data: IdeaInput): Promise<IdeaResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(API_ENDPOINTS.IDEAS.CREATE, data);

      if (!response.success) {
        const errorMsg = response.error || 'Failed to create idea';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      const newIdea = response.data as any;
      store.addIdea(newIdea);

      return { success: true, message: 'Idea created successfully' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create idea';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const updateIdea = async (id: string, data: Partial<IdeaInput>): Promise<IdeaResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(API_ENDPOINTS.IDEAS.UPDATE(id), data);

      if (!response.success) {
        const errorMsg = response.error || 'Failed to update idea';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      const updatedIdea = response.data as any;
      store.updateIdea(id, updatedIdea);

      return { success: true, message: 'Idea updated successfully' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update idea';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIdea = async (id: string): Promise<IdeaResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(API_ENDPOINTS.IDEAS.DELETE(id));

      if (!response.success) {
        const errorMsg = response.error || 'Failed to delete idea';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

      store.removeIdea(id);

      return { success: true, message: 'Idea deleted successfully' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete idea';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const searchIdeas = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.IDEAS.SEARCH}?q=${encodeURIComponent(query)}`
      );

      if (!response.success) {
        const errorMsg = response.error || 'Search failed';
        setError(errorMsg);
        return [];
      }

      return response.data as any[];
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search failed';
      setError(errorMsg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTrendingIdeas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(API_ENDPOINTS.IDEAS.TRENDING);

      if (!response.success) {
        const errorMsg = response.error || 'Failed to fetch trending ideas';
        setError(errorMsg);
        return [];
      }

      return response.data as any[];
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch trending ideas';
      setError(errorMsg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    ...store,
    isLoading,
    error,
    fetchIdeas,
    fetchIdeaById,
    createIdea,
    updateIdea,
    deleteIdea,
    searchIdeas,
    getTrendingIdeas,
  };
};
