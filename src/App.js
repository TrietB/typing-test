import React, { useState, useEffect } from "react";
import randomWords from "random-words";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Input,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const NUMB_OF_WORDS = 200;
const SECONDS = 20;

function App() {
  const [paragraph, setParagraph] = useState([]);
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [cuurInput, setCurrInput] = useState("");
  const [currWordIdx, setCurrWordIdx] = useState(0);
  const [currCharIdx, setCurrCharIdx] = useState(-1)
  const [currChar, setCurrChar] = useState('')
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setWords(generateWords());
  }, []);

  const generateWords = () => {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords());
  };
  const start = () => {
    if (status == "finished") {
      setWords(generateWords());
      setCurrWordIdx(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIdx(-1)
      setCurrChar('')
    }
    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0) {
            clearInterval(interval);
            setCountDown(SECONDS);
            setStatus("finished");
            setCurrInput("");
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
  };

  const handleKeyDown = ({ keyCode, key }) => {
    // console.log(e.key);
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIdx(currWordIdx + 1);
      setCurrCharIdx(-1)
    } else if (keyCode === 8) {
      setCurrCharIdx(currCharIdx - 1)
      setCurrChar('')
    } 
    else{
      setCurrCharIdx(currCharIdx + 1)
      setCurrChar(key)
    }
  };

  const checkMatch = () => {
    const wordToCompare = words[currWordIdx];
    const isMatch = wordToCompare === cuurInput.trim();
    if (isMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  };

  const changeBGColor = (wordIdx, charIdx, char) => {
    if(wordIdx === currWordIdx && charIdx === currCharIdx && currChar && status!=='finished'){
      if(char === currChar){
        return {backgroundColor: 'green'}
      } else {
        return {backgroundColor: 'red'}
      } 
    } else if( wordIdx === currWordIdx && currCharIdx >= words[currWordIdx].length) {
      return {backgroundColor: 'red'}
    }
     else {
      return {}
    }
  }

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ width: "80%" }}>
        <Typography>{countDown}</Typography>
        <Input
          disabled={status !== "started"}
          fullWidth
          sx={{ mr: 5 }}
          onKeyDown={handleKeyDown}
          value={cuurInput}
          onChange={(e) => setCurrInput(e.target.value)}
        ></Input>
        <Button variant="contained" onClick={start}>
          Start
        </Button>
        <IconButton>
          <RefreshIcon />
        </IconButton>
      </Box>
      {status === "started" && (
        <Card sx={{ maxWidth: 1000 }}>
          <CardContent>
            <Typography paragraph={true}>
              {words.map((word, i) => (
                <span key={i}>
                  {word.split("").map((char, idx) => (
                    <span style={changeBGColor(i , idx, char)} key={idx}>{char}</span>
                  ))}{" "}
                </span>
              ))}
            </Typography>
          </CardContent>
        </Card>
      )}
      {status === "finished" && (
        <Box>
          <Typography>{`Words per minute: ${correct}`}</Typography>
          <Typography>{`Accuracy: ${Math.round(
            (correct / (correct + incorrect)) * 100
          )}%`}</Typography>
        </Box>
      )}
    </Container>
  );
}

export default App;
