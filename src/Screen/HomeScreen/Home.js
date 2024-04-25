import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet ,Text,Touchable,TouchableOpacity,View } from "react-native";

const Home = ({navigation}) => {
    return(
        <View style={styles.container}>
            <LottieView style ={{marginTop:100,justifyContent:'flex-end',width:"100%",height:"40%"}}source={require('../../assets/Animations/image.json')} loop autoPlay />
            <Text style={styles.name}>Back Remove Pro</Text>
            <Text style={styles.name1}>Helped by remove.bg</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Remove")}>
                <Text>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black',
        alignItems:'center'
    },
    name:{
        color:'white',
        textAlign:'center',
        fontSize:40
    },
    name1:{
        color:'white',
        textAlign:'center',
        fontSize:20
    },
    button:{
        width:"80%",
        height:"6%",
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        marginTop:40
    }
})

export default Home;