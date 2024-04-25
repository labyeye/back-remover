import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./src/Screen/HomeScreen/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Remove from "./src/Screen/RemovalScreen/RemoveScreen";

const Stack = createNativeStackNavigator();
const App = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Remove" component={Remove}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;