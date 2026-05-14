import { useState, useEffect } from "react";
import {
  getActivities,
  createActivity,
  deleteActivity,
  type Activity,
  type CreateActivityData,
} from "../api/activitiesApi";

export function useActivities(filters?: {
  title?: string;
  max_duration?: number;
}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await getActivities(filters);
      setActivities(res.data);
    } catch {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (data: CreateActivityData) => {
    const res = await createActivity(data);
    setActivities((prev) => [...prev, res.data]); // add to list without refetching
  };

  const removeActivity = async (id: number) => {
    await deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a.id !== id)); // remove from list without refetching
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    addActivity,
    removeActivity,
    refetch: fetchActivities,
  };
}
