import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useMetaMask } from 'metamask-react';

function NavBar() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  console.log('status', status);
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">Learn2Earn</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {status === 'connected' ? (
          <button className="btn btn-outline-success my-2 my-sm-0" disabled>
            Connected
          </button>
        ) : (
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            onClick={connect}
          >
            Connect
          </button>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
