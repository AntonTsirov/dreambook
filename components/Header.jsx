import { StyleSheet, Pressable, Text, View } from "react-native";
import { React, useState } from "react";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Header = ({
  title = "",
  showBackButton = false,
  onNotificationPress = () => {},
}) => {
  const router = useRouter();
  const [easterEgg, setEasterEgg] = useState();

  return (
    <View style={styles.container}>
      {showBackButton && (
        <Pressable
          style={{ flex: 1, alignItems: "left" }}
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back-circle-outline" style={styles.icon} />
        </Pressable>
      )}
      <Pressable
        style={{ flex: showBackButton ? 1 : 2 }}
        onPress={() => {
          setEasterEgg(!easterEgg);
        }}
      >
        <Text style={styles.app_title}>
          {easterEgg ? "Dreamster" : "DreamBook"}
        </Text>
      </Pressable>
      <Text style={styles.screen_title}>{title}</Text>
      <Pressable style={styles.notification_cont} onPress={onNotificationPress}>
        <Ionicons name="notifications-outline" style={styles.icon} />
      </Pressable>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: theme.colors.dark,
  },
  app_title: {
    textAlign: "left",
    fontWeight: theme.fonts.big,
    fontSize: theme.font_sizes.large,
    color: theme.colors.light,
  },
  screen_title: {
    textAlign: "center",
    fontWeight: theme.fonts.big,
    fontSize: theme.font_sizes.large,
    color: theme.colors.light,
    flex: 4,
  },
  notification_cont: {
    flex: 2,
    alignItems: "flex-end",
  },
  icon: {
    fontSize: 32,
    color: theme.colors.light,
  },
});
