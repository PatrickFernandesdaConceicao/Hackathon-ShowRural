import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import PdfUploader from "../components/PdfUploader";
import Formulario from "../components/Formulario";

export default function HomeScreen() {
  const [extractedText, setExtractedText] = useState<string>("");

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <PdfUploader onExtractedText={setExtractedText} />
      <Formulario extractedText={extractedText} />
    </ScrollView>
  );
}
