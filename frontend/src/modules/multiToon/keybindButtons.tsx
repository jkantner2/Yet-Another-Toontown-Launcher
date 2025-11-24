// import { Box, Button, Divider, Group, Stack, Text, Title } from "@mantine/core";
// import { useState } from "react";
// import { groups } from "./MultiToonTypes";
//
// const KeybindButtons: React.FC = () => {
//
//   type KeyBindings = {
//     [action: string]: string;
//   };
//   const [keyBindings, setKeyBindings] = useState<KeyBindings>(keyBindingsData);
//   const [listeningFor, setListeningFor] = useState<Action | null>(null);
//
//   const handleButtonClick = (action) => {
//     setListeningFor(action);
//   };
//
//   const handleKeyDown = (event) => {
//     if (!listeningFor) return;
//
//     event.preventDefault();
//     let key = '';
//
//     key += event.key.toLowerCase();
//
//     setKeyBindings((prev) => ({
//       ...prev,
//       [listeningFor]: key,
//     }));
//     setListeningFor(null);
//   };
//
//   return (
//     <Box
//       onKeyDown={handleKeyDown}
//       tabIndex={0}
//       style={{ padding: '20px' }}
//     >
//       <Title order={2} mb="md">
//         Key Bindings
//       </Title>
//       <Stack >
//         {Object.entries(groups).map(([groupName, actions]) => (
//           <Box key={groupName}>
//             <Text mb="sm" fw={500} size="lg">
//               {groupName}
//             </Text>
//             <Group wrap="wrap" justify="left">
//               {actions.map((action) => (
//                 <Button
//                   key={action}
//                   radius="md"
//                   justify="space-between"
//                   color={listeningFor === action ? 'blue' : 'gray'}
//                   variant={listeningFor === action ? 'filled' : 'outline'}
//                   onClick={() => handleButtonClick(action)}
//                   leftSection={<Text ta={"left"} tt="capitalize">{action}</Text>}
//                   w={250}
//                 >
//                   <Text fw={800}>{listeningFor === action ? 'Press any key...' : keyBindings[action]}</Text>
//                 </Button>
//               ))}
//             </Group>
//             <Divider my="md" />
//           </Box>
//         ))}
//       </Stack>
//     </Box>
//   );
// }
//
// export default KeybindButtons
