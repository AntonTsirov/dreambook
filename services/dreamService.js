import { supabase } from "../lib/supabase";

export const createOrUpdateDream = async (dream) => {
  try {
    const { data, error } = await supabase
      .from("dreams")
      .upsert(dream)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      msg: "Couldn't upload your dream! Please try again later.",
    };
  }
};

export const fetchCurrentUserDreams = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("dreams")
      .select("*, user: users(id, name), dream_likes (*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      msg: "Couldn't fetch dreams.",
    };
  }
};

export const fetchAllPublicDreams = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("dreams")
      .select("*, user: users(id, name), dream_likes (*)")
      .eq("public", true)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      msg: "Couldn't fetch dreams.",
    };
  }
};

export const createDreamLike = async (dreamLike) => {
  try {
    const { data, error } = await supabase
      .from("dream_likes")
      .insert(dreamLike)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        msg: "Couldn't like the dream.",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      msg: "Couldn't like the dream.",
    };
  }
};

export const removeDreamLike = async (dreamId, userId) => {
  try {
    const { error } = await supabase
      .from("dream_likes")
      .delete()
      .eq("user_id", userId)
      .eq("dream_id", dreamId);

    if (error) {
      return {
        success: false,
        msg: "Couldn't remove like from the dream.",
      };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      msg: "Couldn't remove like from the dream.",
    };
  }
};

export const getDreamLikes = async (dreamId) => {
  try {
    const { data, error } = await supabase
      .from("dream_likes")
      .select("*, user: users(id, name)")
      .eq("dream_id", dreamId)
      .order("created_at", { ascending: false })

    if (error) {
      return {
        success: false,
        msg: "Couldn't get the dream's likes.",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      msg: "Couldn't get the dream's likes.",
    };
  }
};
