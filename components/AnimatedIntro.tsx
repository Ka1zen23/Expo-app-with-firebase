import { ColorPalette } from '@/constants/Colors';
import { memo, useEffect } from 'react';
import { Image, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';

const content = [
  { title: "Bus4BN", bg: ColorPalette.lime, fontColor: ColorPalette.pink },
  { title: "Bus4BN", bg: ColorPalette.brown, fontColor: ColorPalette.sky },
  { title: "Bus4BN", bg: ColorPalette.orange, fontColor: ColorPalette.blue },
  { title: "Bus4BN", bg: ColorPalette.teal, fontColor: ColorPalette.yellow },
];

const AnimatedIntro = () => {
  const { width } = useWindowDimensions();
  const logoSize = 80;
  const centerX = width / 2 - logoSize / 2;
  const leftX = 60;

  const currentX = useSharedValue(centerX);
  const textOpacity = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const showDuration = 4000; // ms text is visible
  const moveDuration = 1000; // ms for logo move
  const fadeDuration = 500;  // ms for fade

  const text = useDerivedValue(() => content[currentIndex.value].title);

  const textStyle = useAnimatedStyle(() => ({
    color: content[currentIndex.value].fontColor,
    opacity: textOpacity.value,
    transform: [{ translateX: leftX + logoSize + 10 }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: currentX.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      currentX.value,
      [centerX, leftX],
      [content[currentIndex.value].bg, content[(currentIndex.value + 1) % content.length].bg],
      'RGB'
    ),
  }));

  // Animation cycle
  const runCycle = () => {
    // Move center → left
    currentX.value = withTiming(leftX, { duration: moveDuration }, () => {
      // Fade in text
      textOpacity.value = withTiming(1, { duration: fadeDuration }, () => {
        // Hold for showDuration
        setTimeout(() => {
          // Fade out
          textOpacity.value = withTiming(0, { duration: fadeDuration }, () => {
            // Move left → center
            currentX.value = withTiming(centerX, { duration: moveDuration }, () => {
              // Increment index
              currentIndex.value = (currentIndex.value + 1) % content.length;
              // Restart cycle
              runOnJS(runCycle)();
            });
          });
        }, showDuration);
      });
    });
  };

  useEffect(() => {
    runCycle();
  }, []);

  return (
    <Animated.View style={[styles.wrapper, backgroundStyle]}>
      <Animated.View style={styles.content}>
        <Animated.View style={[styles.logo, logoStyle]}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <ReText style={[styles.title, textStyle]} text={text} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logo: {
    width: 80,
    height: 80,
    position: 'absolute',
    zIndex: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    position: 'absolute',
    zIndex: 5,
  },
});

export default memo(AnimatedIntro);
