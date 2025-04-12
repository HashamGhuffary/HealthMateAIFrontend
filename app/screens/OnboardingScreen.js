import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/global';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onboardingData = [
    {
      id: '1',
      title: 'Welcome to HealthMate',
      description: 'Your personal AI health assistant to keep track of your health and wellness journey.',
      image: require('../../assets/onboarding-1.png'),
    },
    {
      id: '2',
      title: 'Smart Symptom Checker',
      description: 'Check your symptoms and get preliminary diagnoses with our AI-powered symptom checker.',
      image: require('../../assets/onboarding-2.png'),
    },
    {
      id: '3',
      title: 'Connect with Doctors',
      description: 'Find and book appointments with qualified healthcare professionals in your area.',
      image: require('../../assets/onboarding-3.png'),
    },
    {
      id: '4',
      title: 'Track Your Health',
      description: 'Set health goals, track medications, and monitor your progress all in one place.',
      image: require('../../assets/onboarding-4.png'),
    },
  ];

  const goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Navigate to login screen if on last slide
      navigation.navigate('Login');
    }
  };

  const goToPrevSlide = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const skip = () => {
    navigation.navigate('Login');
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image 
            source={item.image} 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? COLORS.primary : COLORS.border },
            ]}
          />
        ))}
      </View>
    );
  };

  const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {currentIndex > 0 ? (
          <TouchableOpacity style={styles.backButton} onPress={goToPrevSlide}>
            <Feather name="arrow-left" size={24} color={COLORS.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderButton} />
        )}
        <TouchableOpacity style={styles.skipButton} onPress={skip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.footer}>
        {renderDots()}
        <TouchableOpacity style={styles.nextButton} onPress={goToNextSlide}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Feather
            name={currentIndex === onboardingData.length - 1 ? 'check' : 'arrow-right'}
            size={20}
            color={COLORS.card}
            style={styles.nextIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl * 2,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
  skipButton: {
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: '500',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: SPACING.xl,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  nextIcon: {
    marginLeft: SPACING.xs,
  },
});

export default OnboardingScreen; 