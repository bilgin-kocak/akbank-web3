// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
  const CourseRegistrar = await hre.ethers.getContractFactory(
    'CourseRegistrar'
  );
  courseRegistrar = await CourseRegistrar.deploy();
  await courseRegistrar.deployed();
  console.log('CourseRegistrar deployed to:', courseRegistrar.address);

  // Deploy ERC20 CMON token
  const CourseMoney = await hre.ethers.getContractFactory('CourseMoney');
  courseMoney = await CourseMoney.deploy();
  await courseMoney.deployed();
  console.log('CourseMoney deployed to:', courseMoney.address);

  // Deploy Course Contract
  const Course1 = await hre.ethers.getContractFactory('Course');
  course1 = await Course1.deploy(
    'Avalanche Course',
    courseMoney.address,
    ethers.utils.parseEther('100'),
    2,
    courseRegistrar.address
  );
  await course1.deployed();
  console.log('Course1 deployed to:', course1.address);

  const Course2 = await hre.ethers.getContractFactory('Course');
  course2 = await Course2.deploy(
    'Polygon Course',
    courseMoney.address,
    ethers.utils.parseEther('50'),
    2,
    courseRegistrar.address
  );
  await course2.deployed();
  console.log('Course2 deployed to:', course2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
