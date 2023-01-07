import React from 'react';
import styled from 'styled-components';
import logo from '../utils/img/logo.png';

// styled
const NavBar = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #243763;
  border-bottom: 2px solid #0a2647;
  img {
    width: 100px;
  }
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-weight: 700;
  color: #ff6e31;
`;
const Info = styled.div`
  color: #fff;
`;
// End styled

const Nav = () => {
  return (
    <NavBar>
      <Wrapper>
        <Logo>
          <img src={logo} alt='logo' />
          <div>OpenAPI PJ</div>
        </Logo>
        <Info>
          <div>Hello, project is for utilizing open API.</div>
          <div>made by chanho</div>
        </Info>
      </Wrapper>
    </NavBar>
  );
};

export default Nav;
