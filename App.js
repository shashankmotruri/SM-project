import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, RefreshControl, SafeAreaView, ScrollView , View} from 'react-native';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [fan,setFan] = useState(false);
  const [light,setLight] = useState(false);
  const [lastValue,setLastValue] = useState("NULL");
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = () => {
    fetch('https://io.adafruit.com/api/v2/Smproject/feeds/on-and-off',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': 'aio_ubUH43jwrpgn5zBKWuRbxugLpvcE'
      },
    })
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    fetchData();
    if(data != null && data != undefined) {
      let response = JSON.stringify(data.last_value);
      if(response != null && response != undefined){
          setLastValue(data.last_value.toUpperCase());
          if(response.split(" ")[1] === "One"){
            setFan(false);
          }
          else{
            setFan(true);
          }
          if(response.split(" ")[4] === "one"){
            setLight(false);
          }
          else{
            setLight(true);
          }
      }
    }
  });

    const wait = (timeout) => {
      return new Promise(resolve => setTimeout(resolve, timeout));
    }
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
   
      <View style={{backgroundColor: "dodgerblue",flex: 1,borderBottomLeftRadius:50,borderBottomRightRadius:50}}>
        <Text style={[styles.header,styles.title]}>SM Project</Text>  
        <Text style={styles.header}>{lastValue}</Text>  
      </View>
      <View style={{backgroundColor: "white",flex: 2, flexDirection:'row',flexGrow : 1,margin : 5,justifyContent: 'space-evenly'}} >
        { fan ? <View style={styles.square} ><Text style={styles.squareLabel} >Fan 1</Text></View> : <View style={[styles.square ,styles.activesquare]} ><Text style={[styles.squareLabel,styles.activeLabel]}>Fan 1</Text></View>}
        { fan ? <View style={[styles.square,styles.activesquare]}><Text style={[styles.squareLabel,styles.activeLabel]} >Fan 2</Text></View> : <View style={styles.square}><Text style={styles.squareLabel} >Fan 2</Text></View>}
      </View>
      <View style={{backgroundColor: "white",flex: 2, flexDirection:'row',flexGrow : 1,margin : 5,justifyContent: 'space-evenly'}} >
        { light ? <View style={styles.square} ><Text style={styles.squareLabel}>Light 1</Text></View> : <View style={[styles.square ,styles.activesquare]} ><Text style={[styles.squareLabel,styles.activeLabel]}>Light 1</Text></View>}
        { light ? <View style={[styles.square,styles.activesquare]}><Text style={[styles.squareLabel,styles.activeLabel]} >Light 2</Text></View> : <View style={styles.square}><Text style={styles.squareLabel} >Light 2</Text></View>}
      </View>
      {/* <Text>{data.last_value}</Text> */}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7CA1B4",
    flex: 1,
    flexDirection:'row',
    flexWrap: "wrap",

  },
  scrollView: {
    flex: 1,
  },
  header: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 22,
    color: "white",
    marginTop:20,
  },
  title : {
    marginTop:50,
    color: "red",
  },
  square: {
    borderColor: "#000000",
    borderWidth: 2,
    width: 150,
    borderRadius:20,
    height: 150,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activesquare: {
    backgroundColor: "green",
  },
  squareLabel: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeLabel: {
    color : "white"
  }
});