import { React, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import Toast, {
  InfoToast,
  SuccessToast,
  ErrorToast,
} from "react-native-toast-message";
import { LogBox } from "react-native";
import { theme } from "../constants/theme";

const toastConfig = {
  success: (props) => (
    <SuccessToast
      {...props}
      
      text2Style={{
        fontSize: theme.font_sizes.normal,
        fontWeight: theme.fonts.normal,
      }}
      text2NumberOfLines={5}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text2Style={{
        fontSize: theme.font_sizes.normal,
        fontWeight: theme.fonts.normal,
      }}
      text2NumberOfLines={5}
    />
  ),
  info: (props) => (
    <InfoToast
      {...props}
      width = ''
      text2Style={{
        fontSize: theme.font_sizes.normal,
        fontWeight: theme.fonts.normal,
      }}
      text2NumberOfLines={5}
    />
  ),
};

LogBox.ignoreLogs([
  "Warning: TRenderEngineProvider",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TNodeChildrenRenderer",
]);
const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
      <Toast config={toastConfig} />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("welcome");
      }
    });
  }, []);

  const updateUserData = async (user) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData(res.data);
    }
  };
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
