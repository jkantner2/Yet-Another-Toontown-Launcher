import { useState } from "react"
import { Mt_init, Mt_select_window, Mt_send_key, Mt_set_key_up, Mt_set_key_down } from "../../../bindings/YATL/services/mutliservice"
import { Button } from "@mantine/core";

const MultiToonPage: React.FC = () => {
  const [MTsessions, setMTSessions] = useState<Array<number>>([]);
  const [MTWindow, setMTWindow] = useState<number>(0);

  const startMTSession = async () => {
    let id = await Mt_init()
    setMTSessions((prev) => [...prev, id])
  }

  const setKeyUp = async () => {
    await Mt_set_key_up(MTsessions[0], MTWindow, "a")
  }

  const setKeyDown = async () => {
    await Mt_set_key_down(MTsessions[0], MTWindow, "a")
  }

  const MTJump = async () => {
    await Mt_send_key(MTsessions[0], MTWindow, "b")
  }

  const getMTWindow = async () => {
    let newWindow = await Mt_select_window(MTsessions[0])

    setMTWindow(newWindow)
  }

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
      <div>{`multitoon sessions: ${MTsessions}`}</div>
      <div>{`selected window: ${MTWindow}`}</div>

      <Button onClick={startMTSession} > New MT Session </Button>
      <Button onClick={getMTWindow}> get window </Button>
      <Button onClick={MTJump}> jump </Button>
      <Button onClick={setKeyDown}> set 'a' down</Button>
      <Button onClick={setKeyUp} > set 'a' up </Button>
    </>
  )
}

export default MultiToonPage
