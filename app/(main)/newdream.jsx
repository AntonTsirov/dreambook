import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { React, useState, useRef } from "react";
import { theme } from "../../constants/theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Editor from "../../components/dom/RichTextEditor";
import Button from "../../components/Button";
import { createOrUpdateDream } from "../../services/dreamService";
import { h_perc, w_perc } from "../../helpers/common";

const NewDream = () => {
  const titleRef = useRef("");
  const [isPublic, setIsPublic] = useState(true);
  const [editorState, setEditorState] = useState(null);
  const [htmlString, setHtmlString] = useState(null);
  const [plainText, setPlainText] = useState("");
  const { user, setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!titleRef.current || !plainText) {
      Toast.show({
        type: "error",
        text1: "Dream",
        text2: "Please fill both the title and description of the dream!",
      });
      return;
    }

    setLoading(true);

    let data = {
      title: titleRef.current,
      description: htmlString,
      user_id: user?.id,
      public: isPublic,
    };

    let res = await createOrUpdateDream(data);
    setLoading(false);

    if (res.success) {
      router.replace("newdream");
      Toast.show({
        type: "success",
        text1: "Dream",
        text2: "Dream created successfully!",
      });
    } else {
      Toast.show({ type: "error", text1: "Dream", text2: res.msg });
    }
  };

  return (
    <ScreenWrapper>
      <Header
        title="New Dream"
        onNotificationPress={() => {
          Toast.show({
            type: "info",
            text1: "Notifications",
            text2: "To be implemented: list of notifications.",
          });
        }}
      />
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              titleRef.current = value;
            }}
            placeholder="Give your dream a title..."
            placeholderTextColor="#999"
            maxLength={30}
          />
          <Switch value={isPublic} onValueChange={setIsPublic} />
          <Text style={{ minWidth: 50 }}>
            {isPublic ? "Public" : "Private"}
          </Text>
        </View>
        <>
          <Editor
            setPlainText={setPlainText}
            setEditorState={setEditorState}
            setHtml={setHtmlString}
          />
        </>
        <Button
          buttonStyle={{ minWidth: 150 }}
          title="Create"
          loading={loading}
          onPress={onSubmit}
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

        <Pressable style={styles.footerItem} onPress={() => {}}>
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

export default NewDream;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: theme.colors.light,
    paddingVertical: h_perc(2),
    paddingHorizontal: w_perc(5),
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
    fontSize: 32,
    color: "white",
  },
  input: {
    color: theme.colors.dark,
    minWidth: 280,
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
