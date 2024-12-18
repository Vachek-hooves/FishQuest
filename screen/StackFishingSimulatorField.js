import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Text,
  ScrollView,
  Animated,
  SafeAreaView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {useContextProvider} from '../store/context';
import { useNavigation } from '@react-navigation/native';

const ANIMATION_DURATION = 500;
const MAX_FISH = 6;
const MIN_FISH = 3;
const GAME_DURATION = 40; // 40 seconds
const MIN_SCORE = 200;
const BASE_SPEED = 0.5;
const SPEED_INCREMENT = 0.2;

const StackFishingSimulatorField = ({route}) => {
  const navigation = useNavigation();
  const {season} = route.params;
  const {fishData, updateTotalScore, unlockedSeasons} = useContextProvider();
  const IMAGE = season.image;
  const [fishes, setFishes] = useState([]);
  const [caughtFish, setCaughtFish] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const animationRef = useRef();
  const seasonFishRef = useRef([]);
  const regenerationQueueRef = useRef([]);
  const fishIdCounterRef = useRef(0);
  const timerRef = useRef(null);
  const [orientationKey, setOrientationKey] = useState(0);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = useRef(screenWidth > screenHeight);

  const fishSpeed = BASE_SPEED + (unlockedSeasons - 1) * SPEED_INCREMENT;

  useEffect(() => {
    console.log('=== ORIENTATION CHANGE DEBUG ===');
    console.log('New screen dimensions:', { screenWidth, screenHeight });
    cancelAnimation();
    regenerationQueueRef.current.forEach(clearTimeout);
    regenerationQueueRef.current = [];
    fishIdCounterRef.current = 0;
    
    setFishes([]);
    
    setOrientationKey(prev => prev + 1);

    // Initialize season fish data first
    seasonFishRef.current = fishData.filter(fish =>
      season.fish.includes(fish.id.toString())
    );

    const generateFishesWithDelay = () => {
      console.log('Generating new fishes...');
      const newFishes = Array(MAX_FISH)
        .fill()
        .map(() => {
          const randomFish =
            seasonFishRef.current[
              Math.floor(Math.random() * seasonFishRef.current.length)
            ];
          
          if (!randomFish) {
            console.error('No fish data available');
            return null;
          }

          const safeWidth = screenWidth - (randomFish.width || 50);
          const safeBottomHalf = screenHeight / 3;
          const safeHeight = screenHeight - (randomFish.height || 50) - safeBottomHalf;

          const x = Math.min(Math.random() * safeWidth, safeWidth);
          const y = Math.min(safeBottomHalf + (Math.random() * safeHeight), screenHeight - (randomFish.height || 50));

          console.log('Generated fish position:', {
            fishId: randomFish.id,
            fishName: randomFish.name,
            x,
            y,
            screenWidth,
            screenHeight,
            safeWidth,
            safeBottomHalf,
            safeHeight,
            fishWidth: randomFish.width,
            fishHeight: randomFish.height
          });

          const newFish = {
            ...randomFish,
            uniqueId: getNextFishId(),
            x,
            y,
            dx: (Math.random() - 0.5) * fishSpeed,
            dy: (Math.random() - 0.5) * fishSpeed,
            opacity: new Animated.Value(1),
          };

          console.log('Final fish position and dimensions:', {
            fishId: newFish.id,
            fishName: newFish.name,
            finalX: newFish.x,
            finalY: newFish.y,
            width: newFish.width,
            height: newFish.height,
            speed: {
              dx: newFish.dx,
              dy: newFish.dy
            }
          });

          return newFish;
        })
        .filter(Boolean);

      console.log(`Successfully generated ${newFishes.length} fishes`);
      setFishes(newFishes);
      startAnimation();
    };

    setTimeout(generateFishesWithDelay, 100);

    return () => {
      cancelAnimation();
      regenerationQueueRef.current.forEach(clearTimeout);
    };
  }, [screenWidth, screenHeight]);

  useEffect(() => {
    isLandscape.current = screenWidth > screenHeight;
    console.log('Orientation updated:', {
      screenWidth,
      screenHeight,
      isLandscape: isLandscape.current
    });
  }, [screenWidth, screenHeight]);

  useEffect(() => {
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(GAME_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleGameOver = useCallback(() => {
    cancelAnimation();
    Alert.alert(
      'Game Over!',
      `Your score: ${score}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: false },
    );
  }, [score, navigation]);

  const calculateSafeBounds = useCallback((fishWidth, fishHeight) => {
    // Use current orientation value
    const actualWidth = isLandscape.current ? screenHeight : screenWidth;
    const actualHeight = isLandscape.current ? screenWidth : screenHeight;
    
    const safeWidth = actualWidth - (fishWidth || 50);
    const safeBottomHalf = actualHeight / 2;
    const safeHeight = actualHeight - (fishHeight || 50) - safeBottomHalf;

    console.log('Calculating safe bounds:', {
      isLandscape: isLandscape.current,
      originalDimensions: { screenWidth, screenHeight },
      adjustedDimensions: { width: actualWidth, height: actualHeight },
      safeBounds: { safeWidth, safeBottomHalf, safeHeight }
    });

    return {
      safeWidth,
      safeBottomHalf,
      safeHeight,
      actualWidth,
      actualHeight
    };
  }, [screenWidth, screenHeight]);

  const getNextFishId = useCallback(() => {
    fishIdCounterRef.current += 1;
    return `fish_${fishIdCounterRef.current}`;
  }, []);

  const createFish = useCallback(
    baseFish => {
      const safeWidth = screenWidth - baseFish.width;
      const safeBottomHalf = screenHeight / 2;
      const safeHeight = screenHeight - baseFish.height - safeBottomHalf;

      return {
        ...baseFish,
        uniqueId: getNextFishId(),
        x: Math.min(Math.random() * safeWidth, safeWidth),
        y: Math.min(safeBottomHalf + (Math.random() * safeHeight), screenHeight - baseFish.height),
        dx: (Math.random() - 0.5) * fishSpeed,
        dy: (Math.random() - 0.5) * fishSpeed,
        opacity: new Animated.Value(0),
      };
    },
    [getNextFishId, fishSpeed, screenWidth, screenHeight],
  );

  const generateFishes = useCallback(() => {
    seasonFishRef.current = fishData.filter(fish =>
      season.fish.includes(fish.id.toString()),
    );

    const newFishes = Array(MAX_FISH)
      .fill()
      .map(() => {
        const randomFish =
          seasonFishRef.current[
            Math.floor(Math.random() * seasonFishRef.current.length)
          ];
        return createFish(randomFish);
      });

    setFishes(newFishes);
    newFishes.forEach(fish => {
      Animated.timing(fish.opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    });
    startAnimation();
  }, [season, createFish]);

  const startAnimation = useCallback(() => {
    const animate = () => {
      setFishes(prevFishes =>
        prevFishes.map(fish => {
          let newX = fish.x + fish.dx;
          let newY = fish.y + fish.dy;

          // Bounce off the edges using current dimensions
          if (newX <= 0 || newX >= screenWidth - fish.width) {
            fish.dx *= -1;
            newX = fish.x + fish.dx;
          }
          if (newY <= screenHeight / 2 || newY >= screenHeight - fish.height) {
            fish.dy *= -1;
            newY = fish.y + fish.dy;
          }

          return {...fish, x: newX, y: newY};
        }),
      );
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  }, [screenWidth, screenHeight]);

  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const respawnFish = useCallback(() => {
    console.log('=== RESPAWN FISH DEBUG ===');
    console.log('Current screen dimensions:', { 
      screenWidth, 
      screenHeight, 
      isLandscape: isLandscape.current,
      actualWidth: isLandscape.current ? screenHeight : screenWidth,
      actualHeight: isLandscape.current ? screenWidth : screenHeight
    });
    
    setFishes(prevFishes => {
      if (prevFishes.length >= MAX_FISH) {
        console.log('Max fish limit reached, no respawn needed');
        return prevFishes;
      }

      const numToAdd = Math.min(MAX_FISH - prevFishes.length, seasonFishRef.current.length);
      console.log(`Attempting to respawn ${numToAdd} fish`);

      const newFishes = Array(numToAdd)
        .fill()
        .map(() => {
          const randomFish = seasonFishRef.current[
            Math.floor(Math.random() * seasonFishRef.current.length)
          ];
          
          if (!randomFish) {
            console.error('No fish data available for respawn');
            return null;
          }

          let x, y;
          
          if (isLandscape.current) {
            // In landscape mode:
            const safeWidth = screenHeight - (randomFish.width || 50); // Use full height as width
            const safeBottomHalf = screenWidth / 2; // Use width as height
            const safeHeight = screenWidth - (randomFish.height || 50) - safeBottomHalf;

            // Calculate positions for landscape
            x = Math.min(Math.random() * safeWidth, safeWidth);
            y = safeBottomHalf + Math.min(Math.random() * safeHeight, safeHeight);

            console.log('Landscape position calculation:', {
              safeWidth,
              safeBottomHalf,
              safeHeight,
              calculatedX: x,
              calculatedY: y
            });
          } else {
            // Portrait mode - original calculation
            const safeWidth = screenWidth - (randomFish.width || 50);
            const safeBottomHalf = screenHeight / 2;
            const safeHeight = screenHeight - (randomFish.height || 50) - safeBottomHalf;

            x = Math.min(Math.random() * safeWidth, safeWidth);
            y = safeBottomHalf + Math.min(Math.random() * safeHeight, safeHeight);
          }

          console.log('New fish being generated:', {
            fishId: randomFish.id,
            fishName: randomFish.name,
            initialPosition: { x, y },
            orientation: {
              isLandscape: isLandscape.current,
              screenWidth,
              screenHeight
            },
            fishDimensions: {
              width: randomFish.width,
              height: randomFish.height
            }
          });

          const newFish = {
            ...randomFish,
            uniqueId: getNextFishId(),
            x,
            y,
            dx: (Math.random() - 0.5) * fishSpeed,
            dy: (Math.random() - 0.5) * fishSpeed,
            opacity: new Animated.Value(1),
          };

          console.log('Final fish position:', {
            fishId: newFish.id,
            fishName: newFish.name,
            finalPosition: {
              x: newFish.x,
              y: newFish.y
            },
            dimensions: {
              width: newFish.width,
              height: newFish.height
            },
            orientation: {
              isLandscape: isLandscape.current
            }
          });

          return newFish;
        })
        .filter(Boolean);

      console.log(`Successfully generated ${newFishes.length} new fish`);
      return [...prevFishes, ...newFishes];
    });
  }, [screenWidth, screenHeight, fishSpeed]);

  const queueFishRegeneration = useCallback(() => {
    const timerId = setTimeout(() => {
      respawnFish();
      regenerationQueueRef.current = regenerationQueueRef.current.filter(
        id => id !== timerId,
      );
    }, 4000);
    regenerationQueueRef.current.push(timerId);
  }, [respawnFish]);

  const catchFish = useCallback(
    index => {
      setFishes(prevFishes => {
        if (index >= prevFishes.length) {
          console.log('Fish no longer exists');
          return prevFishes;
        }

        const caughtFish = prevFishes[index];
        const originalFish = fishData.find(f => f.id === caughtFish.id);

        if (!originalFish) {
          console.log('Original fish data not found');
          return prevFishes;
        }

        console.log(`Caught fish: ${originalFish.name}`);

        setCaughtFish(prev => [...prev, originalFish]);

        // Update local score
        setScore(prevScore => {
          let scoreIncrement = 0;
          if (season.task === 'predator') {
            scoreIncrement = originalFish.type === 'predator' ? 20 : -10;
          } else if (season.task === 'prey') {
            scoreIncrement = originalFish.type === 'prey' ? 20 : -10;
          }
          return Math.max(prevScore + scoreIncrement, 0);
        });

        Animated.timing(caughtFish.opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();

        const updatedFishes = prevFishes.filter((_, i) => i !== index);

        if (updatedFishes.length < MIN_FISH) {
          respawnFish();
        }

        queueFishRegeneration();

        return updatedFishes;
      });
    },
    [fishData, season.task],
  );

  const CaughtFishDisplay = useMemo(() => {
    const groupedFish = caughtFish.reduce((acc, fish) => {
      if (!acc[fish.id]) {
        acc[fish.id] = {...fish, count: 0};
      }
      acc[fish.id].count += 1;
      return acc;
    }, {});

    return () => (
      <View style={styles.caughtFishContainer}>
        <SafeAreaView>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.taskText}>Task: Catch {season.task}</Text>
          <Text style={styles.timerText}>Time left: {timeLeft}s</Text>
        </SafeAreaView>
        <Text style={styles.caughtFishTitle}>Caught Fish:</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.imageCell]}>Fish</Text>
          <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
          <Text style={[styles.headerCell, styles.countCell]}>Count</Text>
        </View>
        <ScrollView style={styles.tableBody}>
          {Object.values(groupedFish).map(fish => (
            <View key={fish.id} style={styles.tableRow}>
              <View style={styles.imageCell}>
                <Image source={fish.image} style={styles.caughtFishImage} />
              </View>
              <Text style={styles.nameCell}>{fish.name}</Text>
              <Text style={styles.countCell}>{fish.count}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }, [caughtFish, score, season.task, timeLeft]);

  return (
    <View style={styles.container} key={orientationKey}>
      <ImageBackground source={IMAGE} style={styles.lake}>
        <CaughtFishDisplay />
        {fishes.map((fish, index) => (
          <Animated.View
            key={fish.uniqueId}
            style={[
              styles.fish,
              {
                left: fish.x,
                top: fish.y,
                opacity: fish.opacity,
              },
            ]}>
            <TouchableOpacity onPress={() => catchFish(index)}>
              <Image
                source={fish.image}
                style={{width: fish.width, height: fish.height}}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lake: {
    flex: 1,
    backgroundColor: '#87CEEB',
    position: 'relative',
  },
  fish: {
    position: 'absolute',
  },
  caughtFishContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    maxHeight: '40%', // Adjust this value as needed
  },
  caughtFishTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  tableBody: {
    flexGrow: 0,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageCell: {
    width: '25%',
    alignItems: 'center',
  },
  nameCell: {
    width: '50%',
  },
  countCell: {
    width: '25%',
    textAlign: 'center',
  },
  caughtFishImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskText: {
    fontSize: 18,
    marginBottom: 5,
    color: 'green',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'red',
  },
});

export default StackFishingSimulatorField;