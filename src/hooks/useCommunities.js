import { useState, useEffect } from "react";
import { getCommunities } from "../api/client";

export function useCommunities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunities()
      .then(({ data }) =>
        setCommunities(Array.isArray(data) ? data : (data.results ?? [])),
      )
      .catch(() => setCommunities([]))
      .finally(() => setLoading(false));
  }, []);

  return { communities, loading };
}
