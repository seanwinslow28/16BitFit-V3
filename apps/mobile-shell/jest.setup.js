// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      setOptions: jest.fn(),
      canGoBack: jest.fn(() => true),
    }),
    useRoute: () => ({
      params: {},
      key: 'test-route-key',
      name: 'TestScreen',
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
    useNavigationState: jest.fn((selector) => selector({})),
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
// Note: NativeAnimatedHelper mock is handled by react-native preset

// Provide safe defaults for Supabase during Jest runs unless explicitly opted in.
const supabaseIntegrationOptIn = process.env.JEST_ALLOW_SUPABASE === 'true';
if (!supabaseIntegrationOptIn) {
  process.env.EXPO_PUBLIC_SUPABASE_URL =
    process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
  process.env.JEST_SUPABASE_DISABLED = 'true';
} else {
  process.env.JEST_SUPABASE_DISABLED = 'false';
}

// Make Animated.timing synchronous during tests to avoid act() warnings and timer juggling.
const { Animated } = require('react-native');
Animated.timing = (value, config = {}) => {
  const toValue = config.toValue ?? 0;
  return {
    start: (callback) => {
      value.setValue(toValue);
      callback?.({ finished: true });
    },
    stop: jest.fn(),
    reset: jest.fn(),
  };
};
