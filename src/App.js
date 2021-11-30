import * as React from "react";
import { Button, Text, Box, Divider, Input } from "@chakra-ui/react";
import "./App.css";
import { useWave } from "./hooks/useWave";

export default function App() {
  const {
    connectWallet,
    currentAccount,
    totalWaves,
    sendWave,
    allWaves,
    setWaveText,
    loading
  } = useWave();

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey {currentAccount ? currentAccount : "there"}!
        </div>

        <div className="bio">
          I am Rai Siqueira and I worked on this application, send me a wave 👋.
          Connect your Ethereum wallet (change the network to Rinkeby testnet)
          and wave at me!
        </div>

        <Box my={4}>
          <Text fontSize="xl">
            <Text as="strong">We have:</Text> {totalWaves ?? "--"} waves 🎉
          </Text>
        </Box>
        <Divider w="100%" mb={4} />
        <Input
          placeholder="Send a wave to me 👋"
          mb={4}
          onChange={(e) => setWaveText(e.target.value)}
        />
        <Button colorScheme="blue" onClick={sendWave}>
          Wave at Me
        </Button>

        {!currentAccount ? (
          <Button
            colorScheme="blue"
            onClick={connectWallet}
            isLoading={loading}
            loadingText="Sending..."
          >
            Connect Wallet
          </Button>
        ) : null}
        <Text fontSize="xl" mt={4}>
          Wavers!
        </Text>
        {allWaves
          .sort((a, b) => a.timestamp.toString() - b.timestamp.toString())
          .map((wave, index) => {
            return (
              <Box
                key={index}
                style={{
                  backgroundColor: "OldLace",
                  marginTop: "16px",
                  padding: "8px"
                }}
                mb={4}
              >
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </Box>
            );
          })}
      </div>
    </div>
  );
}
