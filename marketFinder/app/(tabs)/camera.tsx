import CameraCapture from "@/src/components/features/camera-capture";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function CameraScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CameraCapture />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
