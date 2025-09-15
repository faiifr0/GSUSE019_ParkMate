import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Text, ActivityIndicator, Card, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../styles/GamesScreenStyles";
import { Game } from "../../types/Game";
import { getGames } from "../../services/gameService";

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await getGames({ page, size: 10 });
      setGames(data.content);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [page]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={`Branch ID: ${item.branchId}`} />
              <Card.Content>
                <Text>{item.description}</Text>
                <Text>Location: {item.location}</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}

      {/* Pagination */}
      <View style={styles.pagination}>
        <Button disabled={page <= 0} onPress={() => setPage((prev) => prev - 1)}>
          Previous
        </Button>
        <Text style={styles.pageText}>{page + 1} / {totalPages}</Text>
        <Button disabled={page >= totalPages - 1} onPress={() => setPage((prev) => prev + 1)}>
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
}
