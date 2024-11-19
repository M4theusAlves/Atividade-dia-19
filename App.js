import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import axios from "axios";

export default function App() {
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [ClimaData, setClimaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "b9b7b46eec97d3507cc8d26faea633b2";

  const latRef = useRef(null);
  const longRef = useRef(null);

  const handleFetchWeather = async () => {
    if (!lat || !long) {
      Alert.alert("Erro", "Por favor, insira latitude e longitude válidas.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&lang=pt_br&appid=${API_KEY}`
      );
      setClimaData(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter os dados climáticos.");
    } finally {
      setLoading(false);
    }
  };

  const formattedClima = useMemo(() => {
    if (!ClimaData) return null;

    return {
      temperature: ClimaData.main.temp,
      humidity: ClimaData.main.humidity,
      description: ClimaData.weather[0].description,
    };
  }, [ClimaData]);

  const getBackgroundImage = () => {
    if (!formattedClima) return null;

    const temp = formattedClima.temperature;
    if (temp <= 10) {
      return require("./assets/ice.jpg"); 
    } else if (temp <= 20) {
      return require("./assets/sol.jpg"); 
    } else {
      return require("./assets/fogo.jpg"); 
    }
  };

  useEffect(() => {
    latRef.current?.focus();
  }, []);

  return (
    <ImageBackground
      source={getBackgroundImage()}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Qual Meu Clima?</Text>
        <TextInput
          ref={latRef}
          style={styles.input}
          placeholder="Latitude"
          keyboardType="numeric"
          value={lat}
          onChangeText={(text) => setLat(text)}
        />
        <TextInput
          ref={longRef}
          style={styles.input}
          placeholder="Longitude"
          keyboardType="numeric"
          value={long}
          onChangeText={(text) => setLong(text)}
        />
        <Button
          title={loading ? "Carregando..." : "Buscar Clima"}
          onPress={handleFetchWeather}
          disabled={loading}
        />
        {formattedClima && (
          <View style={styles.ClimaInfo}>
            <Text style={styles.infoText}>
              Temperatura: {formattedClima.temperature}°C
            </Text>
            <Text style={styles.infoText}>Umidade: {formattedClima.humidity}%</Text>
            <Text style={styles.infoText}>
              Descrição: {formattedClima.description}
            </Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  ClimaInfo: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "100%",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 5,
  },
});
