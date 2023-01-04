import React, { useCallback } from 'react';
import styled from 'styled-components';

const Layout = styled.div`
  text-align: center;
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(/background.png);
  background-size: cover;
  overflow: hidden;
`;
const Wrapper = styled.div`
  margin-top: 40px;
  form {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background-color: #fff;
  }
  select {
    border: none;
    border-bottom: 1px #000 solid;
    width: 70px;
    text-align: center;
    height: 30px;
  }
  button {
    margin-left: 20px;
    border: none;
    border-bottom: 1px #000 solid;
    width: 70px;
    height: 30px;
  }
`;

const JoinPage = () => {
  // const onSubmitForm = useCallback(() => {}, []);
  return (
    <Layout>
      <Wrapper>
        <h1>Hello, Enter your information and Proceed.</h1>
        <form>
          <select>
            <option value='male'>남성</option>
            <option value='female'>여성</option>
          </select>
          <select>
            <option value='10'>10대</option>
            <option value='10'>20대</option>
            <option value='10'>30대</option>
            <option value='10'>40대</option>
            <option value='10'>50대</option>
            <option value='10'>60대</option>
            <option value='10'>70대</option>
          </select>
          <button>Go!</button>
        </form>
      </Wrapper>
    </Layout>
  );
};

export default JoinPage;
