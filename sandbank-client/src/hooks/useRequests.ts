import { useState, useEffect } from "react";
import {
  getMyRequests,
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
  type ServiceRequest,
} from "../api/requestsApi";

export function useMyRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMyRequests()
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id: number) => {
    const res = await cancelRequest(id);
    setRequests((prev) => prev.map((r) => (r.id === id ? res.data : r)));
  };

  return { requests, loading, cancel };
}

export function useIncomingRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getIncomingRequests()
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  }, []);

  // update the request in list after action
  const updateRequest = (id: number, res: ServiceRequest) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? res : r)));

  const accept = async (id: number) =>
    updateRequest(id, (await acceptRequest(id)).data);
  const reject = async (id: number) =>
    updateRequest(id, (await rejectRequest(id)).data);
  const complete = async (id: number) =>
    updateRequest(id, (await completeRequest(id)).data);

  return { requests, loading, accept, reject, complete };
}
