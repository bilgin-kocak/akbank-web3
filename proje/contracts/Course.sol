//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CourseRegistrar.sol";

contract Course {
    address public dean;
    uint256 public sessions;
    uint256 public courseAmount;
    string public courseName;
    IERC20 public CMON;
    bool public open;
    struct Student {
        address wallet;
        uint256 lastping;
        uint256 tuitionFee;
        uint256 pingcount;
        bool completed;
    }
    Student[] public cohort;

    event Completed(address indexed student);
    event RegistrationClosed(bool status);

    constructor(
        string memory _name,
        address _token,
        uint256 _amount,
        uint256 _sessions,
        address _courseRegistrar
    ) {
        sessions = _sessions; // How many sessions the course have
        CMON = IERC20(_token); // Course payment currency
        open = true; // Course is started
        dean = msg.sender; // Dean of university
        courseAmount = _amount; // Course price
        courseName = _name; // Course name
        CourseRegistrar(_courseRegistrar).registerCourse(
            address(this),
            _name,
            _amount,
            _token
        );
    }

    // This function check whether given addess is student of this course
    function isStudent(address _target) public view returns (bool, uint256) {
        for (uint256 i = 0; i < cohort.length; i++) {
            if (cohort[i].wallet == _target) return (true, i);
        }
        return (false, 0);
    }

    // Register the student
    function register(uint256 amount) external payable {
        require(open == true, "The cohort is now closed, try again next time!");
        (bool tf, ) = isStudent(msg.sender);
        require(tf == false, "You are already registered");
        require(amount == courseAmount, "Please pay the tuition fee");
        cohort.push(Student(msg.sender, block.timestamp, amount, 0, false));

        CMON.transferFrom(msg.sender, address(this), amount);

        // LearnToken.mint??? mint msg.value*100
        // mint();
    }

    // This function will run after the session of the course finished. After the last session, the course completed.
    function ping() external {
        (bool tf, uint256 idx) = isStudent(msg.sender);
        require(tf == true, "You are not a student");
        require(
            cohort[idx].completed == false,
            "You have already completed the course"
        );
        Student memory studentIdx = cohort[idx];
        studentIdx.lastping = block.timestamp;
        studentIdx.pingcount++;
        if (studentIdx.pingcount == sessions) {
            studentIdx.completed = true;
            cohort[idx] = studentIdx;
            // On completion of course student earn
            CMON.transfer(msg.sender, courseAmount / 10);
            emit Completed(msg.sender);
        } else {
            cohort[idx] = studentIdx;
        }

        // on completion of work mint 1 LEARN
    }

    // This function returns true if all students completed the course
    function allComplete() public returns (bool, uint256) {
        uint256 complete = 0;
        uint256 totalShares = 0;
        for (uint256 j = 0; j < cohort.length; j++) {
            totalShares += cohort[j].pingcount;
            if ((block.timestamp - cohort[j].lastping) > 3 days) {
                cohort[j].completed = true;
            }
            if (cohort[j].completed == true) complete++;
        }
        return complete == cohort.length ? (true, totalShares) : (false, 0);
    }

    // This function can close the course
    function closeRegistration() external {
        require(msg.sender == dean, "You are not the dean");
        require(open == true, "Registration for this cohort is already closed");
        open = false;
        // Submit event for keeper @TEDDY
        emit RegistrationClosed(true);
    }

    // This function gives total deposit amount
    function totalDeposit() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 l = 0; l < cohort.length; l++) {
            total += cohort[l].tuitionFee;
        }
        return total;
    }
}
