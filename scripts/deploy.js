async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    const coinFlip = await CoinFlip.deploy();

    console.log("CoinFlip deployed to:", coinFlip.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

    
