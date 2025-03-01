import { StyleSheet, Pressable, Text, View } from "react-native";
import { React } from "react";
import { h_perc, w_perc } from "../helpers/common";
import { theme } from "../constants/theme";
import Loading from "../components/Loading";

const Button = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress = () => {},
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: "white" }]}>
        <Loading />
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    height: h_perc(6.6),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.medium,
  },

  text: {
    fontSize: h_perc(2.5),
    color: "white",
    fontWeight: theme.fonts.medium,
  },
});
