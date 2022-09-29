import CourseCard from './CourseCard';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from 'metamask-react';
import avalancheLogo from '../assets/avalanche-avax-logo.svg';
import polygonLogo from '../assets/polygon-matic-logo.svg';

const addresses = require('../contracts/address.json');
const courseRegistrarAbi = require('../contracts/abis/CourseRegistrar.json');
const courseMoneyAbi = require('../contracts/abis/CourseMoney.json');

const nodeURL = 'https://rpc-mumbai.maticvigil.com/';
const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);
function CourseView() {
  const { account } = useMetaMask();

  const [contractCMON, setContractCMON] = useState(null);
  const [contractRegistrar, setContractRegistrar] = useState(null);
  const [courses, setCourses] = useState([]);
  const [allowances, setAllowances] = useState(0);
  const [balance, setBalance] = useState('');
  const [newAllowance, setNewAllowance] = useState(0);

  const logos = [avalancheLogo, polygonLogo];

  useEffect(() => {
    const contractCMON = new ethers.Contract(
      addresses.CourseMoney,
      courseMoneyAbi,
      HTTPSProvider
    );
    setContractCMON(contractCMON);

    const contractRegistrar = new ethers.Contract(
      addresses.CourseRegistrar,
      courseRegistrarAbi,
      HTTPSProvider
    );
    setContractRegistrar(contractRegistrar);
  }, []);

  useEffect(() => {
    if (contractRegistrar) {
      const fetchData = async () => {
        const lastCourseId = await contractRegistrar.getLastCourseId();
        let courses = [];
        for (let i = 0; i < lastCourseId; i++) {
          courses.push(await contractRegistrar.courses(i));
        }
        setCourses(courses);
      };
      fetchData();
    }
  }, [contractRegistrar]);

  useEffect(() => {
    if (contractCMON) {
      const fetchData = async () => {
        const allowanceAvalance = await contractCMON.allowance(
          account,
          addresses.AvalanceCourse
        );
        const allowancePolygon = await contractCMON.allowance(
          account,
          addresses.PolygonCourse
        );
        let allowances = [allowanceAvalance, allowancePolygon];
        setAllowances(allowances);

        const balance = await contractCMON.balanceOf(account);
        setBalance(ethers.utils.formatEther(balance).toString());
      };
      fetchData();
    }
  }, [contractCMON, newAllowance]);

  const getCMON = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      addresses.CourseMoney,
      courseMoneyAbi,
      signer
    );

    const tx = await contract.mint(account, ethers.utils.parseEther('100'));
    await tx.wait();

    const balance = await contractCMON.balanceOf(account);
    setBalance(ethers.utils.formatEther(balance).toString());
  };

  return (
    <div className="container">
      <div className="row">
        <h4>Your Balance: {balance} CMON</h4>
        <span>
          <button className="btn btn-success" onClick={getCMON}>
            Get 100 CMON
          </button>
          <hr></hr>
        </span>
      </div>
      <div className="row">
        {courses.map((course, i) => (
          <div key={i} className="col-4">
            <CourseCard
              course={course}
              allowance={allowances[i]}
              setNewAllowance={setNewAllowance}
              setBalance={setBalance}
              contractCMON={contractCMON}
              image={logos[i]}
              id={i}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseView;
