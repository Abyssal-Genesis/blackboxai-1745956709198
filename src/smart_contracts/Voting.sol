// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Room {
        string name;
        address creator;
        uint256 startTime;
        uint256 endTime;
        bool isPrivate;
        bytes32 roomKeyHash; // hash of room key for private rooms
        bool exists;
    }

    struct Vote {
        bool voted;
        string choice;
    }

    mapping(uint256 => Room) public rooms;
    mapping(uint256 => mapping(address => Vote)) public votes;
    uint256 public roomCount;

    event RoomCreated(uint256 roomId, string name, address creator);
    event VoteCast(uint256 roomId, address voter, string choice);

    modifier onlyDuringVoting(uint256 roomId) {
        require(block.timestamp >= rooms[roomId].startTime, "Voting not started");
        require(block.timestamp <= rooms[roomId].endTime, "Voting ended");
        _;
    }

    function createRoom(
        string memory name,
        uint256 startTime,
        uint256 endTime,
        bool isPrivate,
        string memory roomKey
    ) public returns (uint256) {
        require(endTime > startTime, "Invalid time range");
        roomCount++;
        bytes32 keyHash = isPrivate ? keccak256(abi.encodePacked(roomKey)) : bytes32(0);
        rooms[roomCount] = Room(name, msg.sender, startTime, endTime, isPrivate, keyHash, true);
        emit RoomCreated(roomCount, name, msg.sender);
        return roomCount;
    }

    function castVote(uint256 roomId, string memory choice, string memory roomKey) public onlyDuringVoting(roomId) {
        Room storage room = rooms[roomId];
        require(room.exists, "Room does not exist");
        require(msg.sender != room.creator, "Creator cannot vote");
        if (room.isPrivate) {
            require(keccak256(abi.encodePacked(roomKey)) == room.roomKeyHash, "Invalid room key");
        }
        require(!votes[roomId][msg.sender].voted, "Already voted");
        votes[roomId][msg.sender] = Vote(true, choice);
        emit VoteCast(roomId, msg.sender, choice);
    }

    function hasVoted(uint256 roomId, address user) public view returns (bool) {
        return votes[roomId][user].voted;
    }
}
