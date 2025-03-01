import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Switch,
  FlatList,
  Dimensions,
} from "react-native";
import { React, useEffect, useState } from "react";
import { h_perc, w_perc } from "../../helpers/common";
import { theme } from "../../constants/theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import {
  fetchAllPublicDreams,
  fetchCurrentUserDreams,
} from "../../services/dreamService";
import DreamCard from "../../components/DreamCard";
import Loading from "../../components/Loading";
import { supabase } from "../../lib/supabase";
import { getUserData } from "../../services//userService";

var limit = 0;
const Home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [dreams, setDreams] = useState([]);
  const [hasMoreDreams, setHasMoreDreams] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  const handleDreamEvent = async (payload) => {
    if (
      payload.eventType == "INSERT" &&
      payload?.new?.id &&
      (isPublic === payload?.new?.public ||
        (!isPublic && user?.id == payload?.new?.user_id))
    ) {
      let newDream = { ...payload.new };
      let res = await getUserData(newDream.user_id);
      newDream.user = res.success ? res.data : {};
      setDreams((prevDreams) => [newDream, ...prevDreams]);
    }
  };

  useEffect(() => {
    limit = 0;
    setHasMoreDreams(true);
    getDreams("switch_query");
  }, [isPublic])

  useEffect(() => {
    let dreamChannel = supabase
      .channel("dreams")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dreams" },
        handleDreamEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dreamChannel);
    };
  }, []);

  const getDreams = async (switch_query = false) => {
    if (!user?.id || (!switch_query && !hasMoreDreams)) return null;

    limit += 2;
    var res;
    if (!isPublic) {
      res = await fetchCurrentUserDreams(user?.id, limit);
    } else {
      res = await fetchAllPublicDreams(user?.id, limit);
    }

    if (res.success) {
      if (dreams.length == res.data.length) setHasMoreDreams(false);
      setDreams(res.data);
    } else {
      Toast.show({ type: "error", text1: "Dreams", text2: res.msg });
    }
  };

  return (
    <ScreenWrapper>
      <Header
        title="Dreams"
        onNotificationPress={() => {
          Toast.show({
            type: "info",
            text1: "Notifications",
            text2: "To be implemented: list of notifications.",
          });
        }}
      />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
          }}
        >
          <Switch value={isPublic} onValueChange={setIsPublic} />
          <Text
            style={{
              width: 150,
              color: theme.colors.dark,
              fontSize: theme.font_sizes.normal,
              fontWeight: theme.fonts.big,
            }}
          >
            {isPublic ? "Everyone's Dreams" : "My Dreams"}
          </Text>
        </View>
        <FlatList
          data={dreams}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, rowGap: 20 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DreamCard item={item} currentUser={user} router={router} />
          )}
          ListFooterComponent={
            hasMoreDreams ? (
              <View style={{ marginVertical: 20 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30, alignSelf: "center" }}>
                <Text>You've reached the end of the dream book.</Text>
              </View>
            )
          }
          onEndReached={() => {
            getDreams();
          }}
          onContentSizeChange={(_, height) => {
            if (height < Dimensions.get("window").height) getDreams();
          }}
        ></FlatList>
      </View>
      <View style={styles.footerContainer}>
        <Pressable style={styles.footerItem} onPress={() => {}}>
          <Ionicons name="moon-outline" style={styles.icon} />
          <Text style={styles.footerText}>Dreams</Text>
        </Pressable>

        <Pressable
          style={styles.footerItem}
          onPress={() => {
            router.push("newdream");
          }}
        >
          <Ionicons name="add-circle-outline" style={styles.icon} />
          <Text style={styles.footerText}>New Dream</Text>
        </Pressable>

        <Pressable
          style={styles.footerItem}
          onPress={() => {
            router.push("profile");
          }}
        >
          <Ionicons name="person-outline" style={styles.icon} />
          <Text style={styles.footerText}>Profile</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.light,
    paddingVertical: h_perc(2),
    paddingHorizontal: w_perc(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "black",
  },
  title: {
    textAlign: "center",
    fontWeight: theme.fonts.big,
    fontSize: theme.font_sizes.large,
    color: "white",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 5,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontWeight: theme.fonts.small,
    fontSize: theme.font_sizes.small,
  },
  icon: {
    fontSize: 24,
    color: "white",
  },
});
