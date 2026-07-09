import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../lib/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const TILE = 46; // размер плитки-ромба
const COLS = Math.ceil(SCREEN_W / TILE) + 2;
const ROWS = Math.ceil(SCREEN_H / TILE) + 2;

const TILE_COLORS = [
  colors.accentPrimary,
  colors.accentSecondary,
  '#22D3EE',
  '#2E3A6B',
];

function Tile({
  row,
  col,
  progress,
}: {
  row: number;
  col: number;
  progress: Animated.SharedValue<number>;
}) {
  // фаза волны зависит от позиции плитки — получается диагональная "бегущая" волна
  const phase = (row + col) * 0.35;
  const color = TILE_COLORS[(row + col) % TILE_COLORS.length];

  const style = useAnimatedStyle(() => {
    const wave = Math.sin(progress.value * Math.PI * 2 + phase);
    const bulge = Math.cos(progress.value * Math.PI * 2 + phase * 0.6);
    return {
      transform: [
        { translateY: wave * 6 }, // "ходит волной"
        { scale: 1 + bulge * 0.12 }, // "бугром"
        { rotate: '45deg' },
      ],
      opacity: 0.06 + (wave + 1) / 2 * 0.1, // переливается
    };
  });

  return (
    <Animated.View
      style={[
        styles.tile,
        style,
        {
          left: col * TILE - TILE / 2,
          top: row * TILE - TILE / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

export default function MosaicBackground() {
  const progress = useSharedValue(0);
  const glare = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      false
    );
    glare.value = withRepeat(
      withTiming(1, { duration: 5200, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const tiles = useMemo(() => {
    const arr: { row: number; col: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        arr.push({ row: r, col: c });
      }
    }
    return arr;
  }, []);

  const glareStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -SCREEN_W + glare.value * SCREEN_W * 2.4 },
      { rotate: '20deg' },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      {tiles.map((t) => (
        <Tile key={`${t.row}-${t.col}`} row={t.row} col={t.col} progress={progress} />
      ))}
      {/* бегущий блик поверх мозаики */}
      <Animated.View style={[styles.glareWrap, glareStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(122,92,255,0.10)', 'rgba(255,255,255,0.06)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glare}
        />
      </Animated.View>
      {/* лёгкое затемнение по краям, чтобы контент читался поверх */}
      <LinearGradient
        colors={['rgba(9,11,24,0.55)', 'rgba(9,11,24,0.85)']}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: TILE * 0.62,
    height: TILE * 0.62,
    borderRadius: 6,
  },
  glareWrap: {
    position: 'absolute',
    top: -SCREEN_H * 0.3,
    width: SCREEN_W * 0.5,
    height: SCREEN_H * 1.6,
  },
  glare: {
    flex: 1,
  },
});
