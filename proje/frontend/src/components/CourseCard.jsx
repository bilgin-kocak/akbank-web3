import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
const addresses = require('../contracts/address.json');
const courseMoneyAbi = require('../contracts/abis/CourseMoney.json');
const courseAbi = require('../contracts/abis/Course.json');

const nodeURL = 'https://rpc-mumbai.maticvigil.com/';
const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);
function CourseCard(props) {
  const { courseName, coursePrice, courseAddress, registered } = props.course;
  const [contractCourse, setContractCourse] = useState(null);
  const [isStudent, setIsStudent] = useState(false);
  const [graduated, setGraduated] = useState(false);
  useEffect(() => {
    const contractCourse = new ethers.Contract(
      courseAddress,
      courseAbi,
      HTTPSProvider
    );
    setContractCourse(contractCourse);
  }, []);

  useEffect(() => {
    if (contractCourse) {
      const fetchData = async () => {
        const isStudent = await contractCourse.isStudent(
          window.ethereum.selectedAddress
        );
        setIsStudent(isStudent[0]);

        const isGraduated = await contractCourse.isGraduated(
          window.ethereum.selectedAddress
        );
        setGraduated(isGraduated);
      };
      fetchData();
    }
  }, [contractCourse]);

  const approve = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      addresses.CourseMoney,
      courseMoneyAbi,
      signer
    );

    const tx = await contract.approve(
      courseAddress,
      ethers.constants.MaxUint256
    );
    await tx.wait();
    props.setNewAllowance((prev) => prev + 1);
  };

  const register = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(courseAddress, courseAbi, signer);

    const tx = await contract.register(coursePrice, { gasLimit: 1000000 });
    await tx.wait();
    const fetchData = async () => {
      const isStudent = await contractCourse.isStudent(
        window.ethereum.selectedAddress
      );
      setIsStudent(isStudent[0]);
    };
    fetchData();
    const balance = await props.contractCMON.balanceOf(
      window.ethereum.selectedAddress
    );
    props.setBalance(ethers.utils.formatEther(balance).toString());
  };

  const complete = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(courseAddress, courseAbi, signer);

    let tx = await contract.ping();
    await tx.wait();

    tx = await contract.ping();
    await tx.wait();
    const balance = await props.contractCMON.balanceOf(
      window.ethereum.selectedAddress
    );
    props.setBalance(ethers.utils.formatEther(balance).toString());

    const isGraduated = await contract.isGraduated(
      window.ethereum.selectedAddress
    );
    setGraduated(isGraduated);
  };

  const button = () => {
    if (isStudent) {
      if (!graduated) {
        return (
          <Button variant="primary" onClick={complete}>
            Graduate
          </Button>
        );
      } else {
        return (
          <Button variant="primary" disabled>
            Graduated
          </Button>
        );
      }
    } else if (props.allowance.gt(100)) {
      return (
        <Button variant="primary" onClick={register}>
          Register
        </Button>
      );
    } else {
      return (
        <Button variant="primary" onClick={approve}>
          Approve
        </Button>
      );
    }
  };

  return (
    <Card style={{ width: '18rem' }}>
      {props.id === 0 ? (
        <center>
          <Card.Img
            variant="top"
            style={{ width: '13.4rem' }}
            src={props.image}
          />
        </center>
      ) : (
        <Card.Img variant="top" src={props.image} />
      )}

      <Card.Body>
        <Card.Title>{courseName}</Card.Title>
        <Card.Text>
          {ethers.utils.formatEther(coursePrice).toString()} CMON
        </Card.Text>
        {button()}
      </Card.Body>
    </Card>
  );
}

export default CourseCard;
