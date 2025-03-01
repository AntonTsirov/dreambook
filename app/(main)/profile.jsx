import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { React, useState } from "react";
import { theme } from "../../constants/theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const Profile = () => {
  const { user, setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Toast.show({
        type: "error",
        text1: "Logout",
        text2: "An error occured during logout!",
      });
    }
    setLoading(false);
  };

  return (
    <ScreenWrapper>
      <Header
        title="Profile"
        onNotificationPress={() => {
          Toast.show({
            type: "info",
            text1: "Notifications",
            text2: "To be implemented: list of notifications.",
          });
        }}
      />
      <View
        style={{
          paddingTop: 10,
          alignItems: "center",
          backgroundColor: theme.colors.light,
        }}
      >
        <Image
          source={{ uri: "https://avatar.iran.liara.run/public/boy?username=Ash" }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.container}>
        <ProfileItem label="Name" value={user?.name} />
        <ProfileItem label="Email" value={user?.email} />
        <ProfileItem label="Bio" value={user?.bio ? user?.bio : "No bio :("} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
          backgroundColor: theme.colors.light,
        }}
      >
        <Button
          buttonStyle={{
            width: 150,
          }}
          title="Edit"
          onPress={() => {
            Toast.show({
              type: "info",
              text1: "Edit your profile",
              text2:
                "To be implemented: you will be able to edit your name, bio and profile picture.",
            });
          }}
        />
        <Button
          buttonStyle={{
            width: 150,
          }}
          title="Logout"
          loading={loading}
          onPress={onLogout}
        />
      </View>
      <View style={styles.footerContainer}>
        <Pressable
          style={styles.footerItem}
          onPress={() => {
            router.push("home");
          }}
        >
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

        <Pressable style={styles.footerItem} onPress={() => {}}>
          <Ionicons name="person-outline" style={styles.icon} />
          <Text style={styles.footerText}>Profile</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

const ProfileItem = ({ label, value }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.light,
    padding: 20,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: theme.colors.dark,
  },
  title: {
    textAlign: "center",
    fontWeight: theme.fonts.big,
    fontSize: theme.font_sizes.large,
    color: theme.colors.light,
    paddingLeft: 10,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.colors.dark,
    paddingVertical: 5,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    color: theme.colors.light,
    fontWeight: theme.fonts.small,
    fontSize: theme.font_sizes.small,
  },
  icon: {
    fontSize: 32,
    color: theme.colors.light,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontWeight: theme.fonts.big,
    fontSize: theme.font_sizes.big,
    color: theme.colors.dark,
    fontSize: theme.font_sizes.large,
    flex: 1,
  },
  value: {
    fontWeight: theme.fonts.small,
    fontSize: theme.font_sizes.big,
    color: theme.colors.dark,
    flex: 5,
    textAlign: "right",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});
