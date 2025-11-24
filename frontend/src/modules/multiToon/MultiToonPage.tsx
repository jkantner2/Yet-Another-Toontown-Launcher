import { useState } from "react"
// import { Mt_init, Mt_select_window, Mt_send_key, Mt_set_key_up, Mt_set_key_down } from "../../../bindings/YATL/services/multiservice"
import { Box, Button } from "@mantine/core";
import MultiToonSessionHolder from "./MultiToonSessionHolder";
import { MTSession } from "./MultiToonTypes";
// import { keyMap } from "./MultiToonTypes";

const MultiToonPage: React.FC = () => {
  const [_MTSessions, _setMTSessions] = useState<Array<MTSession>>([]);


  //
  // const keyToPanda3DBind = (key: string) => {
  //   key = key.trim()
  //   if (/^[a-zA-Z0-9]$/.test(key)) {
  //     return key;
  //   }
  //
  //   if (key in keyMap) {
  //     return keyMap[key];
  //   }
  //
  //   return "invalid_key";
  // }

  return (
    <>
      <Box h={20}/>
      <Button>New Profile</Button>
      <MultiToonSessionHolder/>
    </>
  )
}

export default MultiToonPage
