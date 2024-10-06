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
} from 'react-native';
import {useContextProvider} from '../store/context';
import { useNavigation } from '@react-navigation/native';

const ANIMATION_DURATION = 500;
const MAX_FISH = 6;
const MIN_FISH = 3;
const GAME_DURATION = 40; // 40 seconds
const MIN_SCORE = 200;

const StackFishingSimulatorField = ({route}) => {
  const navigation = useNavigation();
  const {season} = route.params;
  const {fishData, updateTotalScore} = useContextProvider();
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

  useEffect(() => {
    generateFishes();
    startTimer();
    return () => {
      cancelAnimation();
      regenerationQueueRef.current.forEach(clearTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setScore((currentScore) => {
            endGame(currentScore);
            return currentScore;
          });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const endGame = (currentScore) => {
    console.log(currentScore);
    if (currentScore >= MIN_SCORE) {
      Alert.alert(
        "Game Over",
        `Congratulations! You scored ${currentScore} points.`,
        [
          {
            text: "OK",
            onPress: () => {
              updateTotalScore(currentScore);
              navigation.navigate('TabFishingIntroScreen');
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Game Over",
        `You didn't reach the minimum score of ${MIN_SCORE}. Try again!`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('TabFishingIntroScreen')
          }
        ]
      );
    }
  };

  const getNextFishId = useCallback(() => {
    fishIdCounterRef.current += 1;
    return `fish_${fishIdCounterRef.current}`;
  }, []);

  const createFish = useCallback(
    baseFish => {
      return {
        ...baseFish,
        uniqueId: getNextFishId(),
        x: Math.random() * (Dimensions.get('window').width - baseFish.width),
        y:
          Math.random() *
            (Dimensions.get('window').height / 2 - baseFish.height) +
          Dimensions.get('window').height / 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: new Animated.Value(0),
      };
    },
    [getNextFishId],
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

          // Bounce off the edges
          if (
            newX <= 0 ||
            newX >= Dimensions.get('window').width - fish.width
          ) {
            fish.dx *= -1;
            newX = fish.x + fish.dx;
          }
          if (
            newY <= Dimensions.get('window').height / 2 ||
            newY >= Dimensions.get('window').height - fish.height
          ) {
            fish.dy *= -1;
            newY = fish.y + fish.dy;
          }

          return {...fish, x: newX, y: newY};
        }),
      );
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const respawnFish = useCallback(() => {
    setFishes(prevFishes => {
      if (prevFishes.length >= MAX_FISH) return prevFishes;

      const numToAdd = Math.min(
        MAX_FISH - prevFishes.length,
        seasonFishRef.current.length,
      );
      const newFishes = Array(numToAdd)
        .fill()
        .map(() => {
          const randomFish =
            seasonFishRef.current[
              Math.floor(Math.random() * seasonFishRef.current.length)
            ];
          return createFish(randomFish);
        });

      newFishes.forEach(fish => {
        Animated.timing(fish.opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
      });

      return [...prevFishes, ...newFishes];
    });
  }, [createFish]);

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
    <View style={styles.container}>
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