import { StyleSheet, TextInput, Text, View } from "react-native";
import { React, useRef, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";
import { theme } from "../constants/theme";

const Register = () => {
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Toast.show({type: 'error', text1: "Register", text2: "Please fill all fields before registering!"})
      return;
    }

    let email = emailRef.current.trim();
    let name = nameRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          email
        }
      }
    });

    setLoading(false);

    if (error) {
      Toast.show({type: 'error', text1: "Register", text2: error.message})
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.app_name}>DreamBook</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => (emailRef.current = value)}
          placeholder="Enter your email"
          placeholderTextColor='#999'
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          onChangeText={(value) => (nameRef.current = value)}
          placeholder="Enter your nickname"
          placeholderTextColor='#999'
        />
        <TextInput
          style={styles.input}
          onChangeText={(value) => (passwordRef.current = value)}
          placeholder="Enter your password"
          placeholderTextColor='#999'
          secureTextEntry
        />
        <Button title="Register" loading={loading} onPress={onSubmit} />
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  app_name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },

  input: {
    color: theme.colors.dark,
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
