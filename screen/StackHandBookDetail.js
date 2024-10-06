import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { MainLayout } from "../components/Layout";

const StackHandBookDetail = () => {
  const route = useRoute();
  const { item } = route.params;

  const renderSubsection = (subsection, index) => (
    <View key={index} style={styles.subsection}>
      <Text style={styles.subsectionTitle}>{subsection.title}</Text>
      <Text style={styles.subsectionContent}>{subsection.content}</Text>
    </View>
  );

  const renderSection = (section, index) => (
    <View key={index} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionContent}>{section.content}</Text>
      {section.subsections && section.subsections.map(renderSubsection)}
    </View>
  );

  return (
    <MainLayout blur={40}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.image} />
          {item.sections.map(renderSection)}
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark, slightly transparent background
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 16,
  },
  subsection: {
    marginLeft: 16,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subsectionContent: {
    fontSize: 16,
    color: "#e0e0e0",
  },
});

export default StackHandBookDetail;
