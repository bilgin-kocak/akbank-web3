//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CourseRegistrar is Ownable, Pausable {
    using Counters for Counters.Counter;

    Counters.Counter private _courseIdCounter;

    mapping(uint256 => Course) public courses;

    struct Course {
        address courseAddress;
        string courseName;
        uint256 coursePrice;
        address currency;
        uint256 startStamp;
        bool registered;
    }

    constructor() {}

    // Pause the registration of course
    function pause() public onlyOwner {
        _pause();
    }

    // Unpause the registration of course
    function unpause() public onlyOwner {
        _unpause();
    }

    // Register the course
    function registerCourse(
        address _courseAddress,
        string memory _courseName,
        uint256 _coursePrice,
        address _currency
    ) public whenNotPaused {
        uint256 courseId = _courseIdCounter.current();
        _courseIdCounter.increment();
        // Register the course to the mapping
        courses[courseId] = Course(
            _courseAddress,
            _courseName,
            _coursePrice,
            _currency,
            block.timestamp,
            true
        );
    }

    // Unregister the course
    function unregisterCourse(uint256 courseId) public onlyOwner {
        courses[courseId].registered = false;
    }

    // Get the course count
    function getLastCourseId() public view returns (uint256) {
        return _courseIdCounter.current();
    }
}
