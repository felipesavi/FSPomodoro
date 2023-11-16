import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Platform, Text, View, TouchableOpacity } from 'react-native';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import { Audio } from 'expo-av';

const colors = ["#EBB726","#84E3EB","#B2EA60"]

export default function App() {
  const [isWorking, setIsWorking] = useState(true);
  const [time, setTime] = useState(60 * 25);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (time === 0) {
      setIsActive(false);
      setIsWorking(!isWorking);
      setTime(isWorking ? 300 : 1500); 

      playTerminar();
    }

    return () => clearInterval(interval);
  }, [isActive, time]);
  

  function handleStartStop(){
    playSound();
    setIsActive(!isActive);
  }

  async function playSound(){
    const{ sound } = await Audio.Sound.createAsync(
      require("./assets/click.mp3")
    )
    await sound.playAsync();
  }
  async function playTerminar(){
    const{ sound } = await Audio.Sound.createAsync(
      require("./assets/terminar.mp3")
    )
    await sound.playAsync();
  }


  return (
    <View style={[styles.container, {backgroundColor: colors[currentTime] }]}>
      <View style={{flex:1, padding:15,}}>
        <Text style={styles.text}>Pomodoro</Text>
        <Header currentTime={currentTime} setCurrentTime={setCurrentTime} setTime={setTime} />
        <Timer time={time} />
        <TouchableOpacity onPress={handleStartStop} style={styles.button}>
          <Text style={{color:'white', fontWeight:'bold'}} >{isActive ? "STOP": "START"}</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  text:{
    fontSize:32,
    fontWeight:"bold",
    marginTop:40,
  },
  button:{
    alignItems:'center',
    backgroundColor:"#333333",
    padding:15,
    marginTop:15,
    borderRadius:15,
  }
});
