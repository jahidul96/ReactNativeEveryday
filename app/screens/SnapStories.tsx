import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {peopleData} from '../data/peopleData';
import {useNavigation} from '@react-navigation/native';
import {HEIGHT, WIDTH} from '../utils/appDimension';

const SnapStories = () => {
  const navigation = useNavigation<any>();
  return (
    <ScrollView>
      <View style={styles.headerWrapper}>
        <Text style={styles.titleText}>StorieSeenDetailsAnim</Text>
      </View>

      {/* vertical stories */}

      <View style={styles.verticalStoryWrapper}>
        {peopleData.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.verticalstoryItemStyle}
            onPress={() =>
              navigation.navigate('StoryDetails', {uri: item.img, id: item.id})
            }>
            <Animated.View
              style={{flex: 1}}
              sharedTransitionTag={item.id.toString()}>
              <Animated.Image
                source={{uri: item.img}}
                sharedTransitionTag={item.id.toString() + '1'}
                style={styles.verticalimageStyle}
                resizeMode="cover"
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default SnapStories;

export const StoryDetails = ({route, navigation}: any) => {
  const {uri, id} = route.params;
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scaleVal = useSharedValue(1);
  const isDragStart = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      x.value = event.translationX * 0.8;
      y.value = event.translationY * 0.8;
      scaleVal.value = 0.8;
      isDragStart.value = true;
    })
    .onEnd(() => {
      if (y.value > 300) {
        opacity.value = withTiming(0);
        runOnJS(navigation.goBack)();
      }
      x.value = withTiming(0);
      y.value = withTiming(0);
      scaleVal.value = withTiming(1);
      isDragStart.value = false;
    });

  const animStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      opacity.value,
      [0, 1],
      ['transparent', 'white'],
    );
    return {
      transform: [
        {translateX: x.value},
        {translateY: y.value},
        {scale: scaleVal.value},
      ],
      // backgroundColor,
      borderRadius: isDragStart.value ? 20 : 0,
      overflow: 'hidden',
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[styles.container, animStyle]}
        sharedTransitionTag={id.toString()}>
        <Animated.Image
          source={{uri}}
          style={[
            {
              width: WIDTH,
              height: HEIGHT,
            },
          ]}
          sharedTransitionTag={id.toString() + '1'}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    width: WIDTH,
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 20,
    color: 'white',
  },

  storyItemStyle: {
    width: 70,
    height: 70,
    alignItems: 'center',
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'red',
    marginRight: 10,
  },

  verticalStoryWrapper: {
    width: WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  verticalstoryItemStyle: {
    width: '47%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  verticalimageStyle: {
    flex: 1,
  },
});
