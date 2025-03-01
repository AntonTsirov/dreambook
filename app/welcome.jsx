import { Image, StyleSheet, Text, View } from "react-native";
import { React } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { h_perc, w_perc } from "../helpers/common";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { theme } from "../constants/theme";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image
          style={styles.app_logo}
          resizeMode="contain"
          source={require("../assets/images/dreambook.png")}
        />
        <Text style={styles.title}>DreamBook</Text>
        <View style={styles.footer}>
          <Button
            buttonStyle={{ marginHorizontal: w_perc(3) }}
            title="Login"
            onPress={() => router.push("login")}
          />
          <Text style={{ alignSelf: "center", fontSize: h_perc(2) }}>-OR-</Text>
          <Button
            buttonStyle={{ marginHorizontal: w_perc(3) }}
            title="Register"
            onPress={() => router.push("register")}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    marginHorizontal: w_perc(4),
    marginVertical: h_perc(4),
  },
  app_logo: {
    height: h_perc(10),
    width: w_perc(10),
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: h_perc(4),
    fontWeight: theme.fonts.medium,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
});
