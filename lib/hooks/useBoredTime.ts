import { useEffect, useState } from "react";
import { supabase } from "../utilities/supabase";

export function useBoredTime() {
  const [boredTime, setBoredTime] = useState<number>(5);

  // Function to fetch the current bored-time value
  const getTime = async () => {
    const { data, error } = await supabase
      .from("time_table")
      .select("time")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error fetching bored-time:", error);
      return null;
    }

    if (data) {
      setBoredTime(data.time);
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    getTime();

    const channel = supabase
      .channel("schema-db-changes") // You can name the channel anything
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public", 
          table: "time_table", 
        },
        (payload) => {
          setBoredTime(payload.new.time || 5)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { boredTime };
}
