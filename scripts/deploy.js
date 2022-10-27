const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const SimpleStorage = await SimpleStorageFactory.deploy()
  await SimpleStorage.deployed()
  console.log(`deployed to address: ${SimpleStorage.address}`)
  if (network.config.chainId == 5 && process.env.ETHERSCAN_API_KAY) {
    await SimpleStorage.deployTransaction.wait(6)
    await SimpleStorage.verify(SimpleStorage.address, [])
  }

  // Interacting with other smart contracts
  const currentValue = await SimpleStorage.retrieve()
  console.log(`Current Value is: ${currentValue}`)

  // Update the current value
  const transactionResponse = await SimpleStorage.store(7)
  await transactionResponse.wait(1)
  const updateValue = await SimpleStorage.retrieve()
  console.log(`Updated Value is: ${updateValue}`)
}
async function verify(contractAddress, args) {
  console.log("verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
