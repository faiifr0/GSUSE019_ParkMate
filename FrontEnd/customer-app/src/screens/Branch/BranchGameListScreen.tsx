// // src/screens/Branch/BranchGameListScreen.tsx
// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
// import { RouteProp } from "@react-navigation/native";
// import { RootStackParamList } from "../../navigation/types";
// import { BranchGame } from "../../types/game";
// import styles from "../../styles/BranchGameListScreenStyles";

// type BranchGameListRouteProp = RouteProp<RootStackParamList, "BranchGameList">;

// type Props = {
//   route: BranchGameListRouteProp;
//   navigation: any;
// };

// const BranchGameListScreen: React.FC<Props> = ({ route, navigation }) => {
//   const { branchId } = route.params;
//   const [games, setGames] = useState<BranchGame[]>([]);

//   useEffect(() => {
//     // TODO: gọi API lấy danh sách game theo branchId
//     // giả lập dữ liệu:
//     setGames([
//       {
//         id: 1,
//         name: "Bắn cung",
//         image: "https://example.com/game1.jpg",
//         description: "Trò chơi rèn luyện sự tập trung",
//         price: 50000,
//       },
//       {
//         id: 2,
//         name: "Leo núi",
//         image: "https://example.com/game2.jpg",
//         description: "Trò chơi vận động hấp dẫn",
//       },
//     ]);
//   }, [branchId]);

//   const navigateToGameDetail = (game: BranchGame) => {
//     navigation.navigate("GameDetail", { game });
//   };

//   return (
//     <FlatList
//       data={games}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={({ item }) => (
//         <TouchableOpacity
//           style={styles.card}
//           onPress={() => navigateToGameDetail(item)}
//         >
//           <Image source={{ uri: item.image }} style={styles.image} />
//           <View style={styles.info}>
//             <Text style={styles.name}>{item.name}</Text>
//             {item.description && (
//               <Text style={styles.description}>{item.description}</Text>
//             )}
//           </View>
//         </TouchableOpacity>
//       )}
//     />
//   );
// };

// export default BranchGameListScreen;
