const { expect } = require('chai');
const hre = require('hardhat');
const { Wallet, provider } = require('ethers');
const { ethers } = require('hardhat');

describe('CourseRegistrar', async function () {
  let courseRegistrar, courseMoney, course, student1, student2;

  beforeEach(async function () {
    // runs once before the first test in this block
    const CourseRegistrar = await hre.ethers.getContractFactory(
      'CourseRegistrar'
    );
    courseRegistrar = await CourseRegistrar.deploy();
    await courseRegistrar.deployed();

    // Deploy ERC20 CMON token
    const CourseMoney = await hre.ethers.getContractFactory('CourseMoney');
    courseMoney = await CourseMoney.deploy();
    await courseMoney.deployed();

    // Deploy Course Contract
    const Course = await hre.ethers.getContractFactory('Course');
    course = await Course.deploy(
      'Avalanche Course',
      courseMoney.address,
      ethers.utils.parseEther('100'),
      2,
      courseRegistrar.address
    );
    await course.deployed();

    // Create users
    const [owner, addr1, addr2] = await ethers.getSigners();
    student1 = addr1;
    student2 = addr2;

    // Set students balance
    await courseMoney.mint(
      student1.address,
      hre.ethers.utils.parseEther('500')
    );
    await courseMoney.mint(
      student2.address,
      hre.ethers.utils.parseEther('500')
    );

    // Approve students
    await courseMoney
      .connect(student1)
      .approve(course.address, hre.ethers.constants.MaxUint256);
    await courseMoney
      .connect(student2)
      .approve(course.address, hre.ethers.constants.MaxUint256);
  });

  it('Should register and unregister course', async function () {
    // Register course
    const courseName = await course.courseName();
    const coursePrice = await course.courseAmount();
    courseRegistrar.registerCourse(
      course.address,
      courseName,
      coursePrice,
      courseMoney.address
    );
    let course_ = await courseRegistrar.courses(0);
    // Check if course is registered
    expect(course_.courseName).to.equal(courseName);
    expect(course_.coursePrice).to.equal(coursePrice);
    expect(course_.courseAddress).to.equal(course.address);
    expect(course_.registered).to.equal(true);

    // Unregister course
    courseRegistrar.unregisterCourse(0);
    // Check if course is unregistered
    course_ = await courseRegistrar.courses(0);
    expect(course_.registered).to.equal(false);
  });

  it('Cannot register course when paused', async function () {
    await courseRegistrar.pause();

    // Register course
    const courseName = await course.courseName();
    const coursePrice = await course.courseAmount();
    expect(
      courseRegistrar.registerCourse(
        course.address,
        courseName,
        coursePrice,
        courseMoney.address
      )
    ).to.be.rejectedWith('Pausable: paused');
  });

  it('Register two different students', async function () {
    // Register course
    const courseName = await course.courseName();
    const coursePrice = await course.courseAmount();
    courseRegistrar.registerCourse(
      course.address,
      courseName,
      coursePrice,
      courseMoney.address
    );
    let course_ = await courseRegistrar.courses(0);

    // Register student 1
    await course.connect(student1).register(ethers.utils.parseEther('100'));

    // Register student 2
    await course.connect(student2).register(ethers.utils.parseEther('100'));

    // Check if students are registered
    const std1 = await course.cohort(0);
    expect(std1.wallet).to.equal(student1.address);

    const std2 = await course.cohort(1);
    expect(std2.wallet).to.equal(student2.address);
  });

  it('Student complete the course', async function () {
    // Register student 1
    await course.connect(student1).register(ethers.utils.parseEther('100'));
    // After two ping student can complete the course
    await course.connect(student1).ping();

    // Check if students are completed
    let std1 = await course.cohort(0);
    expect(std1.completed).to.equal(false);

    await course.connect(student1).ping();
    std1 = await course.cohort(0);
    expect(std1.completed).to.equal(true);
  });

  it('Student get reward after compilation of course', async function () {
    // Register student 1
    await course.connect(student1).register(ethers.utils.parseEther('100'));

    const beforeBalance = await courseMoney.balanceOf(student1.address);

    // After two ping student can complete the course
    await course.connect(student1).ping();
    await course.connect(student1).ping();

    const afterBalance = await courseMoney.balanceOf(student1.address);
    // Student should get reward after completion of course 10 CMON
    expect(afterBalance.sub(beforeBalance)).to.equal(
      ethers.utils.parseEther('10')
    );
  });

  it('Should close registration', async function () {
    // Register student 1
    await course.closeRegistration();

    expect(
      course.connect(student1).register(ethers.utils.parseEther('100'))
    ).to.be.rejectedWith('The cohort is now closed, try again next time!');
  });
});
