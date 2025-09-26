import React, {useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomeScreen() {
    
    //pega os dados do usuário armazenados
    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem("userData");
            if (userData) {
                return JSON.parse(userData);
            }
            return null;
        }
        catch (error) {
            console.error("Erro ao obter dados do usuário:", error);
            return null;
        }
    };

    useEffect(() => {
        getUserData().then(user => {
            if (user) {
                console.log("Dados do usuário:", user);
            } else {
                console.log("Nenhum dado de usuário encontrado.");
            }
        });
    }, []);


    const actions = [
        {
            text: "Perfil",
            icon: require("../assets/perfil.png"),
            name: "bt_perfil",
            position: 1
        },
        {
            text: "Fórum",
            icon: require("../assets/forum.png"),
            name: "bt_forum",
            position: 2
        },
        {
            text: "Eventos",
            icon: require("../assets/evento.png"),
            name: "bt_eventos",
            position: 3
        }
    ];

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Bem-vindo à Tela Inicial!</Text>
                <FloatingAction
                    actions={actions}
                    onPressItem={(name) => {
                    console.log(`Botão ${name} clicado`);
                    // aqui você pode usar navigation.navigate("Perfil"), por exemplo
                    }}
                />
            </View>
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});