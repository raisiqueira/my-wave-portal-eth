const hre = require("hardhat");

const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1")
  });
  await waveContract.deployed();
  console.log("Contract address:", waveContract.address);

  // Get contract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract Balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  const waveTxn = await waveContract.wave("Wave #1 from Rai");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave("Wave #2 from Rai again");
  await waveTxn2.wait();

  // Get contract balance after send a wave.
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract Balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // Get total.
  const waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  /**
   * Add some waves!
   */
  // let waveTxn = await waveContract.wave('A message!');
  // await waveTxn.wait(); // Wait for the transaction to be mined.

  // const [_, randomPerson] = await hre.ethers.getSigners();
  // waveTxn = await waveContract.connect(randomPerson).wave('Another message!');
  // await waveTxn.wait();

  let allWaves = await waveContract.getAllWaves();

  console.log(waveCount.toNumber());
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
