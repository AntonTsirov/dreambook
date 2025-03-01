import { View, StyleSheet, Text, Pressable } from "react-native";
import { React, useEffect, useState } from "react";
import { theme } from "../constants/theme";
import moment from "moment";
import { w_perc } from "../helpers/common";
import RenderHTML from "react-native-render-html";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  createDreamLike,
  getDreamLikes,
  removeDreamLike,
} from "../services/dreamService";

const DreamCard = ({ item, currentUser, router }) => {
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    console.log("update");
    setLikes(item?.dream_likes);
  }, []);

  const on_likes_pressed = async () => {
    if (liked) {
      let updatedLikes = likes?.filter(
        (like) => like.user_id != currentUser?.id
      );
      setLikes([...updatedLikes]);
      let res = await removeDreamLike(item?.id, currentUser?.id);

      if (!res.success)
        Toast.show({ type: "error", text1: "Dislike", text2: res.msg });
    } else {
      let data = {
        user_id: currentUser?.id,
        dream_id: item?.id,
      };
      setLikes([...likes, data]);
      let res = await createDreamLike(data);

      if (!res.success)
        Toast.show({ type: "error", text1: "Like", text2: res.msg });
    }
  };

  const on_comments_pressed = () => {
    Toast.show({ type: "info", text1: "Comments", text2: "To be implemented" });
  };

  const on_likes_list_pressed = async () => {
    let res = await getDreamLikes(item?.id);

    if (!res.success)
      Toast.show({ type: "error", text1: "Likes", text2: res.msg });
    else Toast.show({ type: "success", text1: "Likes", text2: res.data.map(like_data => like_data?.user?.name).join(", ") });
  };

  const liked = likes?.filter((like) => like.user_id == currentUser?.id)[0]
    ? true
    : false;
  const createdAt = moment(item?.created_at).format("MMM D");

  return (
    <View style={styles.dreamCont}>
      <View style={styles.titleCardCont}>
        <View style={styles.leftSideTitleCardCont}>
          <Text
            style={{
              fontSize: theme.font_sizes.large,
              fontWeight: theme.fonts.big,
            }}
          >
            {item?.title}
          </Text>
          <Text
            style={{
              fontSize: theme.font_sizes.small,
              fontWeight: theme.fonts.small,
            }}
          >
            {item?.user?.name} • {createdAt}
          </Text>
        </View>
        <View style={styles.rightSideTitleCardCont}>
          <Pressable onPress={on_likes_pressed}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              style={[styles.icon, liked ? { color: "#ff4d4d" } : null]}
            />
          </Pressable>
          <Pressable onPress={on_likes_list_pressed}>
            <Text style={styles.iconText}>{likes?.length}</Text>
          </Pressable>
          <Pressable onPress={on_comments_pressed}>
            <Ionicons name="chatbox-outline" style={styles.icon} />
          </Pressable>
          <Text style={styles.iconText}>0</Text>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          borderWidth: 3,
          borderColor: "#ebebe0",
        }}
      >
        <RenderHTML
          contentWidth={w_perc(100)}
          source={{ html: item?.description }}
        />
      </View>
    </View>
  );
};

export default DreamCard;

const styles = StyleSheet.create({
  dreamCont: {
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  titleCardCont: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  leftSideTitleCardCont: {
    flexDirection: "column",
  },
  rightSideTitleCardCont: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
    color: "black",
    alignSelf: "center",
  },
  iconText: {
    fontSize: theme.font_sizes.normal,
    fontWeight: theme.fonts.big,
    alignSelf: "center",
    minWidth: 10,
  },
});
