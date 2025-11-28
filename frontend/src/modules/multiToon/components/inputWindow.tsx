import React from "react";
import { MTSession } from "../logic/MultiToonTypes";
import { setKeyDown, setKeyUp } from "../logic/multiUtils";

type InputWindowProps = {
  yatlSessions: MTSession[]
}

const InputWindow: React.FC<InputWindowProps> = ({ yatlSessions }: InputWindowProps) => {
  onkeydown = async (event) => {
    yatlSessions.map((session) => {
      setKeyDown(event.key, session)
    })
  }

  onkeyup = async (event) => {
    yatlSessions.map((session) => {
      setKeyUp(event.key, session)
    })
  }

  return (
    <>
    </>
  )
}

export default InputWindow;
